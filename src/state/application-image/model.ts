import type {ApplicationImageInfo} from '../../api/model/porez';

export interface ApplicationImageState {
    busy: boolean,
    previous: boolean,
    next: boolean,
    page: number,
    totalPages: number,
    setPage: (page: number) => void,
    data?: ApplicationImageInfo[],
    getApplicationInfoImages: () => Promise<void>,
    addApplicationImage: (file: File) => Promise<void>,
    setApplicationImage: (id: string, file: File) => Promise<void>,
    deleteApplicationImage: (id: string) => Promise<void>
}