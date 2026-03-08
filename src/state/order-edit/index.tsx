import {AuthContext, ErrorContext, OrderEditContext} from '..';
import {type ReactNode, useContext, useState} from 'react';
import {
    Authority,
    type Order,
    type OrderCommentData,
    type OrderContact,
    type OrderData,
    OrderStatus,
    type SendOrder
} from '../../api/model/porez';
import * as orderApi from '../../api/client/order'

const OrderEditProvider = ({children}: { children: ReactNode }) => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [busy, setBusy] = useState(false);

    const editEnabled = (authority: Authority, order?: Order) => {
        if (order === undefined) {
            return false;
        }
        return authority === Authority.P_CUSTOMER && order.status === OrderStatus.NEW
            || authority === Authority.P_MANAGER && order.status === OrderStatus.SENT;
    }

    const submitEnabled = (order?: Order) => {
        if (order === undefined) {
            return false;
        }
        return order.status === OrderStatus.NEW && (order.items?.length ?? 0) > 0;
    }

    const orderFinal = (order?: Order) => {
        if (order === undefined) {
            return true;
        }
        return order.status === OrderStatus.FINISHED || order.status === OrderStatus.CANCELLED;
    }

    const getLastContact = async () => {
        setBusy(true);
        try {
            const response = await orderApi.getLastContact(authState?.accessToken);
            errorState?.addError(response.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    const getOrder = async (id: string) => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await orderApi.getOrder(id, authState?.accessToken);
                errorState?.addError(response.error);
                return response;
            }
        } finally {
            setBusy(false);
        }
        return {data: undefined, error: undefined};
    }

    const setOrder = async (id: string, orderData: OrderData) => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await orderApi.setOrder(id, orderData, authState?.accessToken);
                errorState?.addError(response.error);
                return response;
            }
        } finally {
            setBusy(false);
        }
        return {data: undefined, error: undefined};
    }

    const sendOrder = async (id: string, sendOrder: SendOrder) => {
        setBusy(true);
        try {
            const response = await orderApi.sendOrder(id, sendOrder, authState?.accessToken);
            return response;
        } finally {
            setBusy(false);
        }
    }

    const moveUpItem = async (id: string, itemId: string) => {
        setBusy(true);
        try {
            const response = await orderApi.moveUpItem(id, itemId, authState?.accessToken);
            errorState?.addError(response.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    const moveDownItem = async (id: string, itemId: string) => {
        setBusy(true);
        try {
            const response = await orderApi.moveDownItem(id, itemId, authState?.accessToken);
            errorState?.addError(response.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    const deleteItem = async (id: string, itemId: string) => {
        setBusy(true);
        try {
            const response = await orderApi.deleteItem(id, itemId, authState?.accessToken);
            errorState?.addError(response.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    const getHtml = async (id: string) => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await orderApi.getHtml(id, authState?.accessToken);
                errorState?.addError(response.error);
                return response;
            }
        } finally {
            setBusy(false);
        }
        return {data: undefined, error: undefined};
    }

    const getCsv = async (id: string) => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await orderApi.getCsv(id, authState?.accessToken);
                errorState?.addError(response.error);
                return response;
            }
        } finally {
            setBusy(false);
        }
        return {data: undefined, error: undefined};
    }

    const addComment = async (id: string, orderCommentData: OrderCommentData) => {
        setBusy(true);
        try {
            const response = await orderApi.addComment(id, orderCommentData, authState?.accessToken);
            errorState?.addError(response.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    const setOrderContact = async (id: string, orderContact: OrderContact) => {
        setBusy(true);
        try {
            const response = await orderApi.setOrderContact(id, orderContact, authState?.accessToken);
            errorState?.addError(response.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    return (
        <OrderEditContext.Provider
            value={
                {
                    busy,
                    editEnabled,
                    submitEnabled,
                    orderFinal,
                    getLastContact,
                    getOrder,
                    setOrder,
                    sendOrder,
                    moveUpItem,
                    moveDownItem,
                    deleteItem,
                    getHtml,
                    getCsv,
                    addComment,
                    setOrderContact
                }
            }
        >{children}
        </OrderEditContext.Provider>
    );
}

export default OrderEditProvider;
