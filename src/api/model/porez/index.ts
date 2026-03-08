/* tslint:disable */
/* eslint-disable */

/**
 * 
 * @export
 */
export const App = {
    TITLE: 'TITLE',
    DESCRIPTION: 'DESCRIPTION',
    MAIL_FROM: 'MAIL_FROM',
    MAIL_TO: 'MAIL_TO',
    WEB_URL: 'WEB_URL',
    ORDERS_PATH: 'ORDERS_PATH',
    LOGO_ID: 'LOGO_ID'
} as const;
export type App = typeof App[keyof typeof App];

/**
 * 
 * @export
 * @interface AppEntry
 */
export interface AppEntry {
    /**
     * 
     * @type {App}
     * @memberof AppEntry
     */
    key: App;
    /**
     * 
     * @type {string}
     * @memberof AppEntry
     */
    value: string;
}


/**
 * 
 * @export
 * @interface ApplicationFileInfo
 */
export interface ApplicationFileInfo {
    /**
     * 
     * @type {string}
     * @memberof ApplicationFileInfo
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof ApplicationFileInfo
     */
    label?: string;
    /**
     * 
     * @type {string}
     * @memberof ApplicationFileInfo
     */
    fileName?: string;
    /**
     * 
     * @type {string}
     * @memberof ApplicationFileInfo
     */
    fileType?: string;
}
/**
 * 
 * @export
 * @interface ApplicationImageInfo
 */
export interface ApplicationImageInfo {
    /**
     * 
     * @type {string}
     * @memberof ApplicationImageInfo
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof ApplicationImageInfo
     */
    fileName?: string;
    /**
     * 
     * @type {string}
     * @memberof ApplicationImageInfo
     */
    fileType?: string;
    /**
     * 
     * @type {string}
     * @memberof ApplicationImageInfo
     */
    thumbnail?: string;
}
/**
 * 
 * @export
 * @interface ApplicationOperationRate
 */
export interface ApplicationOperationRate {
    /**
     * 
     * @type {ApplicationOperationRateType}
     * @memberof ApplicationOperationRate
     */
    type?: ApplicationOperationRateType;
    /**
     * 
     * @type {number}
     * @memberof ApplicationOperationRate
     */
    parameter?: number;
    /**
     * 
     * @type {number}
     * @memberof ApplicationOperationRate
     */
    value?: number;
}


/**
 * 
 * @export
 * @interface ApplicationOperationRateData
 */
export interface ApplicationOperationRateData {
    /**
     * 
     * @type {number}
     * @memberof ApplicationOperationRateData
     */
    parameter: number;
    /**
     * 
     * @type {number}
     * @memberof ApplicationOperationRateData
     */
    value: number;
}

/**
 * 
 * @export
 */
export const ApplicationOperationRateType = {
    GLUING: 'GLUING',
    SAWING: 'SAWING'
} as const;
export type ApplicationOperationRateType = typeof ApplicationOperationRateType[keyof typeof ApplicationOperationRateType];


/**
 * 
 * @export
 */
export const ApplicationPrice = {
    AREA_GLUING: 'AREA_GLUING'
} as const;
export type ApplicationPrice = typeof ApplicationPrice[keyof typeof ApplicationPrice];

/**
 * 
 * @export
 * @interface ApplicationPriceEntry
 */
export interface ApplicationPriceEntry {
    /**
     * 
     * @type {ApplicationPrice}
     * @memberof ApplicationPriceEntry
     */
    key: ApplicationPrice;
    /**
     * 
     * @type {number}
     * @memberof ApplicationPriceEntry
     */
    value: number;
}


/**
 * 
 * @export
 * @interface ApplicationProperties
 */
export interface ApplicationProperties {
    /**
     * 
     * @type {string}
     * @memberof ApplicationProperties
     */
    defaultLocale?: string;
    /**
     * 
     * @type {number}
     * @memberof ApplicationProperties
     */
    accessTokenExpiresIn?: number;
    /**
     * 
     * @type {number}
     * @memberof ApplicationProperties
     */
    refreshTokenExpiresIn?: number;
}
/**
 * 
 * @export
 * @interface AuthenticationResponse
 */
export interface AuthenticationResponse {
    /**
     * 
     * @type {string}
     * @memberof AuthenticationResponse
     */
    accessToken?: string;
    /**
     * 
     * @type {string}
     * @memberof AuthenticationResponse
     */
    refreshToken?: string;
}

/**
 * 
 * @export
 */
export const Authority = {
    P_ADMIN: 'p_admin',
    P_MANAGER: 'p_manager',
    P_EMPLOYEE: 'p_employee',
    P_CUSTOMER: 'p_customer'
} as const;
export type Authority = typeof Authority[keyof typeof Authority];

/**
 * 
 * @export
 * @interface Board
 */
export interface Board {
    /**
     * 
     * @type {string}
     * @memberof Board
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof Board
     */
    code?: string;
    /**
     * 
     * @type {string}
     * @memberof Board
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof Board
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof Board
     */
    boardCode?: string;
    /**
     * 
     * @type {string}
     * @memberof Board
     */
    structureCode?: string;
    /**
     * 
     * @type {boolean}
     * @memberof Board
     */
    orientation?: boolean;
    /**
     * 
     * @type {number}
     * @memberof Board
     */
    weight?: number;
    /**
     * 
     * @type {number}
     * @memberof Board
     */
    length?: number;
    /**
     * 
     * @type {number}
     * @memberof Board
     */
    width?: number;
    /**
     * 
     * @type {number}
     * @memberof Board
     */
    thickness?: number;
    /**
     * 
     * @type {number}
     * @memberof Board
     */
    price?: number;
    /**
     * 
     * @type {number}
     * @memberof Board
     */
    vatPrice?: number;
    /**
     * 
     * @type {boolean}
     * @memberof Board
     */
    inStock?: boolean;
    /**
     * 
     * @type {Array<Edge>}
     * @memberof Board
     */
    edges?: Array<Edge>;
    /**
     * 
     * @type {Array<CategoryItem>}
     * @memberof Board
     */
    categoryItems?: Array<CategoryItem>;
}
/**
 * 
 * @export
 * @interface BoardData
 */
export interface BoardData {
    /**
     * 
     * @type {string}
     * @memberof BoardData
     */
    code: string;
    /**
     * 
     * @type {string}
     * @memberof BoardData
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof BoardData
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof BoardData
     */
    boardCode?: string;
    /**
     * 
     * @type {string}
     * @memberof BoardData
     */
    structureCode: string;
    /**
     * 
     * @type {boolean}
     * @memberof BoardData
     */
    orientation: boolean;
    /**
     * 
     * @type {number}
     * @memberof BoardData
     */
    weight: number;
    /**
     * 
     * @type {number}
     * @memberof BoardData
     */
    length: number;
    /**
     * 
     * @type {number}
     * @memberof BoardData
     */
    width: number;
    /**
     * 
     * @type {number}
     * @memberof BoardData
     */
    thickness: number;
    /**
     * 
     * @type {number}
     * @memberof BoardData
     */
    price: number;
    /**
     * 
     * @type {boolean}
     * @memberof BoardData
     */
    inStock: boolean;
}

/**
 * 
 * @export
 */
export const BooleanProperty = {
    MAINTENANCE: 'MAINTENANCE'
} as const;
export type BooleanProperty = typeof BooleanProperty[keyof typeof BooleanProperty];

/**
 * 
 * @export
 * @interface BooleanValue
 */
export interface BooleanValue {
    /**
     * 
     * @type {boolean}
     * @memberof BooleanValue
     */
    value: boolean;
}
/**
 * 
 * @export
 * @interface Captcha
 */
export interface Captcha {
    /**
     * 
     * @type {string}
     * @memberof Captcha
     */
    captchaToken?: string;
    /**
     * 
     * @type {string}
     * @memberof Captcha
     */
    captchaImage?: string;
}
/**
 * 
 * @export
 * @interface Category
 */
export interface Category {
    /**
     * 
     * @type {string}
     * @memberof Category
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof Category
     */
    code?: string;
    /**
     * 
     * @type {string}
     * @memberof Category
     */
    name?: string;
}
/**
 * 
 * @export
 * @interface CategoryItem
 */
