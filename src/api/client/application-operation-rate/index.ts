import {CONTEXT_PATH, getData, putData} from '../';
import type {ApplicationOperationRate, ApplicationOperationRateData, ApplicationOperationRateType} from '../../model/porez';

const PATH = CONTEXT_PATH + 'application-operation-rates';

export const getApplicationOperationRates = (type: ApplicationOperationRateType, accessToken?: string) => {
    return getData<ApplicationOperationRate[]>(PATH + '/' + type, undefined, accessToken);
}

export const setApplicationOperationRates = (type: ApplicationOperationRateType, data: ApplicationOperationRateData[], accessToken?: string) => {
    return putData<ApplicationOperationRate[]>(PATH + '/' + type, data, accessToken);
}
