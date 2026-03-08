import {CONTEXT_PATH, postData} from '../';
import type {Captcha} from '../../model/porez';

const PATH = CONTEXT_PATH + 'captcha';

export const generateCaptcha = () => {
    return postData<Captcha>(PATH + '/generate', undefined);
}
