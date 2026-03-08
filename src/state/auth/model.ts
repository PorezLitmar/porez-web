import type {ClientResponse} from '../../api/client';
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
    User
} from '../../api/model/porez';

export interface AuthState {
    busy: boolean,
    accessToken?: string,
    refreshToken?: string,
    user?: User,
    timeToAccessExpiration: number,
    timeToRefreshExpiration: number,
    adminAuthority: boolean,
    managerAuthority: boolean,
    employeeAuthority: boolean,
    customerAuthority: boolean,
    signIn: (signIn: SignIn) => Promise<ClientResponse<AuthenticationResponse>>,
    signOut: () => Promise<void>,
    signUp: (signUp: SignUp) => Promise<ClientResponse<void>>,
    confirmPassword: (passwordConfirmation: PasswordConfirmation) => Promise<ClientResponse<AuthenticationResponse>>,
    resetPassword: (resetPassword: ResetPassword) => Promise<ClientResponse<void>>,
    changePassword: (changePassword: ChangePassword) => Promise<ClientResponse<AuthenticationResponse>>,
    changeEmail: (changeEmail: ChangeEmail) => Promise<ClientResponse<AuthenticationResponse>>,
    changeUserProfile: (changeUserProfile: ChangeUserProfile) => Promise<ClientResponse<AuthenticationResponse>>,
    refresh: (refresh: Refresh) => Promise<ClientResponse<AuthenticationResponse>>,
}
