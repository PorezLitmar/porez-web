import {CONTEXT_PATH, deleteData, getData, patchData, postData, setPageableQueryParams, setQueryParam} from '../';
import type {Pageable} from '../../model';
import type {User, UserData, UserPage, UserProfile} from '../../model/porez';
import {Authority} from '../../model/porez';

const PATH = CONTEXT_PATH + 'users';

export interface UserSearchCriteria {
    searchField?: string;
    email?: string;
}

export const getUsers = (criteria?: UserSearchCriteria, pageable?: Pageable, accessToken?: string) => {
    const queryParams = new URLSearchParams();
    setPageableQueryParams(queryParams, pageable);
    if (criteria) {
        if (criteria.searchField) {
            setQueryParam(queryParams, 'searchField', criteria.searchField);
        }
        if (criteria.email) {
            setQueryParam(queryParams, 'email', criteria.email);
        }
    }
    return getData<UserPage>(PATH, queryParams, accessToken);
}

export const addUser = (userData: UserData, accessToken?: string) => {
    return postData<User>(PATH, userData, accessToken);
}

export const deleteUser = (id: string, accessToken?: string) => {
    return deleteData<void>(PATH + '/' + id, accessToken);
}

export const getUser = (id: string, accessToken?: string) => {
    return getData<User>(PATH + '/' + id, undefined, accessToken);
}

export const setUserProfile = (id: string, userProfile: UserProfile, accessToken?: string) => {
    return patchData<User>(PATH + '/' + id, userProfile, accessToken);
}

export const setUserAuthorities = (id: string, authorities: Authority[], accessToken?: string) => {
    return patchData<User>(PATH + '/' + id + '/authorities', authorities, accessToken);
}

export const setUserConfirmed = (id: string, accessToken?: string) => {
    return postData<User>(PATH + '/' + id + '/confirm', undefined, accessToken);
}

export const setUserEmail = (id: string, email: string, accessToken?: string) => {
    return patchData<User>(PATH + '/' + id + '/email', {email: email}, accessToken);
}

export const setUserEnabled = (id: string, enabled: boolean, accessToken?: string) => {
    return patchData<User>(PATH + '/' + id + '/enable', {value: enabled}, accessToken);
}