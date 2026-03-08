import type {CodeListSearchCriteria} from '../../api/client/code-list';
import type {Category, CodeListData} from '../../api/model/porez';
import type {ClientResponse} from '../../api/client';

export interface CodeListState {
    busy: boolean,
    previous: boolean,
    next: boolean,
    page: number,
    totalPages: number,
    setPage: (page: number) => void,
    setCriteria: (criteria?: CodeListSearchCriteria) => void,
    data?: Category[],
    getCodeLists: () => Promise<void>,
    getCodeList: (id: string) => Promise<ClientResponse<Category>>,
    addCodeList: (data: CodeListData) => Promise<ClientResponse<Category>>,
    setCodeList: (id: string, data: CodeListData) => Promise<ClientResponse<Category>>,
    deleteCodeList: (id: string) => Promise<ClientResponse<void>>
}