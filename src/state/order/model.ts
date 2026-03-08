import type {OrderSearchCriteria} from '../../api/client/order';
import type {Order, OrderStatusData} from '../../api/model/porez';
import type {ClientResponse} from '../../api/client';

export interface OrderState {
    busy: boolean,
    previous: boolean,
    next: boolean,
    page: number,
    totalPages: number,
    setPage: (page: number) => void,
    setCriteria: (criteria?: OrderSearchCriteria) => void,
    data?: Order[],
    getOrders: () => Promise<void>,
    addOrder: () => Promise<ClientResponse<Order>>,
    recountOrder: (id: string) => Promise<ClientResponse<Order>>,
    setOrderStatus: (id: string, data: OrderStatusData) => Promise<ClientResponse<Order>>,
    deleteOrder: (id: string) => Promise<ClientResponse<void>>
}