export interface CategoryItem {
    /**
     * 
     * @type {string}
     * @memberof CategoryItem
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof CategoryItem
     */
    code?: string;
    /**
     * 
     * @type {string}
     * @memberof CategoryItem
     */
    name?: string;
    /**
     * 
     * @type {Category}
     * @memberof CategoryItem
     */
    category?: Category;
}
/**
 * 
 * @export
 * @interface CategoryItemData
 */
export interface CategoryItemData {
    /**
     * 
     * @type {string}
     * @memberof CategoryItemData
     */
    categoryId: string;
    /**
     * 
     * @type {string}
     * @memberof CategoryItemData
     */
    itemId: string;
}
/**
 * 
 * @export
 * @interface ChangeEmail
 */
export interface ChangeEmail {
    /**
     * 
     * @type {string}
     * @memberof ChangeEmail
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof ChangeEmail
     */
    password: string;
}
/**
 * 
 * @export
 * @interface ChangePassword
 */
export interface ChangePassword {
    /**
     * 
     * @type {string}
     * @memberof ChangePassword
     */
    oldPassword: string;
    /**
     * 
     * @type {string}
     * @memberof ChangePassword
     */
    newPassword: string;
}
/**
 * 
 * @export
 * @interface ChangeUserProfile
 */
export interface ChangeUserProfile {
    /**
     * 
     * @type {string}
     * @memberof ChangeUserProfile
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof ChangeUserProfile
     */
    firstName: string;
    /**
     * 
     * @type {string}
     * @memberof ChangeUserProfile
     */
    lastName: string;
}
/**
 * 
 * @export
 * @interface CodeList
 */
export interface CodeList {
    /**
     * 
     * @type {string}
     * @memberof CodeList
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof CodeList
     */
    code?: string;
    /**
     * 
     * @type {string}
     * @memberof CodeList
     */
    name?: string;
}
/**
 * 
 * @export
 * @interface CodeListData
 */
export interface CodeListData {
    /**
     * 
     * @type {string}
     * @memberof CodeListData
     */
    code: string;
    /**
     * 
     * @type {string}
     * @memberof CodeListData
     */
    name: string;
}
/**
 * 
 * @export
 * @interface CodeListItem
 */
export interface CodeListItem {
    /**
     * 
     * @type {string}
     * @memberof CodeListItem
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof CodeListItem
     */
    codeListId?: string;
    /**
     * 
     * @type {number}
     * @memberof CodeListItem
     */
    sortNum?: number;
    /**
     * 
     * @type {string}
     * @memberof CodeListItem
     */
    code?: string;
    /**
     * 
     * @type {string}
     * @memberof CodeListItem
     */
    value?: string;
    /**
     * 
     * @type {boolean}
     * @memberof CodeListItem
     */
    leafNode?: boolean;
}
/**
 * 
 * @export
 * @interface CodeListItemData
 */
export interface CodeListItemData {
    /**
     * 
     * @type {string}
     * @memberof CodeListItemData
     */
    codeListId: string;
    /**
     * 
     * @type {string}
     * @memberof CodeListItemData
     */
    parentId?: string;
    /**
     * 
     * @type {string}
     * @memberof CodeListItemData
     */
    code: string;
    /**
     * 
     * @type {string}
     * @memberof CodeListItemData
     */
    value: string;
}
/**
 * 
 * @export
 * @interface CompanyInfo
 */
export interface CompanyInfo {
    /**
     * 
     * @type {string}
     * @memberof CompanyInfo
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof CompanyInfo
     */
    street: string;
    /**
     * 
     * @type {string}
     * @memberof CompanyInfo
     */
    city: string;
    /**
     * 
     * @type {string}
     * @memberof CompanyInfo
     */
    zipCode: string;
    /**
     * 
     * @type {string}
     * @memberof CompanyInfo
     */
    state: string;
    /**
     * 
     * @type {string}
     * @memberof CompanyInfo
     */
    phone: string;
    /**
     * 
     * @type {string}
     * @memberof CompanyInfo
     */
    mail: string;
    /**
     * 
     * @type {string}
     * @memberof CompanyInfo
     */
    businessId: string;
    /**
     * 
     * @type {string}
     * @memberof CompanyInfo
     */
    taxId: string;
    /**
     * 
     * @type {string}
     * @memberof CompanyInfo
     */
    vatRegNo: string;
    /**
     * 
     * @type {string}
     * @memberof CompanyInfo
     */
    commercialRegisterInfo: string;
    /**
     * 
     * @type {string}
     * @memberof CompanyInfo
     */
    mapUrl: string;
}

/**
 * 
 * @export
 */
export const CsvPattern = {
    PRODUCT_NUMBER: 'PRODUCT_NUMBER',
    BOARD_NUMBER: 'BOARD_NUMBER',
    NAME_BOARD: 'NAME_BOARD',
    NAME_DOUBLED_PRODUCT: 'NAME_DOUBLED_PRODUCT',
    NAME_DOUBLED_BOARD: 'NAME_DOUBLED_BOARD',
    NAME_FRAME_PRODUCT: 'NAME_FRAME_PRODUCT',
    NAME_FRAME_BOARD: 'NAME_FRAME_BOARD',
    NAME_FRAMED_PRODUCT: 'NAME_FRAMED_PRODUCT',
    NAME_FRAMED_BOARD: 'NAME_FRAMED_BOARD',
    MATERIAL: 'MATERIAL',
    DECOR: 'DECOR',
    LENGTH: 'LENGTH',
    WIDTH: 'WIDTH',
    THICKNESS: 'THICKNESS',
    QUANTITY: 'QUANTITY',
    ORIENTATION: 'ORIENTATION',
    EDGE: 'EDGE'
} as const;
export type CsvPattern = typeof CsvPattern[keyof typeof CsvPattern];

/**
 * 
 * @export
 * @interface CsvPatternEntry
 */
export interface CsvPatternEntry {
    /**
     * 
     * @type {CsvPattern}
     * @memberof CsvPatternEntry
     */
    key: CsvPattern;
    /**
     * 
     * @type {string}
     * @memberof CsvPatternEntry
     */
    value: string;
}



/**
 * 
 * @export
 */
export const CsvText = {
    NUMBER: 'NUMBER',
    NAME: 'NAME',
    MATERIAL: 'MATERIAL',
    DECOR: 'DECOR',
    LENGTH: 'LENGTH',
    WIDTH: 'WIDTH',
    THICKNESS: 'THICKNESS',
    QUANTITY: 'QUANTITY',
    ORIENTATION: 'ORIENTATION',
    EDGE_A1: 'EDGE_A1',
    EDGE_A2: 'EDGE_A2',
    EDGE_B1: 'EDGE_B1',
    EDGE_B2: 'EDGE_B2',
    DESCRIPTION: 'DESCRIPTION',
    SEPARATOR: 'SEPARATOR'
} as const;
export type CsvText = typeof CsvText[keyof typeof CsvText];

/**
 * 
 * @export
 * @interface CsvTextEntry
 */
export interface CsvTextEntry {
    /**
     * 
     * @type {CsvText}
     * @memberof CsvTextEntry
     */
    key: CsvText;
    /**
     * 
     * @type {string}
     * @memberof CsvTextEntry
     */
    value: string;
}



/**
 * 
 * @export
 */
export const DecimalProperty = {
    EDGE_WIDTH_MAX_APPEND: 'EDGE_WIDTH_MAX_APPEND',
    EDGE_WIDTH_MIN_APPEND: 'EDGE_WIDTH_MIN_APPEND',
    AREA_GLUING_APPEND: 'AREA_GLUING_APPEND',
    VAT_RATE: 'VAT_RATE',
    ORDER_BOARD_COUNT_COEFFICIENT: 'ORDER_BOARD_COUNT_COEFFICIENT',
    EDGE_LENGTH_APPEND: 'EDGE_LENGTH_APPEND',
    IMAGE_FRAME_SIZE: 'IMAGE_FRAME_SIZE',
    IMAGE_FONT_SIZE: 'IMAGE_FONT_SIZE',
    IMAGE_BASE_LINE_WIDTH: 'IMAGE_BASE_LINE_WIDTH',
    IMAGE_EDGE_COEFFICIENT: 'IMAGE_EDGE_COEFFICIENT',
    PRODUCT_MINIMAL_LENGTH: 'PRODUCT_MINIMAL_LENGTH',
    PRODUCT_MINIMAL_WIDTH: 'PRODUCT_MINIMAL_WIDTH'
} as const;
export type DecimalProperty = typeof DecimalProperty[keyof typeof DecimalProperty];

