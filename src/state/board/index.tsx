import type {BoardSearchCriteria} from '../../api/client/board';
import * as apiBoard from '../../api/client/board';
import {AuthContext, BoardContext, ErrorContext} from '..';
import {type ReactNode, useContext, useEffect, useState} from 'react';
import type {Board, BoardData, CategoryItemData} from '../../api/model/porez';
import type {ClientResponse} from '../../api/client';

interface SearchParams {
    page: number,
    criteria: BoardSearchCriteria
}

const BoardProvider = ({children}: { children: ReactNode }) => {
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
    const [data, setData] = useState<Board[]>([]);

    useEffect(() => {
        void getBoards();
    }, [searchParams]);

    const handleResponse = (response: ClientResponse<Board>) => {
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

    const getBoards = async () => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await apiBoard.getBoards(searchParams.criteria, {
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

    const getBoard = async (id: string) => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await apiBoard.getBoard(id, authState?.accessToken);
                handleResponse(response);
                errorState?.addError(response?.error);
                return response;
            }
        } finally {
            setBusy(false);
        }
        return {data: undefined, error: undefined};
    }

    const addBoard = async (boardData: BoardData) => {
        setBusy(true);
        try {
            const response = await apiBoard.addBoard(boardData, authState?.accessToken);
            if (response.data) {
                const newData = [response.data, ...data];
                setData(newData);
            }
            errorState?.addError(response.error);
        } finally {
            setBusy(false);
        }
    }

    const setBoard = async (id: string, boardData: BoardData) => {
        setBusy(true);
        try {
            const response = await apiBoard.setBoard(id, boardData, authState?.accessToken);
            handleResponse(response);
            errorState?.addError(response?.error);
        } finally {
            setBusy(false);
        }
    }

    const deleteBoard = async (id: string) => {
        setBusy(true);
        try {
            const response = await apiBoard.deleteBoard(id, authState?.accessToken);
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

    const setBoardCategoryItems = async (id: string, categoryItems: CategoryItemData[]) => {
        setBusy(true);
        try {
            const response = await apiBoard.setBoardCategoryItems(id, categoryItems, authState?.accessToken);
            handleResponse(response);
            errorState?.addError(response?.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    const setBoardEdges = async (id: string, edgeIds: string[]) => {
        setBusy(true);
        try {
            const response = await apiBoard.setBoardEdges(id, edgeIds, authState?.accessToken);
            handleResponse(response);
            errorState?.addError(response?.error);
            return response;
        } finally {
            setBusy(false);
        }
    }

    const setBoardImage = async (id: string, file: File) => {
        setBusy(true);
        try {
            const response = await apiBoard.setBoardImage(id, file, authState?.accessToken);
            errorState?.addError(response?.error);
        } finally {
            setBusy(false);
        }
    }

    const deleteBoardImage = async (id: string) => {
        setBusy(true);
        try {
            const response = await apiBoard.deleteBoardImage(id, authState?.accessToken);
            errorState?.addError(response?.error);
        } finally {
            setBusy(false);
        }
    }

    return (
        <BoardContext.Provider
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
                    getBoards,
                    getBoard,
                    addBoard,
                    setBoard,
                    deleteBoard,
                    setBoardCategoryItems,
                    setBoardEdges,
                    setBoardImage,
                    deleteBoardImage
                }
            }
        >{children}
        </BoardContext.Provider>
    )
}

export default BoardProvider;
