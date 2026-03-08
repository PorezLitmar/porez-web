import type {OrderSearchCriteria} from '../../api/client/order';
import * as orderApi from '../../api/client/order'
import {AuthContext, ErrorContext, OrderContext} from '..';
import type {Order, OrderStatus, OrderStatusData} from '../../api/model/porez';
import {type ReactNode, useContext, useEffect, useState} from 'react';
import type {ClientResponse} from '../../api/client';

interface SearchParams {
    page: number,
    criteria: OrderSearchCriteria
}

const OrderProvider = ({statuses, userId, children}: {
    statuses?: OrderStatus[],
    userId?: string,
    children: ReactNode
}) => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [busy, setBusy] = useState(false);
    const [previous, setPrevious] = useState(false);
    const [next, setNext] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [searchParams, setSearchParams] = useState<SearchParams>({
        page: 0,
        criteria: {
            userIds: userId !== undefined ? [userId] : [],
            statuses
        }
    });
    const [data, setData] = useState<Order[]>([]);

    useEffect(() => {
        getOrders().then();
    }, [searchParams]);

    const setPage = (page: number) => {
        setSearchParams(prevState => {
            return {...prevState, page};
        });
    }

    const setCriteria = (criteria?: OrderSearchCriteria) => {
        setSearchParams({criteria: criteria ? criteria : {}, page: 0});
    }

    const getOrders = async () => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await orderApi.getOrders(searchParams.criteria, {
                    page: searchParams.page,
                    size: 10,
                    sort: {field: 'id', asc: false}
                }, authState?.accessToken);
                setPrevious(!(response.data?.first ?? true));
                setNext(!(response.data?.last ?? true));
                setTotalPages(response.data?.totalPages ?? 0);
                setData(response.data?.content ?? []);
                errorState?.addError(response.error);
            }
        } finally {
            setBusy(false);
        }
    }

    const handleResponse = (response: ClientResponse<Order>) => {
        if (response?.data) {
            const newData = [...data];
            const index = newData.findIndex(item => item.id === response.data?.id);
            if (index !== -1) {
                newData[index] = response.data;
            }
            setData(newData);
        }
    }

    const addOrder = async () => {
        setBusy(true);
        try {
            const response = await orderApi.addOrder(authState?.accessToken);
            errorState?.addError(response.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    const recountOrder = async (id: string) => {
        setBusy(true);
        try {
            const response = await orderApi.recountOrder(id, authState?.accessToken);
            handleResponse(response);
            errorState?.addError(response.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    const setOrderStatus = async (id: string, orderStatusData: OrderStatusData) => {
        setBusy(true);
        try {
            const response = await orderApi.setOrderStatus(id, orderStatusData, authState?.accessToken);
            handleResponse(response);
            errorState?.addError(response.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    const deleteOrder = async (id: string) => {
        setBusy(true);
        try {
            const response = await orderApi.deleteOrder(id, authState?.accessToken);
            if (!response.error) {
                const newData = [...data];
                const index = newData.findIndex(item => item.id === id);
                if (index !== -1) {
                    newData.splice(index, 1);
                }
                setData(newData);
            }
            errorState?.addError(response.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    return (
        <OrderContext.Provider
            value={
                {
                    busy,
                    previous,
                    next,
                    page: searchParams.page,
                    totalPages,
                    setPage,
                    setCriteria,
                    data,
                    getOrders,
                    addOrder,
                    recountOrder,
                    setOrderStatus,
                    deleteOrder
                }
            }
        >{children}
        </OrderContext.Provider>
    );
}

export default OrderProvider;
