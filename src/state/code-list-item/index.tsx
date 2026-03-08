import {AuthContext, CodeListItemContext, ErrorContext} from '..';
import {type ReactNode, useContext, useEffect, useState} from 'react';
import type {CodeListItemSearchCriteria} from '../../api/client/code-list-item';
import * as apiCodeListItem from '../../api/client/code-list-item';
import type {CodeListItem, CodeListItemData} from '../../api/model/porez';
import type {ClientResponse} from '../../api/client';

interface SearchParams {
    page: number,
    size: number,
    criteria: CodeListItemSearchCriteria
}

const CodeListItemProvider = ({children}: { children: ReactNode }) => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [busy, setBusy] = useState(false);
    const [previous, setPrevious] = useState(false);
    const [next, setNext] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [searchParams, setSearchParams] = useState<SearchParams>({
        page: 0,
        size: 10,
        criteria: {}
    });
    const [data, setData] = useState<CodeListItem[]>([]);

    useEffect(() => {
        getCodeListItems().then();
    }, [searchParams]);

    const handleResponse = (response: ClientResponse<CodeListItem>) => {
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

    const setCriteria = (criteria?: CodeListItemSearchCriteria, size?: number) => {
        setSearchParams(prevState => {
            return {criteria: criteria ? criteria : {}, page: 0, size: size !== undefined ? size : prevState.size};
        });
    }

    const getCodeListItems = async () => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await apiCodeListItem.getCodeListItems(searchParams.criteria, {
                    page: searchParams.page,
                    size: searchParams.size,
                    sort: {field: 'sortNum', asc: true}
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

    const getCodeListItem = async (id: string) => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await apiCodeListItem.getCodeListItem(id, authState?.accessToken);
                handleResponse(response);
                errorState?.addError(response?.error);
                return response;
            }
        } finally {
            setBusy(false);
        }
        return {data: undefined, error: undefined};
    }

    const addCodeListItem = async (codeListItemData: CodeListItemData) => {
        setBusy(true);
        try {
            const response = await apiCodeListItem.addCodeListItem(codeListItemData, authState?.accessToken);
            if (response.data) {
                const newData = [response.data, ...data];
                setData(newData);
            }
            errorState?.addError(response.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    const setCodeListItem = async (id: string, codeListItemData: CodeListItemData) => {
        setBusy(true);
        try {
            const response = await apiCodeListItem.setCodeListItem(id, codeListItemData, authState?.accessToken);
            handleResponse(response);
            errorState?.addError(response?.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    const deleteCodeListItem = async (id: string) => {
        setBusy(true);
        try {
            const response = await apiCodeListItem.deleteCodeListItem(id, authState?.accessToken);
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

    const moveCodeListItemUp = async (id: string) => {
        setBusy(true);
        try {
            const response = await apiCodeListItem.moveCodeListItemUp(id, authState?.accessToken);
            handleResponse(response);
            errorState?.addError(response?.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    const moveCodeListItemDown = async (id: string) => {
        setBusy(true);
        try {
            const response = await apiCodeListItem.moveCodeListItemDown(id, authState?.accessToken);
            handleResponse(response);
            errorState?.addError(response?.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    return (
        <CodeListItemContext.Provider
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
                    getCodeListItems,
                    getCodeListItem,
                    addCodeListItem,
                    setCodeListItem,
                    deleteCodeListItem,
                    moveCodeListItemUp,
                    moveCodeListItemDown
                }
            }
        >{children}
        </CodeListItemContext.Provider>
    )
}

export default CodeListItemProvider;
