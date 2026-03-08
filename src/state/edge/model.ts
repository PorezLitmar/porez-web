import type {EdgeSearchCriteria} from '../../api/client/edge';
import type {CategoryItemData, Edge, EdgeData} from '../../api/model/porez';
import type {ClientResponse} from '../../api/client';

export interface EdgeState {
    busy: boolean,
    previous: boolean,
    next: boolean,
    page: number,
    totalPages: number,
    setPage: (page: number) => void,
    setCriteria: (criteria?: EdgeSearchCriteria) => void,
    data?: Edge[],
    getEdges: () => Promise<void>,
    getEdge: (id: string) => Promise<ClientResponse<Edge>>,
    addEdge: (data: EdgeData) => Promise<void>,
    setEdge: (id: string, data: EdgeData) => Promise<void>,
    deleteEdge: (id: string) => Promise<void>,
    setEdgeCategoryItems: (id: string, categoryItemChanges: CategoryItemData[]) => Promise<ClientResponse<Edge>>
}