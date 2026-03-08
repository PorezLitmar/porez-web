import * as apiEdge from '../../api/client/edge';
import {type ReactNode, useContext, useEffect, useState} from 'react';
import {AuthContext, CategoryContext, ErrorContext} from '..';
import type {Category} from '../../api/model/porez';
import * as apiBoard from '../../api/client/board';

const CategoryProvider = ({children}: { children: ReactNode }) => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [busy, setBusy] = useState(false);
    const [boardCategories, setBoardCategories] = useState<Category[]>([]);
    const [edgeCategories, setEdgeCategories] = useState<Category[]>([]);
    const [materialCategory, setMaterialCategory] = useState<Category>();

    useEffect(() => {
        void reload();
    }, []);

    const getBoardCategories = async () => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await apiBoard.getBoardCategories(authState?.accessToken);
                setBoardCategories(response.data ?? []);
                errorState?.addError(response?.error);
            }
        } finally {
            setBusy(false);
        }
    }

    const getEdgeCategories = async () => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await apiEdge.getEdgeCategories(authState?.accessToken);
                setEdgeCategories(response.data ?? []);
                errorState?.addError(response?.error);
            }
        } finally {
            setBusy(false);
        }
    }

    const getMaterialCategory = async () => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await apiBoard.getBoardMaterialCategory(authState?.accessToken);
                setMaterialCategory(response.data);
                errorState?.addError(response?.error);
            }
        } finally {
            setBusy(false);
        }
    }

    const reload = async () => {
        void getBoardCategories();
        void getEdgeCategories();
        void getMaterialCategory();
    }

    const isBoardCategory = (codeList: Category) => {
        return boardCategories.some(item => item.id === codeList.id);
    }

    const isEdgeCategory = (codeList: Category) => {
        return edgeCategories.some(item => item.id === codeList.id);
    }

    const isMaterialCategory = (codeList: Category) => {
        return materialCategory?.id === codeList.id;
    }

    const addBoardCategory = async (codeList: Category) => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const ids = boardCategories.map(item => item.id ?? '');
                const response = await apiBoard.setBoardCategories([...ids, codeList.id ?? ''], authState?.accessToken);
                setBoardCategories(response.data ?? []);
                errorState?.addError(response?.error);
            }
        } finally {
            setBusy(false);
        }
    }

    const addEdgeCategory = async (codeList: Category) => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const ids = edgeCategories.map(item => item.id ?? '');
                const response = await apiEdge.setEdgeCategories([...ids, codeList.id ?? ''], authState?.accessToken);
                setEdgeCategories(response.data ?? []);
                errorState?.addError(response?.error);
            }
        } finally {
            setBusy(false);
        }
    }

    const deleteBoardCategory = async (codeList: Category) => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const ids = boardCategories.map(item => item.id ?? '').filter(id => id !== codeList.id);
                const response = await apiBoard.setBoardCategories(ids, authState?.accessToken);
                setBoardCategories(response.data ?? []);
                errorState?.addError(response?.error);
            }
        } finally {
            setBusy(false);
        }
    }

    const deleteEdgeCategory = async (codeList: Category) => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const ids = edgeCategories.map(item => item.id ?? '').filter(id => id !== codeList.id);
                const response = await apiEdge.setEdgeCategories(ids, authState?.accessToken);
                setEdgeCategories(response.data ?? []);
                errorState?.addError(response?.error);
            }
        } finally {
            setBusy(false);
        }
    }

    const _setMaterialCategory = async (codeList: Category) => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await apiBoard.setBoardMaterialCategory(codeList.id ?? '', authState?.accessToken);
                setMaterialCategory(response.data);
                errorState?.addError(response?.error);
            }
        } finally {
            setBusy(false);
        }
    }


    return (
        <CategoryContext.Provider
            value={
                {
                    busy,
                    boardCategories,
                    edgeCategories,
                    materialCategory,
                    reload,
                    isBoardCategory,
                    isEdgeCategory,
                    isMaterialCategory,
                    addBoardCategory,
                    addEdgeCategory,
                    deleteBoardCategory,
                    deleteEdgeCategory,
                    setMaterialCategory: _setMaterialCategory
                }
            }
        >{children}
        </CategoryContext.Provider>
    )
}

export default CategoryProvider;