import {CONTEXT_PATH, getData} from '../';
import type {ApplicationProperties} from '../../model/porez';

const PATH = CONTEXT_PATH + 'application-properties';

export const getApplicationProperties = () => {
    return getData<ApplicationProperties>(PATH);
}