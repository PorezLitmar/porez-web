import {
    CONTEXT_PATH,
    deleteData,
    getData,
    patchData,
    postData,
    putData,
    setPageableQueryParams,
    setQueryParam
} from '../';
import type {Pageable} from '../../model';
import type {
    Order,
    OrderData,
    OrderCommentData,
    OrderContact,
    OrderItemData,
    OrderStatus,
    OrderStatusData,
    PageOrder,
    PageOrderUser,
    Product,
    ProductImage,
    SendOrder,
    StringValue
} from '../../model/porez';

const PATH = CONTEXT_PATH + 'orders';

export interface OrderUserSearchCriteria {
    searchField?: string;
    email?: string;
}

export interface OrderSearchCriteria {
    userIds?: string[];
    createdFrom?: string;
    createdTo?: string;
    statuses?: OrderStatus[];
    totalFrom?: number;
    totalTo?: number;
}

export const getOrders = (criteria?: OrderSearchCriteria, pageable?: Pageable, accessToken?: string) => {
    const queryParams = new URLSearchParams();
    setPageableQueryParams(queryParams, pageable);
    if (criteria) {
        if (criteria.userIds) {
            setQueryParam(queryParams, 'userIds', criteria.userIds.map(item => `${item}`).join(','));
        }
        if (criteria.createdFrom) {
            setQueryParam(queryParams, 'createdFrom', criteria.createdFrom);
        }
        if (criteria.createdTo) {
            setQueryParam(queryParams, 'createdTo', criteria.createdTo);
        }
        if (criteria.statuses) {
            setQueryParam(queryParams, 'statuses', criteria.statuses.join(','));
        }
        if (criteria.totalFrom) {
            setQueryParam(queryParams, 'totalFrom', criteria.totalFrom);
        }
        if (criteria.totalTo) {
            setQueryParam(queryParams, 'totalTo', criteria.totalTo);
        }
    }
    return getData<PageOrder>(PATH, queryParams, accessToken);
}

export const addOrder = (accessToken?: string) => {
    return postData<Order>(PATH, undefined, accessToken);
}

export const generateImage = (product: Product, accessToken?: string) => {
    return postData<ProductImage>(PATH + '/generate-image', product, accessToken);
}

export const getLastContact = (accessToken?: string) => {
    return getData<OrderContact>(PATH + '/last-contact', undefined, accessToken);
}

export const getOrderUsers = (criteria?: OrderUserSearchCriteria, pageable?: Pageable, accessToken?: string) => {
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
    return getData<PageOrderUser>(PATH + '/users', queryParams, accessToken);
}

export const getOrder = (id: string, accessToken?: string) => {
    return getData<Order>(PATH + '/' + id, undefined, accessToken);
}

export const setOrder = (id: string, data: OrderData, accessToken?: string) => {
    return putData<Order>(PATH + '/' + id, data, accessToken);
}

export const deleteOrder = (id: string, accessToken?: string) => {
    return deleteData<void>(PATH + '/' + id, accessToken);
}

export const addComment = (id: string, data: OrderCommentData, accessToken?: string) => {
    return postData<Order>(PATH + '/' + id + '/comments', data, accessToken);
}

export const setOrderContact = (id: string, orderContact: OrderContact, accessToken?: string) => {
    return postData<Order>(PATH + '/' + id + '/contact', orderContact, accessToken);
}

export const getCsv = (id: string, accessToken?: string) => {
    return getData<StringValue>(PATH + '/' + id + '/csv', undefined, accessToken);
}

export const getHtml = (id: string, accessToken?: string) => {
    return getData<StringValue>(PATH + '/' + id + '/html', undefined, accessToken);
}

export const addItem = (id: string, data: OrderItemData, accessToken?: string) => {
    return postData<Order>(PATH + '/' + id + '/item', data, accessToken);
}

export const setItem = (id: string, itemId: string, data: OrderItemData, accessToken?: string) => {
    return putData<Order>(PATH + '/' + id + '/item/' + itemId, data, accessToken);
}

export const deleteItem = (id: string, itemId: string, accessToken?: string) => {
    return deleteData<Order>(PATH + '/' + id + '/item/' + itemId, accessToken);
}

export const moveDownItem = (id: string, itemId: string, accessToken?: string) => {
    return patchData<Order>(PATH + '/' + id + '/item/' + itemId + '/move-down', undefined, accessToken);
}

export const moveUpItem = (id: string, itemId: string, accessToken?: string) => {
    return patchData<Order>(PATH + '/' + id + '/item/' + itemId + '/move-up', undefined, accessToken);
}

export const recountOrder = (id: string, accessToken?: string) => {
    return postData<Order>(PATH + '/' + id + '/recount', undefined, accessToken);
}

export const sendOrder = (id: string, sendOrder: SendOrder, accessToken?: string) => {
    return postData<Order>(PATH + '/' + id + '/send', sendOrder, accessToken);
}

export const setOrderStatus = (id: string, data: OrderStatusData, accessToken?: string) => {
    return putData<Order>(PATH + '/' + id + '/status', data, accessToken);
}