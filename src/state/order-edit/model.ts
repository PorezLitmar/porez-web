import type {Order, OrderCommentData, OrderContact, OrderData, SendOrder, StringValue} from '../../api/model/porez';
import {Authority} from '../../api/model/porez';
import type {ClientResponse} from '../../api/client';

export interface OrderEditState {
    busy: boolean,
    editEnabled: (authority: Authority, order?: Order) => boolean,
    submitEnabled: (order?: Order) => boolean,
    orderFinal: (order?: Order) => boolean,
    getLastContact: () => Promise<ClientResponse<OrderContact>>,
    getOrder: (id: string) => Promise<ClientResponse<Order>>,
    setOrder: (id: string, orderData: OrderData) => Promise<ClientResponse<Order>>,
    sendOrder: (id: string, sendOrder: SendOrder) => Promise<ClientResponse<Order>>,
    moveUpItem: (id: string, itemId: string) => Promise<ClientResponse<Order>>,
    moveDownItem: (id: string, itemId: string) => Promise<ClientResponse<Order>>,
    deleteItem: (id: string, itemId: string) => Promise<ClientResponse<Order>>,
    getHtml: (id: string) => Promise<ClientResponse<StringValue>>,
    getCsv: (id: string) => Promise<ClientResponse<StringValue>>,
    addComment: (id: string, orderCommentData: OrderCommentData) => Promise<ClientResponse<Order>>,
    setOrderContact: (id: string, orderContact: OrderContact) => Promise<ClientResponse<Order>>,
}