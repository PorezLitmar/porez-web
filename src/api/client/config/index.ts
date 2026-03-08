import {CONTEXT_PATH, getData, putData} from '../';
import type {
    AppEntry,
    BooleanValue,
    CsvPatternEntry,
    CsvTextEntry,
    DecimalPropertyEntry,
    HtmlPatternEntry,
    HtmlTextEntry,
    IntegerPropertyEntry,
    OrderCommentMail,
    OrderPackageTypeEntry,
    OrderSendMail,
    OrderStatusEntry,
    OrderStatusMail,
    ProductCornerPositionEntry,
    ProductCornerTypeEntry,
    ProductDecorOrientationEntry,
    ProductDimensionEntry,
    ProductEdgePositionEntry,
    ProductPositionEntry,
    ProductTypeEntry,
    StringEntry,
    UnitEntry
} from '../../model/porez';

const PATH = CONTEXT_PATH + 'config';

export const getApps = () => {
    return getData<AppEntry[]>(PATH + '/app');
}

export const setApp = (data: AppEntry, accessToken?: string) => {
    return putData<AppEntry>(PATH + '/app', data, accessToken);
}

export const getCsvPatterns = () => {
    return getData<CsvPatternEntry[]>(PATH + '/csv-patterns');
}

export const setCsvPattern = (data: CsvPatternEntry, accessToken?: string) => {
    return putData<CsvPatternEntry>(PATH + '/csv-patterns', data, accessToken);
}

export const getCsvReplacements = () => {
    return getData<StringEntry[]>(PATH + '/csv-replacements');
}

export const setCsvReplacements = (data: StringEntry[], accessToken?: string) => {
    return putData<StringEntry[]>(PATH + '/csv-replacements', data, accessToken);
}

export const getCsvTexts = () => {
    return getData<CsvTextEntry[]>(PATH + '/csv-texts');
}

export const setCsvText = (data: CsvTextEntry, accessToken?: string) => {
    return putData<CsvTextEntry>(PATH + '/csv-texts', data, accessToken);
}

export const getDecimalProperties = () => {
    return getData<DecimalPropertyEntry[]>(PATH + '/decimal-properties');
}

export const setDecimalProperty = (data: DecimalPropertyEntry, accessToken?: string) => {
    return putData<DecimalPropertyEntry>(PATH + '/decimal-properties', data, accessToken);
}

export const getHtmlPatterns = () => {
    return getData<HtmlPatternEntry[]>(PATH + '/html-patterns');
}

export const setHtmlPattern = (data: HtmlPatternEntry, accessToken?: string) => {
    return putData<HtmlPatternEntry>(PATH + '/html-patterns', data, accessToken);
}

export const getHtmlTexts = () => {
    return getData<HtmlTextEntry[]>(PATH + '/html-texts');
}

export const setHtmlText = (data: HtmlTextEntry, accessToken?: string) => {
    return putData<HtmlTextEntry>(PATH + '/html-texts', data, accessToken);
}

export const getIntegerProperties = () => {
    return getData<IntegerPropertyEntry[]>(PATH + '/integer-properties');
}

export const setIntegerProperty = (data: IntegerPropertyEntry, accessToken?: string) => {
    return putData<IntegerPropertyEntry>(PATH + '/integer-properties', data, accessToken);
}

export const getMaintenance = () => {
    return getData<BooleanValue>(PATH + '/maintenance');
}

export const setMaintenance = (maintenance: boolean, accessToken?: string) => {
    return putData<BooleanValue>(PATH + '/maintenance', {value: maintenance}, accessToken);
}

export const getOrderCommentMail = () => {
    return getData<OrderCommentMail>(PATH + '/order-comment-mail');
}

export const setOrderCommentMail = (orderCommentMail: OrderCommentMail, accessToken?: string) => {
    return putData<OrderCommentMail>(PATH + '/order-comment-mail', orderCommentMail, accessToken);
}

export const getOrderPackageTypes = () => {
    return getData<OrderPackageTypeEntry[]>(PATH + '/order-package-types');
}

export const setOrderPackageType = (data: OrderPackageTypeEntry, accessToken?: string) => {
    return putData<OrderPackageTypeEntry>(PATH + '/order-package-types', data, accessToken);
}

export const getOrderSendMail = () => {
    return getData<OrderSendMail>(PATH + '/order-send-mail');
}

export const setOrderSendMail = (orderSendMail: OrderSendMail, accessToken?: string) => {
    return putData<OrderSendMail>(PATH + '/order-send-mail', orderSendMail, accessToken);
}

export const getOrderStatusMail = () => {
    return getData<OrderStatusMail>(PATH + '/order-status-mail');
}

export const setOrderStatusMail = (orderStatusMail: OrderStatusMail, accessToken?: string) => {
    return putData<OrderStatusMail>(PATH + '/order-status-mail', orderStatusMail, accessToken);
}

export const getOrderStatuses = () => {
    return getData<OrderStatusEntry[]>(PATH + '/order-statuses');
}

export const setOrderStatus = (data: OrderStatusEntry, accessToken?: string) => {
    return putData<OrderStatusEntry>(PATH + '/order-statuses', data, accessToken);
}

export const getProductCornerPositions = () => {
    return getData<ProductCornerPositionEntry[]>(PATH + '/product-corner-positions');
}

export const setProductCornerPosition = (data: ProductCornerPositionEntry, accessToken?: string) => {
    return putData<ProductCornerPositionEntry>(PATH + '/product-corner-positions', data, accessToken);
}

export const getProductCornerTypes = () => {
    return getData<ProductCornerTypeEntry[]>(PATH + '/product-corner-types');
}

export const setProductCornerType = (data: ProductCornerTypeEntry, accessToken?: string) => {
    return putData<ProductCornerTypeEntry>(PATH + '/product-corner-types', data, accessToken);
}

export const getProductDecorOrientations = () => {
    return getData<ProductDecorOrientationEntry[]>(PATH + '/product-decor-orientations');
}

export const setProductDecorOrientation = (data: ProductDecorOrientationEntry, accessToken?: string) => {
    return putData<ProductDecorOrientationEntry>(PATH + '/product-decor-orientations', data, accessToken);
}

export const getProductDimensions = () => {
    return getData<ProductDimensionEntry[]>(PATH + '/product-dimensions');
}

export const setProductDimension = (data: ProductDimensionEntry, accessToken?: string) => {
    return putData<ProductDimensionEntry>(PATH + '/product-dimensions', data, accessToken);
}

export const getProductEdgePositions = () => {
    return getData<ProductEdgePositionEntry[]>(PATH + '/product-edge-positions');
}

export const setProductEdgePosition = (data: ProductEdgePositionEntry, accessToken?: string) => {
    return putData<ProductEdgePositionEntry>(PATH + '/product-edge-positions', data, accessToken);
}

export const getProductPositions = () => {
    return getData<ProductPositionEntry[]>(PATH + '/product-positions');
}

export const setProductPosition = (data: ProductPositionEntry, accessToken?: string) => {
    return putData<ProductPositionEntry>(PATH + '/product-positions', data, accessToken);
}

export const getProductTypes = () => {
    return getData<ProductTypeEntry[]>(PATH + '/product-types');
}

export const setProductType = (data: ProductTypeEntry, accessToken?: string) => {
    return putData<ProductTypeEntry>(PATH + '/product-types', data, accessToken);
}

export const getUnits = () => {
    return getData<UnitEntry[]>(PATH + '/units');
}

export const setUnit = (data: UnitEntry, accessToken?: string) => {
    return putData<UnitEntry>(PATH + '/units', data, accessToken);
}