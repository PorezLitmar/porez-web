import {CONTEXT_PATH, getData, patchData, postData} from '../';
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
} from '../../model/porez';

const PATH = CONTEXT_PATH + 'auth';

export const changeEmail = (changeEmail: ChangeEmail, accessToken?: string) => {
    return patchData<AuthenticationResponse>(PATH + '/change-email', changeEmail, accessToken);
}

export const changePassword = (changePassword: ChangePassword, accessToken?: string) => {
    return patchData<AuthenticationResponse>(PATH + '/change-password', changePassword, accessToken);
}

export const changeUserProfile = (changeUserProfile: ChangeUserProfile, accessToken?: string) => {
    return patchData<AuthenticationResponse>(PATH + '/change-user-profile', changeUserProfile, accessToken);
}

export const confirmPassword = (confirmation: PasswordConfirmation) => {
    return postData<AuthenticationResponse>(PATH + '/confirm-password', confirmation);
}

export const refresh = (refresh: Refresh) => {
    return postData<AuthenticationResponse>(PATH + '/refresh', refresh);
}

export const resetPassword = (resetPassword: ResetPassword) => {
    return postData<void>(PATH + '/reset-password', resetPassword);
}

export const signIn = (signIn: SignIn) => {
    return postData<AuthenticationResponse>(PATH + '/sign-in', signIn);
}

export const signUp = (signUp: SignUp) => {
    return postData<void>(PATH + '/sign-up', signUp);
}

export const getCurrentUser = (accessToken?: string) => {
    return getData<User>(PATH + '/user', undefined, accessToken);
}