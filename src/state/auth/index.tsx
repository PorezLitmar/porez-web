import type {JwtPayload} from 'jwt-decode';
import {jwtDecode} from 'jwt-decode';
import type {ReactNode} from 'react';
import {useContext, useEffect, useMemo, useRef, useState} from 'react';

import {AppContext, AuthContext} from '../';
import type {ClientResponse} from '../../api/client';
import * as authApi from '../../api/client/auth';
import type {
    AuthenticationResponse,
    ChangeEmail,
    ChangePassword,
    ChangeUserProfile,
    PasswordConfirmation,
    Refresh,
    ResetPassword,
    SignIn,
    SignUp,
    User,
} from '../../api/model/porez';
import {Authority} from '../../api/model/porez';

const REFRESH_TOKEN_KEY = 'refresh-token';

// how often we “tick” to check timers (ms)
export const REFRESH_TIMEOUT = 300_000; // 5 min

interface AuthData {
    accessToken: string;
    accessJwtPayload: JwtPayload;
    timeToAccessExpiration: number;
    user: User;
}

interface RefreshData {
    refreshToken: string;
    refreshJwtPayload: JwtPayload;
    timeToRefreshExpiration: number;
}

const getTimeToExpiration = (jwt?: JwtPayload) => {
    const ms = jwt ? (jwt.exp ?? 0) * 1000 - Date.now() : 0;
    return ms > 0 ? ms : 0;
};

