import type {OrderUserSearchCriteria} from '../../api/client/order';
import * as apiOrder from '../../api/client/order';
import {type ReactNode, useContext, useEffect, useState} from 'react';
import {AuthContext, ErrorContext, OrderUserContext} from '..';
import type {OrderUser} from '../../api/model/porez';

interface SearchParams {
    page: number,
    criteria: OrderUserSearchCriteria
}

const OrderUserProvider = ({children}: { children: ReactNode }) => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [busy, setBusy] = useState(false);
    const [previous, setPrevious] = useState(false);
    const [next, setNext] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [searchParams, setSearchParams] = useState<SearchParams>({
        page: 0,
        criteria: {}
    });
    const [data, setData] = useState<OrderUser[]>([]);

    useEffect(() => {
        getOrderUsers().then();
    }, [searchParams]);

    const setPage = (page: number) => {
        setSearchParams(prevState => {
            return {...prevState, page};
        });
    }

    const setCriteria = (criteria?: OrderUserSearchCriteria) => {
        setSearchParams({criteria: criteria ? criteria : {}, page: 0});
    }

    const getOrderUsers = async () => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await apiOrder.getOrderUsers(searchParams.criteria, {
                    page: searchParams.page,
                    size: 10,
                    sort: {field: 'id', asc: true}
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

    return (
        <OrderUserContext.Provider
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
                    getOrderUsers
                }
            }
        >{children}
        </OrderUserContext.Provider>
    )
}

export default OrderUserProvider;