/**
 * 
 * @export
 * @interface DecimalPropertyEntry
 */
export interface DecimalPropertyEntry {
    /**
     * 
     * @type {DecimalProperty}
     * @memberof DecimalPropertyEntry
     */
    key: DecimalProperty;
    /**
     * 
     * @type {number}
     * @memberof DecimalPropertyEntry
     */
    value: number;
}


/**
 * 
 * @export
 * @interface Edge
 */
export interface Edge {
    /**
     * 
     * @type {string}
     * @memberof Edge
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof Edge
     */
    code?: string;
    /**
     * 
     * @type {string}
     * @memberof Edge
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof Edge
     */
    description?: string;
    /**
     * 
     * @type {number}
     * @memberof Edge
     */
    weight?: number;
    /**
     * 
     * @type {number}
     * @memberof Edge
     */
    width?: number;
    /**
     * 
     * @type {number}
     * @memberof Edge
     */
    thickness?: number;
    /**
     * 
     * @type {number}
     * @memberof Edge
     */
    price?: number;
    /**
     * 
     * @type {number}
     * @memberof Edge
     */
    vatPrice?: number;
    /**
     * 
     * @type {boolean}
     * @memberof Edge
     */
    inStock?: boolean;
    /**
     * 
     * @type {Array<CategoryItem>}
     * @memberof Edge
     */
    categoryItems?: Array<CategoryItem>;
}
/**
 * 
 * @export
 * @interface EdgeData
 */
export interface EdgeData {
    /**
     * 
     * @type {string}
     * @memberof EdgeData
     */
    code: string;
    /**
     * 
     * @type {string}
     * @memberof EdgeData
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof EdgeData
     */
    description?: string;
    /**
     * 
     * @type {number}
     * @memberof EdgeData
     */
    weight: number;
    /**
     * 
     * @type {number}
     * @memberof EdgeData
     */
    width: number;
    /**
     * 
     * @type {number}
     * @memberof EdgeData
     */
    thickness: number;
    /**
     * 
     * @type {number}
     * @memberof EdgeData
     */
    price: number;
    /**
     * 
     * @type {boolean}
     * @memberof EdgeData
     */
    inStock: boolean;
}

/**
 * 
 * @export
 */
export const ErrorCode = {
    UNKNOWN: 'UNKNOWN',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    INVALID_CAPTCHA: 'INVALID_CAPTCHA',
    APPLICATION_IMAGE_NOT_SUPPORTED: 'APPLICATION_IMAGE_NOT_SUPPORTED',
    CODE_IS_USED: 'CODE_IS_USED',
    CODE_LIST_ITEM_NOT_EMPTY: 'CODE_LIST_ITEM_NOT_EMPTY',
    ORDER_IS_IMMUTABLE: 'ORDER_IS_IMMUTABLE',
    ORDER_STATUS_INVALID: 'ORDER_STATUS_INVALID',
    ORDER_IS_EMPTY: 'ORDER_IS_EMPTY',
    ORDER_AGREEMENTS_INVALID: 'ORDER_AGREEMENTS_INVALID',
    ORDER_DELIVERY_DATE_INVALID: 'ORDER_DELIVERY_DATE_INVALID',
    ORDER_DELIVERY_DATE_NOT_WORKING_DAY: 'ORDER_DELIVERY_DATE_NOT_WORKING_DAY',
    ORDER_DELIVERY_DATE_MIN_DELIVERY_DAYS: 'ORDER_DELIVERY_DATE_MIN_DELIVERY_DAYS',
    ORDER_ITEM_NOT_VALID: 'ORDER_ITEM_NOT_VALID'
} as const;
export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

/**
 * 
 * @export
 * @interface ErrorMessage
 */
export interface ErrorMessage {
    /**
     * 
     * @type {ErrorCode}
     * @memberof ErrorMessage
     */
    code?: ErrorCode;
    /**
     * 
     * @type {string}
     * @memberof ErrorMessage
     */
    message?: string;
    /**
     * 
     * @type {string}
     * @memberof ErrorMessage
     */
    timestamp?: string;
}


/**
 * 
 * @export
 * @interface FreeDay
 */
export interface FreeDay {
    /**
     * 
     * @type {string}
     * @memberof FreeDay
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof FreeDay
     */
    day: number;
    /**
     * 
     * @type {number}
     * @memberof FreeDay
     */
    month: number;
}
/**
 * 
 * @export
 * @interface HealthStatus
 */
export interface HealthStatus {
    /**
     * 
     * @type {string}
     * @memberof HealthStatus
     */
    status?: string;
}

/**
 * 
 * @export
 */
export const HtmlPattern = {
    TITLE: 'TITLE',
    ORDER_NUMBER: 'ORDER_NUMBER',
    DIMENSIONS: 'DIMENSIONS',
    QUANTITY: 'QUANTITY',
    WEIGHT: 'WEIGHT',
    BOARD_CONSUMPTION: 'BOARD_CONSUMPTION',
    BOARD_COUNT: 'BOARD_COUNT',
    EDGE_LENGTH: 'EDGE_LENGTH',
    EDGE_CONSUMPTION: 'EDGE_CONSUMPTION',
    GLUE_AREA: 'GLUE_AREA',
    SAW_THICKNESS: 'SAW_THICKNESS',
    SAW_LENGTH: 'SAW_LENGTH',
    PRICE: 'PRICE',
    DECOR: 'DECOR',
    EDGE: 'EDGE',
    CORNER_STRAIGHT: 'CORNER_STRAIGHT',
    CORNER_ROUNDED: 'CORNER_ROUNDED'
} as const;
export type HtmlPattern = typeof HtmlPattern[keyof typeof HtmlPattern];

/**
 * 
 * @export
 * @interface HtmlPatternEntry
 */
export interface HtmlPatternEntry {
    /**
     * 
     * @type {HtmlPattern}
     * @memberof HtmlPatternEntry
     */
    key: HtmlPattern;
    /**
     * 
     * @type {string}
     * @memberof HtmlPatternEntry
     */
    value: string;
}



/**
 * 
 * @export
 */
