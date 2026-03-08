import {CONTEXT_PATH, getData, putData, putFormData} from '../';
import type {ApplicationImageInfo, CompanyInfo, FreeDay, StringValue} from '../../model/porez';

const PATH = CONTEXT_PATH + 'application-info';

export const getApplicationInfo = () => {
    return getData<string[]>(PATH);
}

export const setApplicationInfo = (applicationInfo: string[], accessToken?: string) => {
    return putData<string[]>(PATH, applicationInfo, accessToken);
}

export const getBusinessConditions = () => {
    return getData<StringValue>(PATH + '/business-conditions');
}

export const setBusinessConditions = (businessConditions: string, accessToken?: string) => {
    return putData<StringValue>(PATH + '/business-conditions', {value: businessConditions}, accessToken);
}

export const getCompanyInfo = () => {
    return getData<CompanyInfo>(PATH + '/company-info');
}

export const setCompanyInfo = (companyInfo: CompanyInfo, accessToken?: string) => {
    return putData<CompanyInfo>(PATH + '/company-info', companyInfo, accessToken);
}

export const getCookiesInfo = () => {
    return getData<StringValue>(PATH + '/cookies-info');
}

export const setCookiesInfo = (cookiesInfo: string, accessToken?: string) => {
    return putData<StringValue>(PATH + '/cookies-info', {value: cookiesInfo}, accessToken);
}

export const getFreeDays = () => {
    return getData<FreeDay[]>(PATH + '/free-days');
}

export const setFreeDays = (freeDays: FreeDay[], accessToken?: string) => {
    return putData<FreeDay[]>(PATH + '/free-days', freeDays, accessToken);
}

export const getGdprInfo = () => {
    return getData<StringValue>(PATH + '/gdpr-info');
}

export const setGdprInfo = (gdprInfo: string, accessToken?: string) => {
    return putData<StringValue>(PATH + '/gdpr-info', {value: gdprInfo}, accessToken);
}

export const getLogoPath = () => {
    return PATH + '/logo';
}

export const setLogo = (file: File, accessToken?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    return putFormData<ApplicationImageInfo>(PATH + '/logo', formData, accessToken);
}

export const getOrderInfo = () => {
    return getData<StringValue>(PATH + '/order-info');
}

export const setOrderInfo = (orderInfo: string, accessToken?: string) => {
    return putData<StringValue>(PATH + '/order-info', {value: orderInfo}, accessToken);
}

export const getWelcomeText = () => {
    return getData<StringValue>(PATH + '/welcome-text');
}

export const setWelcomeText = (welcomeText: string, accessToken?: string) => {
    return putData<StringValue>(PATH + '/welcome-text', {value: welcomeText}, accessToken);
}

export const getWorkingHours = () => {
    return getData<StringValue>(PATH + '/working-hours');
}

export const setWorkingHours = (workingHours: string, accessToken?: string) => {
    return putData<StringValue>(PATH + '/working-hours', {value: workingHours}, accessToken);
}
