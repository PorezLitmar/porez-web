import {
    type ClientResponse,
    CONTEXT_PATH,
    createAuthorization,
    deleteData,
    getData,
    patchData,
    patchFormData,
    postFormData,
    setPageableQueryParams,
    toErrorMessage
} from '../';
import type {Pageable} from '../../model';
import type {ApplicationFileInfo, PageApplicationFileInfo} from '../../model/porez';

const PATH = CONTEXT_PATH + 'application-files';

export const getApplicationFiles = (pageable?: Pageable, accessToken?: string) => {
    const queryParams = new URLSearchParams();
    setPageableQueryParams(queryParams, pageable);
    return getData<PageApplicationFileInfo>(PATH, queryParams, accessToken);
}

export const addApplicationFile = (label: string, file: File, accessToken?: string) => {
    const formData = new FormData();
    formData.append('label', label);
    formData.append('file', file);

    return postFormData<ApplicationFileInfo>(PATH, formData, accessToken);
}

export const getApplicationFile = async (id: string, accessToken?: string): Promise<ClientResponse<Blob>> => {
    const authorization = createAuthorization(accessToken);
    const response = await fetch(PATH + '/' + id, {
        method: 'GET',
        headers: {
            ...authorization
        }
    });

    let data, error;
    if (response.ok) {
        data = await response.blob();
    } else {
        error = await toErrorMessage(response);
    }
    return {data, error};
}

export const deleteApplicationFile = (id: string, accessToken?: string) => {
    return deleteData<void>(PATH + '/' + id, accessToken);
}

export const setApplicationFileData = (id: string, file: File, accessToken?: string) => {
    const formData = new FormData();
    formData.append('file', file);

    return patchFormData<ApplicationFileInfo>(PATH + '/' + id + '/data', formData, accessToken);
}

export const setApplicationFileLabel = (id: string, label: string, accessToken?: string) => {
    return patchData<ApplicationFileInfo>(PATH + '/' + id + '/label', {value: label}, accessToken);
}