export const HtmlText = {
    CREATOR: 'CREATOR',
    CREATED: 'CREATED',
    ORDER_NUMBER: 'ORDER_NUMBER',
    DELIVERY_DATE: 'DELIVERY_DATE',
    PACKAGE_TYPE: 'PACKAGE_TYPE',
    CONTACT_INFO: 'CONTACT_INFO',
    NAME: 'NAME',
    STREET: 'STREET',
    ZIP_CODE: 'ZIP_CODE',
    CITY: 'CITY',
    STATE: 'STATE',
    PHONE: 'PHONE',
    EMAIL: 'EMAIL',
    BUSINESS_ID: 'BUSINESS_ID',
    TAX_ID: 'TAX_ID',
    ORDER_SUMMARY: 'ORDER_SUMMARY',
    BOARD_SUMMARY: 'BOARD_SUMMARY',
    BOARD_SUMMARY_MATERIAL: 'BOARD_SUMMARY_MATERIAL',
    BOARD_SUMMARY_NAME: 'BOARD_SUMMARY_NAME',
    BOARD_SUMMARY_CONSUMPTION: 'BOARD_SUMMARY_CONSUMPTION',
    BOARD_SUMMARY_COUNT: 'BOARD_SUMMARY_COUNT',
    BOARD_SUMMARY_WEIGHT: 'BOARD_SUMMARY_WEIGHT',
    BOARD_SUMMARY_PRICE: 'BOARD_SUMMARY_PRICE',
    BOARD_SUMMARY_VAT_PRICE: 'BOARD_SUMMARY_VAT_PRICE',
    EDGE_SUMMARY: 'EDGE_SUMMARY',
    EDGE_SUMMARY_NAME: 'EDGE_SUMMARY_NAME',
    EDGE_SUMMARY_LENGTH: 'EDGE_SUMMARY_LENGTH',
    EDGE_SUMMARY_CONSUMPTION: 'EDGE_SUMMARY_CONSUMPTION',
    EDGE_SUMMARY_WEIGHT: 'EDGE_SUMMARY_WEIGHT',
    EDGE_SUMMARY_EDGE_PRICE: 'EDGE_SUMMARY_EDGE_PRICE',
    EDGE_SUMMARY_EDGE_VAT_PRICE: 'EDGE_SUMMARY_EDGE_VAT_PRICE',
    EDGE_SUMMARY_GLUE_PRICE: 'EDGE_SUMMARY_GLUE_PRICE',
    EDGE_SUMMARY_GLUE_VAT_PRICE: 'EDGE_SUMMARY_GLUE_VAT_PRICE',
    GLUE_SUMMARY: 'GLUE_SUMMARY',
    GLUE_SUMMARY_AREA: 'GLUE_SUMMARY_AREA',
    GLUE_SUMMARY_PRICE: 'GLUE_SUMMARY_PRICE',
    GLUE_SUMMARY_VAT_PRICE: 'GLUE_SUMMARY_VAT_PRICE',
    SAW_SUMMARY: 'SAW_SUMMARY',
    SAW_SUMMARY_THICKNESS: 'SAW_SUMMARY_THICKNESS',
    SAW_SUMMARY_LENGTH: 'SAW_SUMMARY_LENGTH',
    SAW_SUMMARY_PRICE: 'SAW_SUMMARY_PRICE',
    SAW_SUMMARY_VAT_PRICE: 'SAW_SUMMARY_VAT_PRICE',
    TOTAL_SUMMARY: 'TOTAL_SUMMARY',
    TOTAL_SUMMARY_WEIGHT: 'TOTAL_SUMMARY_WEIGHT',
    TOTAL_SUMMARY_PRICE: 'TOTAL_SUMMARY_PRICE',
    TOTAL_SUMMARY_VAT_PRICE: 'TOTAL_SUMMARY_VAT_PRICE',
    PRODUCTS_LIST: 'PRODUCTS_LIST',
    PRODUCTS_LIST_NAME: 'PRODUCTS_LIST_NAME',
    PRODUCTS_LIST_NUMBER: 'PRODUCTS_LIST_NUMBER',
    PRODUCTS_LIST_LENGTH: 'PRODUCTS_LIST_LENGTH',
    PRODUCTS_LIST_WIDTH: 'PRODUCTS_LIST_WIDTH',
    PRODUCTS_LIST_QUANTITY: 'PRODUCTS_LIST_QUANTITY',
    PRODUCTS_LIST_EDGE_A1: 'PRODUCTS_LIST_EDGE_A1',
    PRODUCTS_LIST_EDGE_A2: 'PRODUCTS_LIST_EDGE_A2',
    PRODUCTS_LIST_EDGE_B1: 'PRODUCTS_LIST_EDGE_B1',
    PRODUCTS_LIST_EDGE_B2: 'PRODUCTS_LIST_EDGE_B2',
    PRODUCTS_LIST_CORNER_A1_B1: 'PRODUCTS_LIST_CORNER_A1_B1',
    PRODUCTS_LIST_CORNER_A1_B2: 'PRODUCTS_LIST_CORNER_A1_B2',
    PRODUCTS_LIST_CORNER_A2_B1: 'PRODUCTS_LIST_CORNER_A2_B1',
    PRODUCTS_LIST_CORNER_A2_B2: 'PRODUCTS_LIST_CORNER_A2_B2',
    PRODUCTS_LIST_DESCRIPTION: 'PRODUCTS_LIST_DESCRIPTION',
    PRODUCTS_LIST_BOARDS: 'PRODUCTS_LIST_BOARDS',
    PRODUCTS_LIST_POSITION: 'PRODUCTS_LIST_POSITION',
    LAYOUT_MARK: 'LAYOUT_MARK'
} as const;
export type HtmlText = typeof HtmlText[keyof typeof HtmlText];

/**
 * 
 * @export
 * @interface HtmlTextEntry
 */
export interface HtmlTextEntry {
    /**
     * 
     * @type {HtmlText}
     * @memberof HtmlTextEntry
     */
    key: HtmlText;
    /**
     * 
     * @type {string}
     * @memberof HtmlTextEntry
     */
    value: string;
}



/**
 * 
 * @export
 */
export const IntegerProperty = {
    DIMENSIONS_SCALE: 'DIMENSIONS_SCALE',
    PRICE_SCALE: 'PRICE_SCALE',
    WEIGHT_SCALE: 'WEIGHT_SCALE',
    EDGE_THICKNESS_SCALE: 'EDGE_THICKNESS_SCALE',
    EDGE_WEIGHT_SCALE: 'EDGE_WEIGHT_SCALE',
    IMAGE_MAX_SIZE: 'IMAGE_MAX_SIZE',
    IMAGE_THUMBNAIL_MAX_SIZE: 'IMAGE_THUMBNAIL_MAX_SIZE',
    ORDER_ITEM_BOARD_CONSUMPTION_SCALE: 'ORDER_ITEM_BOARD_CONSUMPTION_SCALE',
    ORDER_ITEM_EDGE_CONSUMPTION_SCALE: 'ORDER_ITEM_EDGE_CONSUMPTION_SCALE',
    ORDER_ITEM_EDGE_LENGTH_SCALE: 'ORDER_ITEM_EDGE_LENGTH_SCALE',
    ORDER_ITEM_GLUE_AREA_SCALE: 'ORDER_ITEM_GLUE_AREA_SCALE',
    ORDER_ITEM_SAW_LENGTH_SCALE: 'ORDER_ITEM_SAW_LENGTH_SCALE',
    ORDER_ITEM_SAW_THICKNESS_SCALE: 'ORDER_ITEM_SAW_THICKNESS_SCALE',
    ORDER_BOARD_COUNT_SCALE: 'ORDER_BOARD_COUNT_SCALE',
    ORDER_BOARD_CONSUMPTION_SCALE: 'ORDER_BOARD_CONSUMPTION_SCALE',
    ORDER_EDGE_CONSUMPTION_SCALE: 'ORDER_EDGE_CONSUMPTION_SCALE',
    ORDER_EDGE_LENGTH_SCALE: 'ORDER_EDGE_LENGTH_SCALE',
    ORDER_GLUE_AREA_SCALE: 'ORDER_GLUE_AREA_SCALE',
    ORDER_SAW_LENGTH_SCALE: 'ORDER_SAW_LENGTH_SCALE',
    ORDER_DELIVERY_MIN_DAYS: 'ORDER_DELIVERY_MIN_DAYS',
    ORDER_DELIVERY_OPTIMAL_DAYS: 'ORDER_DELIVERY_OPTIMAL_DAYS'
} as const;
export type IntegerProperty = typeof IntegerProperty[keyof typeof IntegerProperty];

/**
 * 
 * @export
 * @interface IntegerPropertyEntry
 */
export interface IntegerPropertyEntry {
    /**
     * 
     * @type {IntegerProperty}
     * @memberof IntegerPropertyEntry
     */
    key: IntegerProperty;
    /**
     * 
     * @type {number}
     * @memberof IntegerPropertyEntry
     */
    value: number;
}


/**
 * 
 * @export
 * @interface Order
 */
export interface Order {
    /**
     * 
     * @type {string}
     * @memberof Order
     */
    id?: string;
    /**
     * 
     * @type {OrderUser}
     * @memberof Order
     */
    creator?: OrderUser;
    /**
     * 
     * @type {string}
     * @memberof Order
     */
    created?: string;
    /**
     * 
     * @type {OrderStatus}
     * @memberof Order
     */
    status?: OrderStatus;
    /**
     * 
     * @type {number}
     * @memberof Order
     */
    orderNumber?: number;
    /**
     * 
     * @type {string}
     * @memberof Order
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof Order
     */
    description?: string;
    /**
     * 
     * @type {number}
     * @memberof Order
     */
    weight?: number;
    /**
     * 
     * @type {number}
     * @memberof Order
     */
    total?: number;
    /**
     * 
     * @type {number}
     * @memberof Order
     */
    vatTotal?: number;
    /**
     * 
     * @type {string}
     * @memberof Order
     */
    deliveryDate?: string;
    /**
     * 
     * @type {OrderPackageType}
     * @memberof Order
     */
    packageType?: OrderPackageType;
    /**
     * 
     * @type {OrderContact}
     * @memberof Order
     */
    contact?: OrderContact;
    /**
     * 
     * @type {Array<OrderBoard>}
     * @memberof Order
     */
    boards?: Array<OrderBoard>;
    /**
     * 
     * @type {Array<OrderEdge>}
     * @memberof Order
     */
    edges?: Array<OrderEdge>;
    /**
     * 
     * @type {Array<OrderItem>}
     * @memberof Order
     */
    items?: Array<OrderItem>;
    /**
     * 
     * @type {Array<OrderComment>}
     * @memberof Order
     */
    comments?: Array<OrderComment>;
}


