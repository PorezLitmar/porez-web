import {CONTEXT_PATH, deleteData, getData, postData, putData, setPageableQueryParams, setQueryParam} from '../';
import type {Pageable} from '../../model';
import type {Category, CodeListData, PageCodeList} from '../../model/porez';

const PATH = CONTEXT_PATH + 'code-lists';

export interface CodeListSearchCriteria {
    searchField?: string;
    code?: string;
    name?: string;
}

export const getCodeLists = (criteria?: CodeListSearchCriteria, pageable?: Pageable, accessToken?: string) => {
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
    }
    return getData<PageCodeList>(PATH, queryParams, accessToken);
}

export const addCodeList = (data: CodeListData, accessToken?: string) => {
    return postData<Category>(PATH, data, accessToken);
}

export const getCodeList = (id: string, accessToken?: string) => {
    return getData<Category>(PATH + '/' + id, undefined, accessToken);
}

export const setCodeList = (id: string, data: CodeListData, accessToken?: string) => {
    return putData<Category>(PATH + '/' + id, data, accessToken);
}

export const deleteCodeList = (id: string, accessToken?: string) => {
    return deleteData<void>(PATH + '/' + id, accessToken);
}