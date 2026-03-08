import type {Category} from '../../api/model/porez';

export interface CategoryState {
    busy: boolean,
    boardCategories?: Category[],
    edgeCategories?: Category[],
    materialCategory?: Category,
    reload: () => Promise<void>,
    isBoardCategory: (codeList: Category) => boolean,
    isEdgeCategory: (codeList: Category) => boolean,
    isMaterialCategory: (codeList: Category) => boolean,
    addBoardCategory: (codeList: Category) => Promise<void>,
    addEdgeCategory: (codeList: Category) => Promise<void>,
    deleteBoardCategory: (codeList: Category) => Promise<void>,
    deleteEdgeCategory: (codeList: Category) => Promise<void>,
    setMaterialCategory: (codeList: Category) => Promise<void>
}