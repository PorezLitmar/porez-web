import type {EdgeSearchCriteria} from '../../api/client/edge';
import * as apiEdge from '../../api/client/edge';
import {type ReactNode, useContext, useEffect, useState} from 'react';
import {AuthContext, EdgeContext, ErrorContext} from '..';
import type {CategoryItemData, Edge, EdgeData} from '../../api/model/porez';
import type {ClientResponse} from '../../api/client';

interface SearchParams {
    page: number,
    criteria: EdgeSearchCriteria
}

const EdgeProvider = ({children}: { children: ReactNode }) => {
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
    const [data, setData] = useState<Edge[]>([]);

    useEffect(() => {
        getEdges().then();
    }, [searchParams]);

    const handleResponse = (response: ClientResponse<Edge>) => {
        if (response?.data) {
            const newData = [...data];
            const index = newData.findIndex(item => item.id === response.data?.id);
            if (index !== -1) {
                newData[index] = response.data;
            }
            setData(newData);
        }
    }

    const setPage = (page: number) => {
        setSearchParams(prevState => {
            return {...prevState, page};
        });
    }

    const setCriteria = (criteria?: EdgeSearchCriteria) => {
        setSearchParams({criteria: criteria ? criteria : {}, page: 0});
    }

    const getEdges = async () => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await apiEdge.getEdges(searchParams.criteria, {
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

    const getEdge = async (id: string) => {
        setBusy(true);
        try {
            const response = await apiEdge.getEdge(id, authState?.accessToken);
            handleResponse(response);
            errorState?.addError(response?.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    const addEdge = async (edgeData: EdgeData) => {
        setBusy(true);
        try {
            const response = await apiEdge.addEdge(edgeData, authState?.accessToken);
            if (response.data) {
                const newData = [response.data, ...data];
                setData(newData);
            }
            errorState?.addError(response.error);
        } finally {
            setBusy(false);
        }
    }

    const setEdge = async (id: string, edgeData: EdgeData) => {
        setBusy(true);
        try {
            const response = await apiEdge.setEdge(id, edgeData, authState?.accessToken);
            handleResponse(response);
            errorState?.addError(response?.error);
        } finally {
            setBusy(false);
        }
    }

    const deleteEdge = async (id: string) => {
        setBusy(true);
        try {
            const response = await apiEdge.deleteEdge(id, authState?.accessToken);
            if (!response.error) {
                const newData = [...data];
                const index = newData.findIndex(item => item.id === id);
                if (index !== -1) {
                    newData.splice(index, 1);
                }
                setData(newData);
            }
            errorState?.addError(response.error);
        } finally {
            setBusy(false);
        }
    }

    const setEdgeCategoryItems = async (id: string, categoryItems: CategoryItemData[]) => {
        setBusy(true);
        try {
            const response = await apiEdge.setEdgeCategoryItems(id, categoryItems, authState?.accessToken);
            handleResponse(response);
            errorState?.addError(response?.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    return (
        <EdgeContext.Provider
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
                    getEdges,
                    getEdge,
                    addEdge,
                    setEdge,
                    deleteEdge,
                    setEdgeCategoryItems
                }
            }
        >{children}
        </EdgeContext.Provider>
    )
}

export default EdgeProvider;