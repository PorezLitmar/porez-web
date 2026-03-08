import {CONTEXT_PATH, getData} from '../';
import type {HealthStatus} from '../../model/porez';

export const livez = () => {
    return getData<HealthStatus>(CONTEXT_PATH + 'livez');
}

export const readyz = () => {
    return getData<HealthStatus>(CONTEXT_PATH + 'readyz');
}
