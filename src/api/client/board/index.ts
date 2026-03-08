import {
    CONTEXT_PATH,
    deleteData,
    getData,
    postData,
    postFormData,
    putData,
    setPageableQueryParams,
    setQueryParam
} from '../';
import type {Pageable} from '../../model';
import type {Board, BoardData, Category, CategoryItemData, PageBoard} from '../../model/porez';

export interface BoardSearchCriteria {
    searchField?: string;
    code?: string;
    name?: string;
    boardCode?: string;
    structureCode?: string;
    orientation?: boolean;
    lengthFrom?: number;
    lengthTo?: number;
    widthFrom?: number;
    widthTo?: number;
    thicknessFrom?: number;
    thicknessTo?: number;
    priceFrom?: number;
    priceTo?: number;
    inStock?: boolean;
    codeListItems?: string[];
}

const PATH = CONTEXT_PATH + 'boards';

export const getBoards = (criteria?: BoardSearchCriteria, pageable?: Pageable, accessToken?: string) => {
    const queryParams = new URLSearchParams();
    setPageableQueryParams(queryParams, pageable);
    if (criteria) {
        if (criteria.searchField) {
            setQueryParam(queryParams, 'searchField', criteria.searchField);
        }
        if (criteria.code) {
            setQueryParam(queryParams, 'code', criteria.code);
        }
        if (criteria.name) {
            setQueryParam(queryParams, 'name', criteria.name);
        }
        if (criteria.boardCode) {
            setQueryParam(queryParams, 'boardCode', criteria.boardCode);
        }
        if (criteria.structureCode) {
            setQueryParam(queryParams, 'structureCode', criteria.structureCode);
        }
        if (criteria.orientation) {
            setQueryParam(queryParams, 'orientation', criteria.orientation);
        }
        if (criteria.lengthFrom) {
            setQueryParam(queryParams, 'lengthFrom', criteria.lengthFrom);
        }
        if (criteria.lengthTo) {
            setQueryParam(queryParams, 'lengthTo', criteria.lengthTo);
        }
        if (criteria.widthFrom) {
            setQueryParam(queryParams, 'widthFrom', criteria.widthFrom);
        }
        if (criteria.widthTo) {
            setQueryParam(queryParams, 'widthTo', criteria.widthTo);
        }
        if (criteria.thicknessFrom) {
            setQueryParam(queryParams, 'thicknessFrom', criteria.thicknessFrom);
        }
        if (criteria.thicknessTo) {
            setQueryParam(queryParams, 'thicknessTo', criteria.thicknessTo);
        }
        if (criteria.priceFrom) {
            setQueryParam(queryParams, 'priceFrom', criteria.priceFrom);
        }
        if (criteria.priceTo) {
            setQueryParam(queryParams, 'priceTo', criteria.priceTo);
        }
        if (criteria.inStock) {
            setQueryParam(queryParams, 'inStock', criteria.inStock);
        }
        if (criteria.codeListItems) {
            setQueryParam(queryParams, 'codeListItems', criteria.codeListItems.join(','));
        }
    }
    return getData<PageBoard>(PATH, queryParams, accessToken);
}

export const addBoard = (data: BoardData, accessToken?: string) => {
    return postData<Board>(PATH, data, accessToken);
}

export const getBoardCategories = (accessToken?: string) => {
    return getData<Category[]>(PATH + '/categories', undefined, accessToken);
}

export const setBoardCategories = (categoryIds: string[], accessToken?: string) => {
    return postData<Category[]>(PATH + '/categories', categoryIds, accessToken);
}

export const getBoardMaterialCategory = (accessToken?: string) => {
    return getData<Category>(PATH + '/material-category', undefined, accessToken);
}

export const setBoardMaterialCategory = (categoryId: string, accessToken?: string) => {
    return postData<Category>(PATH + '/material-category', {value: categoryId}, accessToken);
}

export const getBoard = (id: string, accessToken?: string) => {
    return getData<Board>(PATH + '/' + id, undefined, accessToken);
}

export const setBoard = (id: string, data: BoardData, accessToken?: string) => {
    return putData<Board>(PATH + '/' + id, data, accessToken);
}

export const deleteBoard = (id: string, accessToken?: string) => {
    return deleteData<void>(PATH + '/' + id, accessToken);
}

export const setBoardCategoryItems = (id: string, categoryItems: CategoryItemData[], accessToken?: string) => {
    return postData<Board>(PATH + '/' + id + '/category-items', categoryItems, accessToken);
}

export const setBoardEdges = (id: string, edgeIds: string[], accessToken?: string) => {
    return postData<Board>(PATH + '/' + id + '/edges', edgeIds, accessToken);
}

export const getBoardImagePath = (id: string) => {
    return PATH + '/' + id + '/image';
}

export const setBoardImage = (id: string, file: File, accessToken?: string) => {
    const formData = new FormData();
    formData.append('file', file);

    return postFormData<void>(PATH + '/' + id + '/image', formData, accessToken);
}

export const deleteBoardImage = (id: string, accessToken?: string) => {
    return deleteData<void>(PATH + '/' + id + '/image', accessToken);
}