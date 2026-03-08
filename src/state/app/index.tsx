import type {ReactNode} from 'react';
import {useContext, useEffect, useState} from 'react';

import {AppContext, ErrorContext} from '../';
import * as apiConfig from '../../api/client/config';
import * as apiHealth from '../../api/client/health';
import type {ErrorMessage} from '../../api/model/porez';
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
} from '../../api/model/porez';
import {CsvText, IntegerProperty} from '../../api/model/porez';

const COOKIES_ENABLED = "cookies-enabled";
const HEALTH_TIMEOUT = 30000;

const toErrorMessage = (err: unknown): ErrorMessage => {
    if (err && typeof err === "object") {
        return {
            code: "code" in err && typeof err.code === "string" ? err.code as ErrorMessage["code"] : undefined,
            message: "message" in err && typeof err.message === "string" ? err.message : String(err),
            timestamp: "timestamp" in err && typeof err.timestamp === "string" ? err.timestamp : undefined
        };
    }
    return {message: String(err)};
};

const AppProvider = ({children}: { children: ReactNode }) => {
    const errorState = useContext(ErrorContext);

    const [up, setUp] = useState(false);
    const [cookiesEnabled, setCookiesEnabled] = useState(
        () => (typeof window !== "undefined" && localStorage.getItem(COOKIES_ENABLED) === "true")
    );
    const [maintenance, setMaintenanceValue] = useState(false);

    const [csvSeparator, setCsvSeparator] = useState('');
    const [orderDeliveryMinDays, setOrderDeliveryMinDays] = useState(-1);
    const [orderPackageTypes, setOrderPackageTypes] = useState<OrderPackageTypeEntry[]>([]);
    const [orderStatuses, setOrderStatuses] = useState<OrderStatusEntry[]>([]);
    const [productCornerPositions, setProductCornerPositions] = useState<ProductCornerPositionEntry[]>([]);
    const [productCornerTypes, setProductCornerTypes] = useState<ProductCornerTypeEntry[]>([]);
    const [productDecorOrientations, setProductDecorOrientations] = useState<ProductDecorOrientationEntry[]>([]);
    const [productDimensions, setProductDimensions] = useState<ProductDimensionEntry[]>([]);
    const [productEdgePositions, setProductEdgePositions] = useState<ProductEdgePositionEntry[]>([]);
    const [productPositions, setProductPositions] = useState<ProductPositionEntry[]>([]);
    const [productTypes, setProductTypes] = useState<ProductTypeEntry[]>([]);
    const [units, setUnits] = useState<UnitEntry[]>([]);

    const enableCookies = () => {
        localStorage.setItem(COOKIES_ENABLED, "true");
        setCookiesEnabled(true);
    };

    // Single poller for health + maintenance with proper cleanup
    useEffect(() => {
        let mounted = true;

        const poll = async () => {
            try {
                const [health, maint] = await Promise.all([
                    apiHealth.readyz(),
                    apiConfig.getMaintenance(),
                ]);

                if (!mounted) return;

                const isUp = Boolean(health?.data && health.data.status === "OK");
                setUp(isUp);

                if (maint?.data) {
                    setMaintenanceValue(maint.data.value);
                }

                if (health?.error) errorState?.addError?.(health.error);
                if (maint?.error) errorState?.addError?.(maint.error);
            } catch (err) {
                errorState?.addError?.(toErrorMessage(err));
                if (mounted) setUp(false);
            }
        };

        // initial run
        poll();

        const id = setInterval(() => {
            poll();
        }, HEALTH_TIMEOUT);

        return () => {
            mounted = false;
            clearInterval(id);
        };
    }, [errorState]);

    useEffect(() => {
        if (up) {
            apiConfig.getCsvTexts().then(response => setCsvSeparator(response.data?.find(e => e.key === CsvText.SEPARATOR)?.value ?? ''));

            apiConfig.getIntegerProperties().then(response => setOrderDeliveryMinDays(response.data?.find(e => e.key === IntegerProperty.ORDER_DELIVERY_MIN_DAYS)?.value ?? -1));

            apiConfig.getOrderPackageTypes().then(response => setOrderPackageTypes(response.data ?? []));
            apiConfig.getOrderStatuses().then(response => setOrderStatuses(response.data ?? []));
            apiConfig.getProductCornerPositions().then(response => setProductCornerPositions(response.data ?? []));
            apiConfig.getProductCornerTypes().then(response => setProductCornerTypes(response.data ?? []));
            apiConfig.getProductDecorOrientations().then(response => setProductDecorOrientations(response.data ?? []));
            apiConfig.getProductDimensions().then(response => setProductDimensions(response.data ?? []));
            apiConfig.getProductEdgePositions().then(response => setProductEdgePositions(response.data ?? []));
            apiConfig.getProductPositions().then(response => setProductPositions(response.data ?? []));
            apiConfig.getProductTypes().then(response => setProductTypes(response.data ?? []));
            apiConfig.getUnits().then(response => setUnits(response.data ?? []));
        }
    }, [up]);

    const setMaintenance = async (m: boolean, token?: string) => {
        try {
            const response = await apiConfig.setMaintenance(m, token);
            if (response?.data) setMaintenanceValue(response.data.value);
            if (response?.error) errorState?.addError?.(response.error);
        } catch (err) {
            errorState?.addError?.(toErrorMessage(err));
        }
    };

    return (
        <AppContext.Provider
            value={{
                up,
                cookiesEnabled,
                enableCookies,
                maintenance,
                setMaintenance,
                orderPackageTypes,
                orderStatuses,
                csvSeparator,
                orderDeliveryMinDays,
                productCornerPositions,
                productCornerTypes,
                productDecorOrientations,
                productDimensions,
                productEdgePositions,
                productPositions,
                productTypes,
                units
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