/**
 * 
 * @export
 * @interface OrderBoard
 */
export interface OrderBoard {
    /**
     * 
     * @type {string}
     * @memberof OrderBoard
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof OrderBoard
     */
    material?: string;
    /**
     * 
     * @type {string}
     * @memberof OrderBoard
     */
    code?: string;
    /**
     * 
     * @type {string}
     * @memberof OrderBoard
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof OrderBoard
     */
    boardCode?: string;
    /**
     * 
     * @type {string}
     * @memberof OrderBoard
     */
    structureCode?: string;
    /**
     * 
     * @type {boolean}
     * @memberof OrderBoard
     */
    orientation?: boolean;
    /**
     * 
     * @type {number}
     * @memberof OrderBoard
     */
    weight?: number;
    /**
     * 
     * @type {number}
     * @memberof OrderBoard
     */
    length?: number;
    /**
     * 
     * @type {number}
     * @memberof OrderBoard
     */
    width?: number;
    /**
     * 
     * @type {number}
     * @memberof OrderBoard
     */
    thickness?: number;
    /**
     * 
     * @type {number}
     * @memberof OrderBoard
     */
    price?: number;
}
/**
 * 
 * @export
 * @interface OrderComment
 */
export interface OrderComment {
    /**
     * 
     * @type {string}
     * @memberof OrderComment
     */
    id?: string;
    /**
     * 
     * @type {OrderUser}
     * @memberof OrderComment
     */
    creator?: OrderUser;
    /**
     * 
     * @type {string}
     * @memberof OrderComment
     */
    created?: string;
    /**
     * 
     * @type {string}
     * @memberof OrderComment
     */
    comment?: string;
}
/**
 * 
 * @export
 * @interface OrderCommentData
 */
export interface OrderCommentData {
    /**
     * 
     * @type {string}
     * @memberof OrderCommentData
     */
    comment: string;
}
/**
 * 
 * @export
 * @interface OrderCommentMail
 */
export interface OrderCommentMail {
    /**
     * 
     * @type {string}
     * @memberof OrderCommentMail
     */
    subject: string;
    /**
     * 
     * @type {string}
     * @memberof OrderCommentMail
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof OrderCommentMail
     */
    message: string;
    /**
     * 
     * @type {string}
     * @memberof OrderCommentMail
     */
    link: string;
}
/**
 * 
 * @export
 * @interface OrderContact
 */
export interface OrderContact {
    /**
     * 
     * @type {string}
     * @memberof OrderContact
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof OrderContact
     */
    street: string;
    /**
     * 
     * @type {string}
     * @memberof OrderContact
     */
    zipCode: string;
    /**
     * 
     * @type {string}
     * @memberof OrderContact
     */
    city: string;
    /**
     * 
     * @type {string}
     * @memberof OrderContact
     */
    state: string;
    /**
     * 
     * @type {string}
     * @memberof OrderContact
     */
    phone: string;
    /**
     * 
     * @type {string}
     * @memberof OrderContact
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof OrderContact
     */
    businessId?: string;
    /**
     * 
     * @type {string}
     * @memberof OrderContact
     */
    taxId?: string;
}
/**
 * 
 * @export
 * @interface OrderData
 */
export interface OrderData {
    /**
     * 
     * @type {string}
     * @memberof OrderData
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof OrderData
     */
    description?: string;
}
/**
 * 
 * @export
 * @interface OrderEdge
 */
export interface OrderEdge {
    /**
     * 
     * @type {string}
     * @memberof OrderEdge
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof OrderEdge
     */
    code?: string;
    /**
     * 
     * @type {string}
     * @memberof OrderEdge
     */
    name?: string;
    /**
     * 
     * @type {number}
     * @memberof OrderEdge
     */
    weight?: number;
    /**
     * 
     * @type {number}
     * @memberof OrderEdge
     */
    width?: number;
    /**
     * 
     * @type {number}
     * @memberof OrderEdge
     */
    thickness?: number;
    /**
     * 
     * @type {number}
     * @memberof OrderEdge
     */
    price?: number;
}
/**
 * 
 * @export
 * @interface OrderItem
 */
export interface OrderItem {
    /**
     * 
     * @type {string}
     * @memberof OrderItem
     */
    id?: string;
    /**
     * 
     * @type {number}
     * @memberof OrderItem
     */
    sortNum?: number;
    /**
     * 
     * @type {string}
     * @memberof OrderItem
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof OrderItem
     */
    description?: string;
    /**
     * 
     * @type {number}
     * @memberof OrderItem
     */
    quantity?: number;
    /**
     * 
     * @type {Product}
     * @memberof OrderItem
     */
    product?: Product;
}
/**
 * 
 * @export
 * @interface OrderItemData
 */
export interface OrderItemData {
    /**
     * 
     * @type {string}
     * @memberof OrderItemData
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof OrderItemData
     */
    description?: string;
    /**
     * 
     * @type {number}
     * @memberof OrderItemData
     */
    quantity: number;
    /**
     * 
     * @type {Product}
     * @memberof OrderItemData
     */
    product?: Product;
}

/**
 * 
 * @export
 */
export const OrderPackageType = {
    NO_PACKAGE: 'NO_PACKAGE',
    NO_PACKAGE_WITH_REMAINS: 'NO_PACKAGE_WITH_REMAINS',
    PACKAGE: 'PACKAGE',
    PACKAGE_WITH_REMAINS: 'PACKAGE_WITH_REMAINS'
} as const;
export type OrderPackageType = typeof OrderPackageType[keyof typeof OrderPackageType];

/**
 * 
 * @export
 * @interface OrderPackageTypeEntry
 */
export interface OrderPackageTypeEntry {
    /**
     * 
     * @type {OrderPackageType}
     * @memberof OrderPackageTypeEntry
     */
    key: OrderPackageType;
    /**
     * 
     * @type {string}
     * @memberof OrderPackageTypeEntry
     */
    value: string;
}


/**
 * 
 * @export
 * @interface OrderSendMail
 */
export interface OrderSendMail {
    /**
     * 
     * @type {string}
     * @memberof OrderSendMail
     */
    subject: string;
    /**
     * 
     * @type {string}
     * @memberof OrderSendMail
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof OrderSendMail
     */
    message: string;
    /**
     * 
     * @type {string}
     * @memberof OrderSendMail
     */
    link: string;
    /**
     * 
     * @type {string}
     * @memberof OrderSendMail
     */
    attachment: string;
}

/**
 * 
 * @export
 */
export const OrderStatus = {
    NEW: 'NEW',
    SENT: 'SENT',
    IN_PRODUCTION: 'IN_PRODUCTION',
    READY: 'READY',
    FINISHED: 'FINISHED',
    CANCELLED: 'CANCELLED'
} as const;
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

/**
 * 
 * @export
 * @interface OrderStatusData
 */
export interface OrderStatusData {
    /**
     * 
     * @type {boolean}
     * @memberof OrderStatusData
     */
    notifyUser: boolean;
    /**
     * 
     * @type {OrderStatus}
     * @memberof OrderStatusData
     */
    newStatus: OrderStatus;
}


/**
 * 
 * @export
 * @interface OrderStatusEntry
 */
export interface OrderStatusEntry {
    /**
     * 
     * @type {OrderStatus}
     * @memberof OrderStatusEntry
     */
    key: OrderStatus;
    /**
     * 
     * @type {string}
     * @memberof OrderStatusEntry
     */
    value: string;
}


