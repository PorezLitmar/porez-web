import type {
    OrderPackageTypeEntry,
    OrderStatusEntry,
    ProductCornerPositionEntry,
    ProductCornerTypeEntry,
    ProductDecorOrientationEntry,
    ProductDimensionEntry,
    ProductEdgePositionEntry,
    ProductPositionEntry,
    ProductTypeEntry,
    UnitEntry
} from "../../api/model/porez";

export interface AppState {
    up: boolean,
    cookiesEnabled: boolean,
    enableCookies: () => void,
    maintenance: boolean,
    setMaintenance: (maintenance: boolean, token?: string) => Promise<void>,
    csvSeparator: string,
    orderDeliveryMinDays: number,
    orderPackageTypes: OrderPackageTypeEntry[],
    orderStatuses: OrderStatusEntry[],
    productCornerPositions: ProductCornerPositionEntry[],
    productCornerTypes: ProductCornerTypeEntry[],
    productDecorOrientations: ProductDecorOrientationEntry[],
    productDimensions: ProductDimensionEntry[],
    productEdgePositions: ProductEdgePositionEntry[],
    productPositions: ProductPositionEntry[],
    productTypes: ProductTypeEntry[],
    units: UnitEntry[]
}
