import {CONTEXT_PATH, deleteData, getData, postFormData, putFormData, setPageableQueryParams} from '../';
import type {Pageable} from '../../model';
import type {ApplicationFileInfo, ApplicationImageInfo, PageApplicationImageInfo} from '../../model/porez';

const PATH = CONTEXT_PATH + 'application-images';

export const getApplicationImages = (pageable?: Pageable, accessToken?: string) => {
    const queryParams = new URLSearchParams();
    setPageableQueryParams(queryParams, pageable);
    return getData<PageApplicationImageInfo>(PATH, queryParams, accessToken);
}

export const addApplicationImage = (file: File, accessToken?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    return postFormData<ApplicationImageInfo>(PATH, formData, accessToken);
}

export const getApplicationImagePath = (id: string) => {
    return PATH + '/' + id;
}

export const setApplicationImage = (id: string, file: File, accessToken?: string) => {
    const formData = new FormData();
    formData.append('file', file);

    return putFormData<ApplicationFileInfo>(PATH + '/' + id, formData, accessToken);
}

export const deleteApplicationImage = (id: string, accessToken?: string) => {
    return deleteData<void>(PATH + '/' + id, accessToken);
}