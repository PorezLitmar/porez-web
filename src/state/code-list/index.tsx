import {type ReactNode, useContext, useEffect, useState} from 'react';
import {AuthContext, CodeListContext, ErrorContext} from '..';
import type {Category, CodeListData} from '../../api/model/porez';
import type {ClientResponse} from '../../api/client';
import type {BoardSearchCriteria} from '../../api/client/board';
import type {CodeListSearchCriteria} from '../../api/client/code-list';
import * as apiCodeList from '../../api/client/code-list';

interface SearchParams {
    page: number,
    criteria: CodeListSearchCriteria
}

const CodeListProvider = ({children}: { children: ReactNode }) => {
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
    const [data, setData] = useState<Category[]>([]);

    useEffect(() => {
        getCodeLists().then();
    }, [searchParams]);

    const handleResponse = (response: ClientResponse<Category>) => {
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

    const setCriteria = (criteria?: BoardSearchCriteria) => {
        setSearchParams({criteria: criteria ? criteria : {}, page: 0});
    }

    const getCodeLists = async () => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await apiCodeList.getCodeLists(searchParams.criteria, {
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

    const getCodeList = async (id: string) => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await apiCodeList.getCodeList(id, authState?.accessToken);
                handleResponse(response);
                errorState?.addError(response?.error);
                return response;
            }
        } finally {
            setBusy(false);
        }
        return {data: undefined, error: undefined};
    }

    const addCodeList = async (codeListData: CodeListData) => {
        setBusy(true);
        try {
            const response = await apiCodeList.addCodeList(codeListData, authState?.accessToken);
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

    const setCodeList = async (id: string, codeListData: CodeListData) => {
        setBusy(true);
        try {
            const response = await apiCodeList.setCodeList(id, codeListData, authState?.accessToken);
            handleResponse(response);
            errorState?.addError(response?.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    const deleteCodeList = async (id: string) => {
        setBusy(true);
        try {
            const response = await apiCodeList.deleteCodeList(id, authState?.accessToken);
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
        <CodeListContext.Provider
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
                    getCodeLists,
                    getCodeList,
                    addCodeList,
                    setCodeList,
                    deleteCodeList
                }
            }
        >{children}
        </CodeListContext.Provider>
    )
}

export default CodeListProvider;
