import type {CodeListItemSearchCriteria} from '../../api/client/code-list-item';
import type {CodeListItem, CodeListItemData} from '../../api/model/porez';
import type {ClientResponse} from '../../api/client';

export interface CodeListItemState {
    busy: boolean,
    previous: boolean,
    next: boolean,
    page: number,
    totalPages: number,
    setPage: (page: number) => void,
    setCriteria: (criteria?: CodeListItemSearchCriteria, size?: number) => void,
    data?: CodeListItem[],
    getCodeListItems: () => Promise<void>,
    getCodeListItem: (id: string) => Promise<ClientResponse<CodeListItem>>,
    addCodeListItem: (data: CodeListItemData) => Promise<ClientResponse<CodeListItem>>,
    setCodeListItem: (id: string, data: CodeListItemData) => Promise<ClientResponse<CodeListItem>>,
    deleteCodeListItem: (id: string) => Promise<ClientResponse<void>>,
    moveCodeListItemUp: (id: string) => Promise<ClientResponse<CodeListItem>>,
    moveCodeListItemDown: (id: string) => Promise<ClientResponse<CodeListItem>>
}