/**
 * 
 * @export
 * @interface OrderStatusMail
 */
export interface OrderStatusMail {
    /**
     * 
     * @type {string}
     * @memberof OrderStatusMail
     */
    productionSubject: string;
    /**
     * 
     * @type {string}
     * @memberof OrderStatusMail
     */
    productionTitle: string;
    /**
     * 
     * @type {string}
     * @memberof OrderStatusMail
     */
    productionMessage: string;
    /**
     * 
     * @type {string}
     * @memberof OrderStatusMail
     */
    readySubject: string;
    /**
     * 
     * @type {string}
     * @memberof OrderStatusMail
     */
    readyTitle: string;
    /**
     * 
     * @type {string}
     * @memberof OrderStatusMail
     */
    readyMessage: string;
    /**
     * 
     * @type {string}
     * @memberof OrderStatusMail
     */
    finishedSubject: string;
    /**
     * 
     * @type {string}
     * @memberof OrderStatusMail
     */
    finishedTitle: string;
    /**
     * 
     * @type {string}
     * @memberof OrderStatusMail
     */
    finishedMessage: string;
    /**
     * 
     * @type {string}
     * @memberof OrderStatusMail
     */
    cancelledSubject: string;
    /**
     * 
     * @type {string}
     * @memberof OrderStatusMail
     */
    cancelledTitle: string;
    /**
     * 
     * @type {string}
     * @memberof OrderStatusMail
     */
    cancelledMessage: string;
    /**
     * 
     * @type {string}
     * @memberof OrderStatusMail
     */
    link: string;
    /**
     * 
     * @type {string}
     * @memberof OrderStatusMail
     */
    attachment: string;
}
/**
 * 
 * @export
 * @interface OrderUser
 */
export interface OrderUser {
    /**
     * 
     * @type {string}
     * @memberof OrderUser
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof OrderUser
     */
    email?: string;
    /**
     * 
     * @type {string}
     * @memberof OrderUser
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof OrderUser
     */
    firstName?: string;
    /**
     * 
     * @type {string}
     * @memberof OrderUser
     */
    lastName?: string;
}
/**
 * 
 * @export
 * @interface Page
 */
export interface Page {
    /**
     * 
     * @type {Pageable}
     * @memberof Page
     */
    pageable?: Pageable;
    /**
     * 
     * @type {number}
     * @memberof Page
     */
    totalElements?: number;
    /**
     * 
     * @type {number}
     * @memberof Page
     */
    totalPages?: number;
    /**
     * 
     * @type {boolean}
     * @memberof Page
     */
    first?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Page
     */
    last?: boolean;
}
/**
 * 
 * @export
 * @interface PageApplicationFileInfo
 */
export interface PageApplicationFileInfo {
    /**
     * 
     * @type {Pageable}
     * @memberof PageApplicationFileInfo
     */
    pageable?: Pageable;
    /**
     * 
     * @type {number}
     * @memberof PageApplicationFileInfo
     */
    totalElements?: number;
    /**
     * 
     * @type {number}
     * @memberof PageApplicationFileInfo
     */
    totalPages?: number;
    /**
     * 
     * @type {boolean}
     * @memberof PageApplicationFileInfo
     */
    first?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PageApplicationFileInfo
     */
    last?: boolean;
    /**
     * 
     * @type {Array<ApplicationFileInfo>}
     * @memberof PageApplicationFileInfo
     */
    content?: Array<ApplicationFileInfo>;
}
/**
 * 
 * @export
 * @interface PageApplicationImageInfo
 */
export interface PageApplicationImageInfo {
    /**
     * 
     * @type {Pageable}
     * @memberof PageApplicationImageInfo
     */
    pageable?: Pageable;
    /**
     * 
     * @type {number}
     * @memberof PageApplicationImageInfo
     */
    totalElements?: number;
    /**
     * 
     * @type {number}
     * @memberof PageApplicationImageInfo
     */
    totalPages?: number;
    /**
     * 
     * @type {boolean}
     * @memberof PageApplicationImageInfo
     */
    first?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PageApplicationImageInfo
     */
    last?: boolean;
    /**
     * 
     * @type {Array<ApplicationImageInfo>}
     * @memberof PageApplicationImageInfo
     */
    content?: Array<ApplicationImageInfo>;
}
/**
 * 
 * @export
 * @interface PageBoard
 */
export interface PageBoard {
    /**
     * 
     * @type {Pageable}
     * @memberof PageBoard
     */
    pageable?: Pageable;
    /**
     * 
     * @type {number}
     * @memberof PageBoard
     */
    totalElements?: number;
    /**
     * 
     * @type {number}
     * @memberof PageBoard
     */
    totalPages?: number;
    /**
     * 
     * @type {boolean}
     * @memberof PageBoard
     */
    first?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PageBoard
     */
    last?: boolean;
    /**
     * 
     * @type {Array<Board>}
     * @memberof PageBoard
     */
    content?: Array<Board>;
}
/**
 * 
 * @export
 * @interface PageCodeList
 */
export interface PageCodeList {
    /**
     * 
     * @type {Pageable}
     * @memberof PageCodeList
     */
    pageable?: Pageable;
    /**
     * 
     * @type {number}
     * @memberof PageCodeList
     */
    totalElements?: number;
    /**
     * 
     * @type {number}
     * @memberof PageCodeList
     */
    totalPages?: number;
    /**
     * 
     * @type {boolean}
     * @memberof PageCodeList
     */
    first?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PageCodeList
     */
    last?: boolean;
    /**
     * 
     * @type {Array<CodeList>}
     * @memberof PageCodeList
     */
    content?: Array<CodeList>;
}
/**
 * 
 * @export
 * @interface PageCodeListItem
 */
export interface PageCodeListItem {
    /**
     * 
     * @type {Pageable}
     * @memberof PageCodeListItem
     */
    pageable?: Pageable;
    /**
     * 
     * @type {number}
     * @memberof PageCodeListItem
     */
    totalElements?: number;
    /**
     * 
     * @type {number}
     * @memberof PageCodeListItem
     */
    totalPages?: number;
    /**
     * 
     * @type {boolean}
     * @memberof PageCodeListItem
     */
    first?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PageCodeListItem
     */
    last?: boolean;
    /**
     * 
     * @type {Array<CodeListItem>}
     * @memberof PageCodeListItem
     */
    content?: Array<CodeListItem>;
}
/**
 * 
 * @export
 * @interface PageEdge
 */
export interface PageEdge {
    /**
     * 
     * @type {Pageable}
     * @memberof PageEdge
     */
    pageable?: Pageable;
    /**
     * 
     * @type {number}
     * @memberof PageEdge
     */
    totalElements?: number;
    /**
     * 
     * @type {number}
     * @memberof PageEdge
     */
    totalPages?: number;
    /**
     * 
     * @type {boolean}
     * @memberof PageEdge
     */
    first?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PageEdge
     */
    last?: boolean;
    /**
     * 
     * @type {Array<Edge>}
     * @memberof PageEdge
     */
    content?: Array<Edge>;
}
/**
 * 
 * @export
 * @interface PageOrder
 */
export interface PageOrder {
    /**
     * 
     * @type {Pageable}
     * @memberof PageOrder
     */
    pageable?: Pageable;
    /**
     * 
     * @type {number}
     * @memberof PageOrder
     */
    totalElements?: number;
    /**
     * 
     * @type {number}
     * @memberof PageOrder
     */
    totalPages?: number;
    /**
     * 
     * @type {boolean}
     * @memberof PageOrder
     */
    first?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PageOrder
     */
    last?: boolean;
    /**
     * 
     * @type {Array<Order>}
     * @memberof PageOrder
     */
    content?: Array<Order>;
}
/**
 * 
 * @export
 * @interface PageOrderUser
 */
export interface PageOrderUser {
    /**
     * 
     * @type {Pageable}
     * @memberof PageOrderUser
     */
    pageable?: Pageable;
    /**
     * 
     * @type {number}
     * @memberof PageOrderUser
     */
    totalElements?: number;
    /**
     * 
     * @type {number}
     * @memberof PageOrderUser
     */
    totalPages?: number;
    /**
     * 
     * @type {boolean}
     * @memberof PageOrderUser
     */
    first?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PageOrderUser
     */
    last?: boolean;
    /**
     * 
     * @type {Array<OrderUser>}
     * @memberof PageOrderUser
     */
    content?: Array<OrderUser>;
}
/**
 * 
 * @export
 * @interface Pageable
 */
