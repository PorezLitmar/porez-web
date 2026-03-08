export const EMAIL_REGEX = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

export const PHONE_REGEX = new RegExp(/^[0-9+ ]+$/);

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export const fieldError = <T, K extends keyof T>(field: K, message: string): FieldErrors<T> => {
    return {[field]: message} as FieldErrors<T>;
}

export const isBlank = (value?: string) => {
    return value === undefined || value.trim().length === 0;
}

export const formatNumber = (value?: number) => {
    if (value === undefined || Number.isNaN(value)) {
        return '';
    }
    return value.toString().replace('.', ',');
}

export const parseNumber = (value?: string) => {
    if (isBlank(value)) {
        return undefined;
    }

    const normalized = (value ?? '').trim().replace(',', '.');
    const result = Number(normalized);
    return Number.isNaN(result) ? undefined : result;
}

export const parseDate = (value?: string) => {
    if (isBlank(value)) {
        return undefined;
    }

    const result = new Date(Date.parse(value ?? ''));
    if (!Number.isNaN(result.getTime())) {
        return result;
    }
}

export const formatDate = (value?: Date) => {
    if (value !== undefined && !Number.isNaN(value.getTime())) {
        const year = `${value.getFullYear()}`.padStart(4, '0');
        const month = `${value.getMonth() + 1}`.padStart(2, '0');
        const day = `${value.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    return '';
}

export const formatDateTime = (value?: Date) => {
    if (value !== undefined && !Number.isNaN(value.getTime())) {
        const year = `${value.getFullYear()}`.padStart(4, '0');
        const month = `${value.getMonth() + 1}`.padStart(2, '0');
        const day = `${value.getDate()}`.padStart(2, '0');
        const hours = `${value.getHours()}`.padStart(2, '0');
        const minutes = `${value.getMinutes()}`.padStart(2, '0');
        const seconds = `${value.getSeconds()}`.padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }
    return '';
}

export const formatStringDate = (value?: string, locale?: string) => {
    if (value) {
        const date = new Date(Date.parse(value));
        if (locale) {
            return date.toLocaleDateString(locale.replace('_', '-'));
        } else {
            return date.toLocaleDateString();
        }
    }
    return '';
}

export const formatStringDateTime = (value?: string, locale?: string) => {
    if (value) {
        const date = new Date(Date.parse(value));
        if (locale) {
            return date.toLocaleString(locale.replace('_', '-'));
        } else {
            return date.toLocaleString();
        }
    }
    return '';
}

export const formatBoolean = (value?: boolean) => {
    if (value !== undefined) {
        return value ? 'Áno' : 'Nie';
    }
    return '';
}

export const parseStringArray = (separator: string, s?: string): string[] => {
    if (isBlank(s)) {
        return [];
    }
    return (s ?? '').split(separator);
}

export const getEnumValue = <K, V>(key: K, entries: Array<{ key: K; value: V }>) => {
    return entries.find(e => e.key === key)?.value;
}

export const validateRequired = <T, K extends keyof T>(
    field: K,
    value: string | undefined,
    message = 'Povinné pole'
): FieldErrors<T> => {
    if (isBlank(value ?? '')) {
        return fieldError<T, K>(field, message);
    }
    return {};
}

export const validatePattern = <T, K extends keyof T>(
    field: K,
    value: string | undefined,
    regex: RegExp,
    options?: {
        message?: string;
        allowBlank?: boolean;
        requiredMessage?: string;
    }
): FieldErrors<T> => {
    const allowBlank = options?.allowBlank ?? true;
    const invalidMessage = options?.message ?? 'Neplatná hodnota';
    const requiredMessage = options?.requiredMessage ?? 'Povinné pole';

    if (isBlank(value ?? '')) {
        return allowBlank ? {} : fieldError<T, K>(field, requiredMessage);
    }

    const matcher = new RegExp(regex.source, regex.flags);
    if (!matcher.test(value ?? '')) {
        return fieldError<T, K>(field, invalidMessage);
    }

    return {};
}

export const validateEmail = <T, K extends keyof T>(
    field: K,
    value: string | undefined,
    options?: {
        requiredMessage?: string;
        invalidMessage?: string;
        regex?: RegExp;
    }
): FieldErrors<T> => {
    const regex = options?.regex ?? EMAIL_REGEX;
    return validatePattern<T, K>(field, value, regex, {
        allowBlank: false,
        requiredMessage: options?.requiredMessage ?? 'Vyžaduje sa email',
        message: options?.invalidMessage ?? 'Neplatný email'
    });
};

export const validateNumber = <T, K extends keyof T>(
    field: K,
    value: string | undefined,
    options?: {
        message?: string;
        allowBlank?: boolean;
        requiredMessage?: string;
    }
): FieldErrors<T> => {
    const allowBlank = options?.allowBlank ?? true;
    const invalidMessage = options?.message ?? 'Neplatná hodnota';
    const requiredMessage = options?.requiredMessage ?? 'Povinné pole';

    if (isBlank(value ?? '')) {
        return allowBlank ? {} : fieldError<T, K>(field, requiredMessage);
    }

    const num = parseNumber(value);
    if (num === undefined) {
        return fieldError<T, K>(field, invalidMessage);
    }

    return {};
}

export const validateIntegerNumber = <T, K extends keyof T>(
    field: K,
    value: string | undefined,
    options?: {
        message?: string;
        allowBlank?: boolean;
        requiredMessage?: string;
    }
): FieldErrors<T> => {
    const allowBlank = options?.allowBlank ?? true;
    const invalidMessage = options?.message ?? 'Neplatná hodnota';
    const requiredMessage = options?.requiredMessage ?? 'Povinné pole';

    if (isBlank(value ?? '')) {
        return allowBlank ? {} : fieldError<T, K>(field, requiredMessage);
    }

    const num = parseNumber(value);
    if (num === undefined || !Number.isInteger(num)) {
        return fieldError<T, K>(field, invalidMessage);
    }

    return {};
}
