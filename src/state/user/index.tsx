import {type ReactNode, useContext, useEffect, useState} from 'react';
import {AuthContext, ErrorContext, UserContext} from '../';
import type {UserSearchCriteria} from '../../api/client/user';
import * as apiUser from '../../api/client/user';
import type {Authority, User, UserData, UserProfile} from '../../api/model/porez';
import type {ClientResponse} from '../../api/client';

const UserProvider = ({children}: { children: ReactNode }) => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [busy, setBusy] = useState(false);
    const [previous, setPrevious] = useState(false);
    const [next, setNext] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [criteria, setCriteria] = useState<UserSearchCriteria>();
    const [data, setData] = useState<User[]>();

    useEffect(() => {
        if (authState?.accessToken) {
            getUsers().then();
        }
    }, [criteria, page]);

    const createData = (): User[] => {
        if (data) {
            return [...data];
        }
        return [];
    }

    const handleResponse = (response: ClientResponse<User>) => {
        if (response?.data) {
            const newData = createData();
            const index = newData.findIndex(item => item.id === response.data?.id);
            if (index !== -1) {
                newData[index] = response.data;
            }
            setData(newData);
        }
    }

    const isEditEnabled = (user: User) => user.id !== authState?.user?.id;

    const getUsers = async () => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await apiUser.getUsers(criteria, {
                    page,
                    size: 10,
                    sort: {field: 'email', asc: true}
                }, authState?.accessToken);
                setTotalPages(response.data?.totalPages ?? 0);
                setPrevious(!(response.data?.first ?? true));
                setNext(!(response.data?.last ?? true));
                setData(response.data?.content);
                errorState?.addError(response.error);
            }
        } finally {
            setBusy(false);
        }
    }

    const addUser = async (userData: UserData) => {
        setBusy(true);
        try {
            const response = await apiUser.addUser(userData, authState?.accessToken);
            if (response.data) {
                const newData = [response.data, ...createData()];
                setData(newData);
            }
            errorState?.addError(response.error);
        } finally {
            setBusy(false);
        }
    }

    const setAuthorities = async (id: string, authorities: Authority[]) => {
        setBusy(true);
        try {
            const response = await apiUser.setUserAuthorities(id, authorities, authState?.accessToken);
            handleResponse(response);
            errorState?.addError(response?.error);
        } finally {
            setBusy(false);
        }
    }

    const setEmail = async (id: string, email: string) => {
        setBusy(true);
        try {
            const response = await apiUser.setUserEmail(id, email, authState?.accessToken);
            handleResponse(response);
            errorState?.addError(response?.error);
        } finally {
            setBusy(false);
        }
    }

    const setEnabled = async (id: string, enabled: boolean) => {
        setBusy(true);
        try {
            const response = await apiUser.setUserEnabled(id, enabled, authState?.accessToken);
            handleResponse(response);
            errorState?.addError(response?.error);
        } finally {
            setBusy(false);
        }
    }

    const setProfile = async (id: string, profile: UserProfile) => {
        setBusy(true);
        try {
            const response = await apiUser.setUserProfile(id, profile, authState?.accessToken);
            handleResponse(response);
            errorState?.addError(response?.error);
        } finally {
            setBusy(false);
        }
    }

    const confirmUser = async (id: string) => {
        setBusy(true);
        try {
            const response = await apiUser.setUserConfirmed(id, authState?.accessToken);
            handleResponse(response);
            errorState?.addError(response?.error);
        } finally {
            setBusy(false);
        }
    }

    const deleteUser = async (id: string) => {
        setBusy(true);
        try {
            const response = await apiUser.deleteUser(id, authState?.accessToken);
            if (!response.error) {
                const newData = createData();
                const index = newData.findIndex(item => item.id === id);
                if (index !== -1) {
                    newData.splice(index, 1);
                }
                setData(newData);
            }
            errorState?.addError(response?.error);
        } finally {
            setBusy(false);
        }
    }

    return (
        <UserContext.Provider
            value={
                {
                    busy,
                    isEditEnabled,
                    previous,
                    next,
                    page,
                    totalPages,
                    setPage,
                    setCriteria,
                    data,
                    getUsers,
                    addUser,
                    setAuthorities,
                    setEmail,
                    setEnabled,
                    setProfile,
                    confirmUser,
                    deleteUser
                }
            }
        >{children}
        </UserContext.Provider>
    )
}

export default UserProvider;