export interface Pageable {
    /**
     * 
     * @type {number}
     * @memberof Pageable
     */
    page?: number;
    /**
     * 
     * @type {number}
     * @memberof Pageable
     */
    size?: number;
    /**
     * 
     * @type {string}
     * @memberof Pageable
     */
    sort?: string;
}
/**
 * 
 * @export
 * @interface PasswordConfirmation
 */
export interface PasswordConfirmation {
    /**
     * 
     * @type {string}
     * @memberof PasswordConfirmation
     */
    password: string;
    /**
     * 
     * @type {string}
     * @memberof PasswordConfirmation
     */
    token: string;
}
/**
 * 
 * @export
 * @interface Product
 */
export interface Product {
    /**
     * 
     * @type {ProductType}
     * @memberof Product
     */
    type: ProductType;
    /**
     * 
     * @type {number}
     * @memberof Product
     */
    length: number;
    /**
     * 
     * @type {number}
     * @memberof Product
     */
    width: number;
    /**
     * 
     * @type {Array<ProductLayer>}
     * @memberof Product
     */
    layers: Array<ProductLayer>;
    /**
     * 
     * @type {Array<ProductEdge>}
     * @memberof Product
     */
    edges: Array<ProductEdge>;
    /**
     * 
     * @type {Array<ProductCorner>}
     * @memberof Product
     */
    corners: Array<ProductCorner>;
}


/**
 * 
 * @export
 * @interface ProductCorner
 */
export interface ProductCorner {
    /**
     * 
     * @type {ProductCornerType}
     * @memberof ProductCorner
     */
    type: ProductCornerType;
    /**
     * 
     * @type {ProductCornerPosition}
     * @memberof ProductCorner
     */
    position: ProductCornerPosition;
    /**
     * 
     * @type {number}
     * @memberof ProductCorner
     */
    length: number;
    /**
     * 
     * @type {number}
     * @memberof ProductCorner
     */
    width: number;
    /**
     * 
     * @type {string}
     * @memberof ProductCorner
     */
    edgeId?: string;
}



/**
 * 
 * @export
 */
export const ProductCornerPosition = {
    A1_B1: 'A1B1',
    A1_B2: 'A1B2',
    A2_B1: 'A2B1',
    A2_B2: 'A2B2'
} as const;
export type ProductCornerPosition = typeof ProductCornerPosition[keyof typeof ProductCornerPosition];

/**
 * 
 * @export
 * @interface ProductCornerPositionEntry
 */
export interface ProductCornerPositionEntry {
    /**
     * 
     * @type {ProductCornerPosition}
     * @memberof ProductCornerPositionEntry
     */
    key: ProductCornerPosition;
    /**
     * 
     * @type {string}
     * @memberof ProductCornerPositionEntry
     */
    value: string;
}



/**
 * 
 * @export
 */
export const ProductCornerType = {
    ROUNDED: 'ROUNDED',
    STRAIGHT: 'STRAIGHT'
} as const;
export type ProductCornerType = typeof ProductCornerType[keyof typeof ProductCornerType];

/**
 * 
 * @export
 * @interface ProductCornerTypeEntry
 */
export interface ProductCornerTypeEntry {
    /**
     * 
     * @type {ProductCornerType}
     * @memberof ProductCornerTypeEntry
     */
    key: ProductCornerType;
    /**
     * 
     * @type {string}
     * @memberof ProductCornerTypeEntry
     */
    value: string;
}



/**
 * 
 * @export
 */
export const ProductDecorOrientation = {
    ALONG_LENGTH: 'ALONG_LENGTH',
    ALONG_WIDTH: 'ALONG_WIDTH'
} as const;
export type ProductDecorOrientation = typeof ProductDecorOrientation[keyof typeof ProductDecorOrientation];

/**
 * 
 * @export
 * @interface ProductDecorOrientationEntry
 */
export interface ProductDecorOrientationEntry {
    /**
     * 
     * @type {ProductDecorOrientation}
     * @memberof ProductDecorOrientationEntry
     */
    key: ProductDecorOrientation;
    /**
     * 
     * @type {string}
     * @memberof ProductDecorOrientationEntry
     */
    value: string;
}



/**
 * 
 * @export
 */
export const ProductDimension = {
    LENGTH: 'LENGTH',
    WIDTH: 'WIDTH',
    THICKNESS: 'THICKNESS'
} as const;
export type ProductDimension = typeof ProductDimension[keyof typeof ProductDimension];

/**
 * 
 * @export
 * @interface ProductDimensionEntry
 */
export interface ProductDimensionEntry {
    /**
     * 
     * @type {ProductDimension}
     * @memberof ProductDimensionEntry
     */
    key: ProductDimension;
    /**
     * 
     * @type {string}
     * @memberof ProductDimensionEntry
     */
    value: string;
}


/**
 * 
 * @export
 * @interface ProductEdge
 */
export interface ProductEdge {
    /**
     * 
     * @type {string}
     * @memberof ProductEdge
     */
    materialId: string;
    /**
     * 
     * @type {ProductPosition}
     * @memberof ProductEdge
     */
    position: ProductPosition;
}


/**
 * 
 * @export
 * @interface ProductEdgePositionEntry
 */
export interface ProductEdgePositionEntry {
    /**
     * 
     * @type {ProductPosition}
     * @memberof ProductEdgePositionEntry
     */
    key: ProductPosition;
    /**
     * 
     * @type {string}
     * @memberof ProductEdgePositionEntry
     */
    value: string;
}


/**
 * 
 * @export
 * @interface ProductImage
 */
export interface ProductImage {
    /**
     * 
     * @type {string}
     * @memberof ProductImage
     */
    image: string;
}
/**
 * 
 * @export
 * @interface ProductItem
 */
export interface ProductItem {
    /**
     * 
     * @type {ProductPosition}
     * @memberof ProductItem
     */
    position: ProductPosition;
    /**
     * 
     * @type {string}
     * @memberof ProductItem
     */
    materialId: string;
    /**
     * 
     * @type {number}
     * @memberof ProductItem
     */
    length: number;
    /**
     * 
     * @type {number}
     * @memberof ProductItem
     */
    width: number;
    /**
     * 
     * @type {ProductDecorOrientation}
     * @memberof ProductItem
     */
    decorOrientation: ProductDecorOrientation;
    /**
     * 
     * @type {boolean}
     * @memberof ProductItem
     */
    strictDecorOrientation: boolean;
    /**
     * 
     * @type {Array<ProductEdge>}
     * @memberof ProductItem
     */
    edges: Array<ProductEdge>;
}


/**
 * 
 * @export
 * @interface ProductLayer
 */
export interface ProductLayer {
    /**
     * 
     * @type {ProductLayerType}
     * @memberof ProductLayer
     */
    type: ProductLayerType;
    /**
     * 
     * @type {number}
     * @memberof ProductLayer
     */
    level: number;
    /**
     * 
     * @type {Array<ProductItem>}
     * @memberof ProductLayer
     */
    items: Array<ProductItem>;
}



/**
 * 
 * @export
 */
export const ProductLayerType = {
    SOLID: 'SOLID',
    FRAME: 'FRAME'
} as const;
export type ProductLayerType = typeof ProductLayerType[keyof typeof ProductLayerType];


/**
 * 
 * @export
 */
export const ProductPosition = {
    A1: 'A1',
    A2: 'A2',
    B1: 'B1',
    B2: 'B2'
} as const;
export type ProductPosition = typeof ProductPosition[keyof typeof ProductPosition];

/**
 * 
 * @export
 * @interface ProductPositionEntry
 */
export interface ProductPositionEntry {
    /**
     * 
     * @type {ProductPosition}
     * @memberof ProductPositionEntry
     */
    key: ProductPosition;
    /**
     * 
     * @type {string}
     * @memberof ProductPositionEntry
     */
    value: string;
}



/**
 * 
 * @export
 */
