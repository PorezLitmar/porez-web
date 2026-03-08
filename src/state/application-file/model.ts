import type {ApplicationFileInfo} from '../../api/model/porez';

export interface ApplicationFileState {
    busy: boolean,
    previous: boolean,
    next: boolean,
    page: number,
    totalPages: number,
    setPage: (page: number) => void,
    data?: ApplicationFileInfo[],
    getApplicationInfoFiles: () => Promise<void>,
    getApplicationFile: (id: string) => Promise<Blob | undefined>,
    addApplicationFile: (label: string, file: File) => Promise<void>,
    setApplicationFileLabel: (id: string, label: string) => Promise<void>,
    setApplicationFileData: (id: string, file: File) => Promise<void>,
    deleteApplicationFile: (id: string) => Promise<void>
}