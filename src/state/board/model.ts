import type {BoardSearchCriteria} from '../../api/client/board';
import type {Board, BoardData, CategoryItemData} from '../../api/model/porez';
import type {ClientResponse} from '../../api/client';

export interface BoardState {
    busy: boolean,
    previous: boolean,
    next: boolean,
    page: number,
    totalPages: number,
    setPage: (page: number) => void,
    setCriteria: (criteria?: BoardSearchCriteria) => void,
    data?: Board[],
    getBoards: () => Promise<void>,
    getBoard: (id: string) => Promise<ClientResponse<Board>>,
    addBoard: (data: BoardData) => Promise<void>,
    setBoard: (id: string, data: BoardData) => Promise<void>,
    deleteBoard: (id: string) => Promise<void>,
    setBoardCategoryItems: (id: string, categoryItems: CategoryItemData[]) => Promise<ClientResponse<Board>>,
    setBoardEdges: (id: string, edgeIds: string[]) => Promise<ClientResponse<Board>>,
    setBoardImage: (id: string, file: File) => Promise<void>,
    deleteBoardImage: (id: string) => Promise<void>
}