export const ProductType = {
    BOARD: 'BOARD',
    DOUBLED_BOARD: 'DOUBLED_BOARD',
    FRAME: 'FRAME',
    FRAMED_BOARD: 'FRAMED_BOARD'
} as const;
export type ProductType = typeof ProductType[keyof typeof ProductType];

/**
 * 
 * @export
 * @interface ProductTypeEntry
 */
export interface ProductTypeEntry {
    /**
     * 
     * @type {ProductType}
     * @memberof ProductTypeEntry
     */
    key: ProductType;
    /**
     * 
     * @type {string}
     * @memberof ProductTypeEntry
     */
    value: string;
}


/**
 * 
 * @export
 * @interface Refresh
 */
export interface Refresh {
    /**
     * 
     * @type {string}
     * @memberof Refresh
     */
    refreshToken: string;
}
/**
 * 
 * @export
 * @interface ResetPassword
 */
export interface ResetPassword {
    /**
     * 
     * @type {string}
     * @memberof ResetPassword
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof ResetPassword
     */
    captchaText: string;
    /**
     * 
     * @type {string}
     * @memberof ResetPassword
     */
    captchaToken: string;
}
/**
 * 
 * @export
 * @interface SendOrder
 */
export interface SendOrder {
    /**
     * 
     * @type {OrderContact}
     * @memberof SendOrder
     */
    contact: OrderContact;
    /**
     * 
     * @type {boolean}
     * @memberof SendOrder
     */
    gdprAgreement: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof SendOrder
     */
    businessConditionsAgreement: boolean;
    /**
     * 
     * @type {string}
     * @memberof SendOrder
     */
    deliveryDate?: string;
    /**
     * 
     * @type {OrderPackageType}
     * @memberof SendOrder
     */
    packageType: OrderPackageType;
}


/**
 * 
 * @export
 * @interface SignIn
 */
export interface SignIn {
    /**
     * 
     * @type {string}
     * @memberof SignIn
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof SignIn
     */
    password: string;
}
/**
 * 
 * @export
 * @interface SignUp
 */
export interface SignUp {
    /**
     * 
     * @type {string}
     * @memberof SignUp
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof SignUp
     */
    password: string;
    /**
     * 
     * @type {string}
     * @memberof SignUp
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof SignUp
     */
    firstName: string;
    /**
     * 
     * @type {string}
     * @memberof SignUp
     */
    lastName: string;
    /**
     * 
     * @type {string}
     * @memberof SignUp
     */
    captchaText: string;
    /**
     * 
     * @type {string}
     * @memberof SignUp
     */
    captchaToken: string;
}
/**
 * 
 * @export
 * @interface StringEntry
 */
export interface StringEntry {
    /**
     * 
     * @type {string}
     * @memberof StringEntry
     */
    key: string;
    /**
     * 
     * @type {string}
     * @memberof StringEntry
     */
    value: string;
}

/**
 * 
 * @export
 */
export const StringPropertyGroup = {
    APP: 'APP',
    CSV_PATTERN: 'CSV_PATTERN',
    CSV_TEXT: 'CSV_TEXT',
    HTML_PATTERN: 'HTML_PATTERN',
    HTML_TEXT: 'HTML_TEXT',
    ORDER_PACKAGE_TYPE: 'ORDER_PACKAGE_TYPE',
    ORDER_STATUS: 'ORDER_STATUS',
    PRODUCT_CORNER_POSITION: 'PRODUCT_CORNER_POSITION',
    PRODUCT_CORNER_TYPE: 'PRODUCT_CORNER_TYPE',
    PRODUCT_DIMENSION: 'PRODUCT_DIMENSION',
    PRODUCT_EDGE_POSITION: 'PRODUCT_EDGE_POSITION',
    PRODUCT_DECOR_ORIENTATION: 'PRODUCT_DECOR_ORIENTATION',
    PRODUCT_POSITION: 'PRODUCT_POSITION',
    PRODUCT_TYPE: 'PRODUCT_TYPE',
    UNIT: 'UNIT'
} as const;
export type StringPropertyGroup = typeof StringPropertyGroup[keyof typeof StringPropertyGroup];

/**
 * 
 * @export
 * @interface StringValue
 */
export interface StringValue {
    /**
     * 
     * @type {string}
     * @memberof StringValue
     */
    value: string;
}

/**
 * 
 * @export
 */
export const TextProperty = {
    APPLICATION_INFO: 'APPLICATION_INFO',
    BUSINESS_CONDITIONS: 'BUSINESS_CONDITIONS',
    COMPANY_INFO: 'COMPANY_INFO',
    COOKIES_INFO: 'COOKIES_INFO',
    CSV_REPLACEMENTS: 'CSV_REPLACEMENTS',
    FREE_DAYS: 'FREE_DAYS',
    GDPR_INFO: 'GDPR_INFO',
    ORDER_COMMENT_MAIL: 'ORDER_COMMENT_MAIL',
    ORDER_INFO: 'ORDER_INFO',
    ORDER_SEND_MAIL: 'ORDER_SEND_MAIL',
    ORDER_STATUS_MAIL: 'ORDER_STATUS_MAIL',
    WELCOME_TEXT: 'WELCOME_TEXT',
    WORKING_HOURS: 'WORKING_HOURS'
} as const;
export type TextProperty = typeof TextProperty[keyof typeof TextProperty];


/**
 * 
 * @export
 */
export const Unit = {
    MILLIMETER: 'MILLIMETER',
    METER: 'METER',
    SQUARE_METER: 'SQUARE_METER',
    KILOGRAM: 'KILOGRAM',
    PIECE: 'PIECE',
    CURRENCY: 'CURRENCY'
} as const;
export type Unit = typeof Unit[keyof typeof Unit];

/**
 * 
 * @export
 * @interface UnitEntry
 */
export interface UnitEntry {
    /**
     * 
     * @type {Unit}
     * @memberof UnitEntry
     */
    key: Unit;
    /**
     * 
     * @type {string}
     * @memberof UnitEntry
     */
    value: string;
}


/**
 * 
 * @export
 * @interface User
 */
export interface User {
    /**
     * 
     * @type {string}
     * @memberof User
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    createdAt?: string;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    email?: string;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    firstName?: string;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    lastName?: string;
    /**
     * 
     * @type {boolean}
     * @memberof User
     */
    confirmed?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof User
     */
    enabled?: boolean;
    /**
     * 
     * @type {Array<Authority>}
     * @memberof User
     */
    authorities?: Array<Authority>;
}
/**
 * 
 * @export
 * @interface UserData
 */
export interface UserData {
    /**
     * 
     * @type {string}
     * @memberof UserData
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof UserData
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof UserData
     */
    firstName: string;
    /**
     * 
     * @type {string}
     * @memberof UserData
     */
    lastName: string;
    /**
     * 
     * @type {boolean}
     * @memberof UserData
     */
    confirmed: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof UserData
     */
    enabled: boolean;
}
/**
 * 
 * @export
 * @interface UserEmail
 */
export interface UserEmail {
    /**
     * 
     * @type {string}
     * @memberof UserEmail
     */
    email: string;
}
/**
 * 
 * @export
 * @interface UserPage
 */
export interface UserPage {
    /**
     * 
     * @type {Pageable}
     * @memberof UserPage
     */
    pageable?: Pageable;
    /**
     * 
     * @type {number}
     * @memberof UserPage
     */
    totalElements?: number;
    /**
     * 
     * @type {number}
     * @memberof UserPage
     */
    totalPages?: number;
    /**
     * 
     * @type {boolean}
     * @memberof UserPage
     */
    first?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof UserPage
     */
    last?: boolean;
    /**
     * 
     * @type {Array<User>}
     * @memberof UserPage
     */
    content?: Array<User>;
}
/**
 * 
 * @export
 * @interface UserProfile
 */
export interface UserProfile {
    /**
     * 
     * @type {string}
     * @memberof UserProfile
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof UserProfile
     */
    firstName: string;
    /**
     * 
     * @type {string}
     * @memberof UserProfile
     */
    lastName: string;
}
/**
 * 
 * @export
 * @interface UuidValue
 */
export interface UuidValue {
    /**
     * 
     * @type {string}
     * @memberof UuidValue
     */
    value: string;
}
