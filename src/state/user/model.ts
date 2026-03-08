import type {Authority, User, UserData, UserProfile} from '../../api/model/porez';
import type {UserSearchCriteria} from '../../api/client/user';

export interface UserState {
    busy: boolean,
    isEditEnabled: (user: User) => boolean,
    previous: boolean,
    next: boolean,
    page: number,
    totalPages: number,
    setPage: (page: number) => void,
    setCriteria: (criteria?: UserSearchCriteria) => void,
    data?: User[],
    getUsers: () => Promise<void>,
    addUser: (data: UserData) => Promise<void>,
    setAuthorities: (id: string, authorities: Authority[]) => Promise<void>,
    setEmail: (id: string, email: string) => Promise<void>,
    setEnabled: (id: string, enabled: boolean) => Promise<void>,
    setProfile: (id: string, profile: UserProfile) => Promise<void>,
    confirmUser: (id: string) => Promise<void>,
    deleteUser: (id: string) => Promise<void>
}