import {useContext, useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {AuthContext} from "../../state";
import {REFRESH_TIMEOUT} from "../../state/auth";

// Warn when the refresh token will expire within this window.
// Using 3 * REFRESH_TIMEOUT keeps your original 15-minute heads-up.
const WARN_BEFORE_MS = 3 * REFRESH_TIMEOUT; // 15 minutes by default

const AccessExpiration = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const authState = useContext(AuthContext);

    const timeToRefreshExpiration = authState?.timeToRefreshExpiration ?? 0;
    const isLoggedIn = Boolean(authState?.user);

    // Decide whether to show the warning based on REFRESH (not access) expiry
    const shouldWarn = useMemo(() => {
        if (!isLoggedIn) return false;
        if (timeToRefreshExpiration <= 0) return false; // already expired, handle below
        return timeToRefreshExpiration <= WARN_BEFORE_MS;
    }, [isLoggedIn, timeToRefreshExpiration]);

    const [show, setShow] = useState(shouldWarn);

    useEffect(() => {
        setShow(shouldWarn);
    }, [shouldWarn]);

    // Optional: if refresh token expires, bounce to sign-in
    useEffect(() => {
        if (!isLoggedIn) return;
        if (timeToRefreshExpiration === 0) {
            // include a return path + reason
            const from = encodeURIComponent(location.pathname + location.search);
            navigate(`/auth/sign-in?from=${from}`, {
                replace: true,
                state: {reason: "refresh-expired"},
            });
        }
    }, [isLoggedIn, timeToRefreshExpiration, navigate, location]);

    if (!show) return null;

    return (
        <div className="alert alert-warning text-xs">
            <span>Platnosť prihlásenia čoskoro vyprší.</span>
            <button
                className="btn btn-sm normal-case text-xs"
                onClick={() => {
                    const from = encodeURIComponent(location.pathname + location.search);
                    navigate(`/auth/sign-in?from=${from}`);
                }}
            >
                Obnoviť
            </button>
        </div>
    );
};

export default AccessExpiration;
