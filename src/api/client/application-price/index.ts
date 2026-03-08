import {CONTEXT_PATH, getData, putData} from '../';
import type {ApplicationPriceEntry} from '../../model/porez';

const PATH = CONTEXT_PATH + 'application-prices';

export const getApplicationPrices = (accessToken?: string) => {
    return getData<ApplicationPriceEntry[]>(PATH, undefined, accessToken);
}

export const setApplicationPrice = (data: ApplicationPriceEntry, accessToken?: string) => {
    return putData<ApplicationPriceEntry>(PATH, data, accessToken);
}
