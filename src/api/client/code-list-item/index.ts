import {
    CONTEXT_PATH,
    deleteData,
    getData,
    patchData,
    postData,
    putData,
    setPageableQueryParams,
    setQueryParam
} from '../';
import type {Pageable} from '../../model';
import type {CodeListItem, CodeListItemData, PageCodeListItem} from '../../model/porez';

const PATH = CONTEXT_PATH + 'code-list-items';

export interface CodeListItemSearchCriteria {
    codeListId?: string;
    root?: boolean;
    parentId?: string;
    searchField?: string;
    code?: string;
    value?: string;
    treeCode?: string;
}

export const getCodeListItems = (criteria?: CodeListItemSearchCriteria, pageable?: Pageable, accessToken?: string) => {
    const queryParams = new URLSearchParams();
    setPageableQueryParams(queryParams, pageable);
    if (criteria) {
        if (criteria.codeListId) {
            setQueryParam(queryParams, 'codeListId', criteria.codeListId);
        }
        if (criteria.root !== undefined) {
            setQueryParam(queryParams, 'root', criteria.root);
        }
        if (criteria.parentId) {
            setQueryParam(queryParams, 'parentId', criteria.parentId);
        }
        if (criteria.searchField) {
            setQueryParam(queryParams, 'searchField', criteria.searchField);
        }
        if (criteria.code) {
            setQueryParam(queryParams, 'code', criteria.code);
        }
        if (criteria.value) {
            setQueryParam(queryParams, 'value', criteria.value);
        }
        if (criteria.treeCode) {
            setQueryParam(queryParams, 'treeCode', criteria.treeCode);
        }
    }
    return getData<PageCodeListItem>(PATH, queryParams, accessToken);
}

export const addCodeListItem = (data: CodeListItemData, accessToken?: string) => {
    return postData<CodeListItem>(PATH, data, accessToken);
}

export const getCodeListItem = (id: string, accessToken?: string) => {
    return getData<CodeListItem>(PATH + '/' + id, undefined, accessToken);
}

export const setCodeListItem = (id: string, data: CodeListItemData, accessToken?: string) => {
    return putData<CodeListItem>(PATH + '/' + id, data, accessToken);
}

export const deleteCodeListItem = (id: string, accessToken?: string) => {
    return deleteData<void>(PATH + '/' + id, accessToken);
}

export const moveCodeListItemDown = (id: string, accessToken?: string) => {
    return patchData<CodeListItem>(PATH + '/' + id + '/move-down', undefined, accessToken);
}

export const moveCodeListItemUp = (id: string, accessToken?: string) => {
    return patchData<CodeListItem>(PATH + '/' + id + '/move-up', undefined, accessToken);
}