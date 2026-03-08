import {CONTEXT_PATH, deleteData, getData, postData, putData, setPageableQueryParams, setQueryParam} from '../';
import type {Pageable} from '../../model';
import type {Category, CategoryItemData, Edge, EdgeData, PageEdge} from '../../model/porez';

const PATH = CONTEXT_PATH + 'edges';

export interface EdgeSearchCriteria {
    searchField?: string;
    code?: string;
    name?: string;
    widthFrom?: number;
    widthTo?: number;
    thicknessFrom?: number;
    thicknessTo?: number;
    priceFrom?: number;
    priceTo?: number;
    inStock?: boolean;
    codeListItems?: string[];
}

export const getEdges = (criteria?: EdgeSearchCriteria, pageable?: Pageable, accessToken?: string) => {
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
    return getData<PageEdge>(PATH, queryParams, accessToken);
}

export const addEdge = (data: EdgeData, accessToken?: string) => {
    return postData<Edge>(PATH, data, accessToken);
}

export const getEdgeCategories = (accessToken?: string) => {
    return getData<Category[]>(PATH + '/categories', undefined, accessToken);
}

export const setEdgeCategories = (categoryIds: string[], accessToken?: string) => {
    return postData<Category[]>(PATH + '/categories', categoryIds, accessToken);
}

export const getEdge = (id: string, accessToken?: string) => {
    return getData<Edge>(PATH + '/' + id, undefined, accessToken);
}

export const setEdge = (id: string, data: EdgeData, accessToken?: string) => {
    return putData<Edge>(PATH + '/' + id, data, accessToken);
}

export const deleteEdge = (id: string, accessToken?: string) => {
    return deleteData<void>(PATH + '/' + id, accessToken);
}

export const setEdgeCategoryItems = (id: string, categoryItems: CategoryItemData[], accessToken?: string) => {
    return postData<Edge>(PATH + '/' + id + '/category-items', categoryItems, accessToken);
}