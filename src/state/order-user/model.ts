import type {OrderUserSearchCriteria} from '../../api/client/order';
import type {OrderUser} from '../../api/model/porez';

export interface OrderUserState {
    busy: boolean,
    previous: boolean,
    next: boolean,
    page: number,
    totalPages: number,
    setPage: (page: number) => void,
    setCriteria: (criteria?: OrderUserSearchCriteria) => void,
    data?: OrderUser[],
    getOrderUsers: () => Promise<void>,
}