const AuthProvider = ({children}: { children: ReactNode }) => {
    const appState = useContext(AppContext);

    const [busy, setBusy] = useState(false);
    const [authData, setAuthData] = useState<AuthData>();
    const [refreshData, setRefreshData] = useState<RefreshData>();
    const tickRef = useRef<number | null>(null);

    const hasAnyAuthority = (data: AuthData | undefined, ...authorities: string[]) => {
        if (!data?.accessJwtPayload?.exp) return false;

        const aud = data.accessJwtPayload?.aud;
        let hasAuthority = false;

        if (Array.isArray(aud)) hasAuthority = aud.some((a) => authorities.includes(a));
        else if (typeof aud === 'string') hasAuthority = authorities.includes(aud);

        return Boolean(
            hasAuthority &&
            (data.user?.confirmed ?? false) &&
            (data.user?.enabled ?? false) &&
            getTimeToExpiration(data.accessJwtPayload) > 0,
        );
    };

    // role flags derived from authData
    const {adminAuthority, managerAuthority, employeeAuthority, customerAuthority} = useMemo(() => {
        const has = (...auths: string[]) => hasAnyAuthority(authData, ...auths);
        return {
            customerAuthority: has(Authority.P_CUSTOMER),
            employeeAuthority: has(Authority.P_EMPLOYEE),
            managerAuthority: has(Authority.P_MANAGER),
            adminAuthority: has(Authority.P_ADMIN),
        };
    }, [authData]);

    // ---- helpers ----

    const cleanState = () => {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        setAuthData(undefined);
        setRefreshData(undefined);
    };

    const setAccessToken = async (accessToken?: string) => {
        if (!accessToken) {
            cleanState();
            return;
        }
        try {
            const accessJwtPayload = jwtDecode<JwtPayload>(accessToken);
            const timeToAccessExpiration = getTimeToExpiration(accessJwtPayload);
            if (timeToAccessExpiration <= 0) {
                cleanState();
                return;
            }
            const response = await authApi.getCurrentUser(accessToken);
            if (response.data) {
                setAuthData({
                    accessToken,
                    accessJwtPayload,
                    timeToAccessExpiration,
                    user: response.data,
                });
                return;
            }
            if (response.error) console.log(response.error);
        } catch (e) {
            console.error(e);
        }
        cleanState();
    };

    const setRefreshToken = async (refreshToken?: string) => {
        if (!refreshToken) {
            if (appState?.cookiesEnabled) localStorage.removeItem(REFRESH_TOKEN_KEY);
            setRefreshData(undefined);
            return;
        }
        try {
            const refreshJwtPayload = jwtDecode<JwtPayload>(refreshToken);
            const timeToRefreshExpiration = getTimeToExpiration(refreshJwtPayload);
            if (timeToRefreshExpiration <= 0) {
                cleanState();
                return;
            }
            if (appState?.cookiesEnabled) {
                localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
            }
            setRefreshData({
                refreshToken,
                refreshJwtPayload,
                timeToRefreshExpiration,
            });
        } catch (e) {
            console.error(e);
            cleanState();
        }
    };

    const handleAuthenticationResponse = async (response: ClientResponse<AuthenticationResponse>) => {
        if (!response.data) {
            cleanState();
            return;
        }
        const {accessToken, refreshToken} = response.data;
        await setRefreshToken(refreshToken);
        await setAccessToken(accessToken);
    };

    const doRefreshWithStoredToken = async (tokenOverride?: string) => {
        const refreshToken = tokenOverride ?? refreshData?.refreshToken;
        if (!refreshToken) return;
        const payload: Refresh = {refreshToken};
        const response = await authApi.refresh(payload);
        await handleAuthenticationResponse(response);
        return response;
    };

    // ---- initial boot: autologin if refresh token is present ----
    useEffect(() => {
        if (!appState?.cookiesEnabled) return;

        const stored = localStorage.getItem(REFRESH_TOKEN_KEY) || undefined;
        if (!stored) return;

        (async () => {
            setBusy(true);
            try {
                // validate + store refresh token
                await setRefreshToken(stored);
                // try to get fresh access token + user
                await doRefreshWithStoredToken(stored);
            } catch (e) {
                console.error(e);
                cleanState();
            } finally {
                setBusy(false);
            }
        })();
    }, [appState?.cookiesEnabled]);

    // ---- periodic ticker (cleaned up correctly) ----
    useEffect(() => {
        // create one interval on mount
        tickRef.current = window.setInterval(() => {
            // update countdowns
            setAuthData((prev) =>
                prev
                    ? {
                        ...prev,
                        timeToAccessExpiration: getTimeToExpiration(prev.accessJwtPayload),
                    }
                    : prev,
            );

            setRefreshData((prev) =>
                prev
                    ? {
                        ...prev,
                        timeToRefreshExpiration: getTimeToExpiration(prev.refreshJwtPayload),
                    }
                    : prev,
            );
        }, REFRESH_TIMEOUT);

        return () => {
            if (tickRef.current !== null) {
                clearInterval(tickRef.current);
                tickRef.current = null;
            }
        };
    }, []);

    // ---- proactively refresh access token when it's close to expiring ----
    useEffect(() => {
        const nearExpiryMs = 60_000; // refresh 1 min before access token expiry
        if (!authData || !refreshData) return;
        if (authData.timeToAccessExpiration > nearExpiryMs) return;

        // avoid spamming refresh: only run when we genuinely cross the threshold
        let cancelled = false;
        (async () => {
            try {
                await doRefreshWithStoredToken();
            } catch (e) {
                console.error(e);
                if (!cancelled) cleanState();
            }
        })();

        return () => {
            cancelled = true;
        };
        // re-evaluate when access-time-left changes or refresh token changes
    }, [authData?.timeToAccessExpiration, refreshData?.refreshToken]);

    // ---- if refresh token is expired, sign out ----
    useEffect(() => {
        if (!refreshData) return;
        if (refreshData.timeToRefreshExpiration === 0) {
            cleanState();
        }
    }, [refreshData?.timeToRefreshExpiration]);

    // ---------------- API methods ----------------

    const signIn = async (signIn: SignIn) => {
        setBusy(true);
        try {
            const response = await authApi.signIn(signIn);
            await handleAuthenticationResponse(response);
            return response;
        } finally {
            setBusy(false);
        }
    };

    const signOut = async () => {
        setBusy(true);
        try {
            cleanState();
        } finally {
            setBusy(false);
        }
    };

    const signUp = async (signUp: SignUp) => {
        setBusy(true);
        try {
            return await authApi.signUp(signUp);
        } finally {
            setBusy(false);
        }
    };

    const confirmPassword = async (passwordConfirmation: PasswordConfirmation) => {
        setBusy(true);
        try {
            const response = await authApi.confirmPassword(passwordConfirmation);
            await handleAuthenticationResponse(response);
            return response;
        } finally {
            setBusy(false);
        }
    };

    const resetPassword = async (resetPassword: ResetPassword) => {
        setBusy(true);
        try {
            return await authApi.resetPassword(resetPassword);
        } finally {
            setBusy(false);
        }
    };

    const changePassword = async (changePassword: ChangePassword) => {
        setBusy(true);
        try {
            const response = await authApi.changePassword(changePassword, authData?.accessToken);
            if (!response.error) await handleAuthenticationResponse(response);
            return response;
        } finally {
            setBusy(false);
        }
    };

    const changeEmail = async (changeEmail: ChangeEmail) => {
        setBusy(true);
        try {
            const response = await authApi.changeEmail(changeEmail, authData?.accessToken);
            if (!response.error) await handleAuthenticationResponse(response);
            return response;
        } finally {
            setBusy(false);
        }
    };

    const changeUserProfile = async (changeUserProfile: ChangeUserProfile) => {
        setBusy(true);
        try {
            const response = await authApi.changeUserProfile(changeUserProfile, authData?.accessToken);
            if (!response.error) await handleAuthenticationResponse(response);
            return response;
        } finally {
            setBusy(false);
        }
    };

    const refresh = async (refreshBody: Refresh) => {
        setBusy(true);
        try {
            const response = await authApi.refresh(refreshBody);
            await handleAuthenticationResponse(response);
            return response;
        } finally {
            setBusy(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                busy,
                accessToken: authData?.accessToken,
                refreshToken: refreshData?.refreshToken,
                user: authData?.user,
                timeToAccessExpiration: authData?.timeToAccessExpiration ?? 0,
                timeToRefreshExpiration: refreshData?.timeToRefreshExpiration ?? 0,
                adminAuthority,
                managerAuthority,
                employeeAuthority,
                customerAuthority,
                signIn,
                signOut,
                signUp,
                confirmPassword,
                resetPassword,
                changePassword,
                changeEmail,
                changeUserProfile,
                refresh,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
