import {
    type Board,
    DecimalProperty,
    type Edge,
    type Product,
    type ProductCorner,
    ProductCornerPosition,
    ProductCornerType,
    ProductPosition
} from '../../api/model/porez';
import {type FieldErrors, isBlank} from '..';
import * as apiConfig from '../../api/client/config';
import type {ClientResponse} from '../../api/client';

export interface FormProductCorner {
    type: ProductCornerType;
    length: string;
    width: string;
}

export interface FormOrderCommon {
    allEdgesEnabled: boolean;

    edgeA1: string;
    edgeA2: string;
    edgeB1: string;
    edgeB2: string;

    cornerA1B1?: FormProductCorner;
    cornerA1B2?: FormProductCorner;
    cornerA2B1?: FormProductCorner;
    cornerA2B2?: FormProductCorner;

    edgeA1B1: string;
    edgeA1B2: string;
    edgeA2B1: string;
    edgeA2B2: string;
}

type CornerKey = 'cornerA1B1' | 'cornerA1B2' | 'cornerA2B1' | 'cornerA2B2';
type EdgeKey = 'edgeA1' | 'edgeA2' | 'edgeB1' | 'edgeB2' | 'edgeA1B1' | 'edgeA1B2' | 'edgeA2B1' | 'edgeA2B2';

export const onFormOrderCommonChange = async (originalValues: FormOrderCommon, newValues: FormOrderCommon): Promise<FormOrderCommon> => {
    const values: FormOrderCommon = {...newValues};

    const setEdge = (key: EdgeKey, value: string) => {
        values[key] = value;
    };

    const roundedConnections: Array<[EdgeKey, EdgeKey, EdgeKey]> = [];

    const syncCornerEdges = (
        cornerKey: CornerKey,
        edgeAKey: EdgeKey,
        edgeBKey: EdgeKey,
        cornerEdgeKey: EdgeKey
    ) => {
        const corner = values[cornerKey] as FormProductCorner | undefined;
        const prevCorner = originalValues[cornerKey] as FormProductCorner | undefined;

        if (!corner) {
            setEdge(cornerEdgeKey, '');
            return;
        }

        if (corner.type === ProductCornerType.ROUNDED) {
            roundedConnections.push([edgeAKey, edgeBKey, cornerEdgeKey]);
            return;
        }

        const cornerEdge = values[cornerEdgeKey] as string;
        const prevCornerEdge = originalValues[cornerEdgeKey] as string;

        if (prevCorner && !isBlank(prevCornerEdge) && isBlank(cornerEdge)) {
            return;
        }

        if (!prevCorner) {
            const baseEdge = values[edgeAKey] as string;
            setEdge(cornerEdgeKey, isBlank(baseEdge) ? '' : baseEdge);
        }
    };

    syncCornerEdges('cornerA1B1', 'edgeA1', 'edgeB1', 'edgeA1B1');
    syncCornerEdges('cornerA1B2', 'edgeA1', 'edgeB2', 'edgeA1B2');
    syncCornerEdges('cornerA2B1', 'edgeA2', 'edgeB1', 'edgeA2B1');
    syncCornerEdges('cornerA2B2', 'edgeA2', 'edgeB2', 'edgeA2B2');

    if (roundedConnections.length > 0) {
        const parent = new Map<EdgeKey, EdgeKey>();
        const connectedEdges = new Set<EdgeKey>();

        const findParent = (key: EdgeKey): EdgeKey => {
            const stored = parent.get(key);
            if (!stored || stored === key) {
                parent.set(key, key);
                return key;
            }
            const root = findParent(stored);
            parent.set(key, root);
            return root;
        };

        const union = (a: EdgeKey, b: EdgeKey) => {
            const rootA = findParent(a);
            const rootB = findParent(b);
            if (rootA !== rootB) {
                parent.set(rootB, rootA);
            }
        };

        roundedConnections.forEach(([edgeAKey, edgeBKey, cornerEdgeKey]) => {
            connectedEdges.add(edgeAKey);
            connectedEdges.add(edgeBKey);
            connectedEdges.add(cornerEdgeKey);
            union(edgeAKey, edgeBKey);
            union(edgeAKey, cornerEdgeKey);
        });

        const groups = new Map<EdgeKey, EdgeKey[]>();
        connectedEdges.forEach(edgeKey => {
            const root = findParent(edgeKey);
            const list = groups.get(root) ?? [];
            list.push(edgeKey);
            groups.set(root, list);
        });

        groups.forEach(edgeKeys => {
            const removedEdge = edgeKeys.some(edgeKey => {
                const prevEdge = originalValues[edgeKey] as string;
                const edge = values[edgeKey] as string;
                return !isBlank(prevEdge) && isBlank(edge);
            });

            if (removedEdge) {
                edgeKeys.forEach(edgeKey => setEdge(edgeKey, ''));
                return;
            }

            const firstEdge = edgeKeys
                .map(edgeKey => values[edgeKey] as string)
                .find(value => !isBlank(value)) ?? '';

            edgeKeys.forEach(edgeKey => setEdge(edgeKey, firstEdge));
        });
    }

    const allCorners = [values.cornerA1B1, values.cornerA1B2, values.cornerA2B1, values.cornerA2B2];
    const allRounded = allCorners.every(corner => corner && corner.type === ProductCornerType.ROUNDED);

    if (allRounded) {
        const allEdges = [
            values.edgeA1,
            values.edgeA2,
            values.edgeB1,
            values.edgeB2,
            values.edgeA1B1,
            values.edgeA1B2,
            values.edgeA2B1,
            values.edgeA2B2
        ];
        const firstEdge = allEdges.find(edge => !isBlank(edge)) ?? '';

        setEdge('edgeA1', firstEdge);
        setEdge('edgeA2', firstEdge);
        setEdge('edgeB1', firstEdge);
        setEdge('edgeB2', firstEdge);
        setEdge('edgeA1B1', firstEdge);
        setEdge('edgeA1B2', firstEdge);
        setEdge('edgeA2B1', firstEdge);
        setEdge('edgeA2B2', firstEdge);
    }

    return values;
}

export interface ValidationProps {
    minimalLength: number;
    minimalWidth: number;
    minimalLayerLength: number;
    minimalLayerWidth: number;
    edgeWidthMinAppend: number;
    edgeWidthMaxAppend: number;
    areaGluingAppend: number;
}

export const getValidationProps = async (): Promise<ValidationProps> => {
    const response = await apiConfig.getDecimalProperties();
    const minimalLength = response.data?.find(dp => dp.key === DecimalProperty.PRODUCT_MINIMAL_LENGTH)?.value ?? 250;
    const minimalWidth = response.data?.find(dp => dp.key === DecimalProperty.PRODUCT_MINIMAL_WIDTH)?.value ?? 80;
    const minimalLayerLength = response.data?.find(dp => dp.key === DecimalProperty.PRODUCT_LAYER_MINIMAL_LENGTH)?.value ?? 250;
    const minimalLayerWidth = response.data?.find(dp => dp.key === DecimalProperty.PRODUCT_LAYER_MINIMAL_WIDTH)?.value ?? 80;
    const edgeWidthMinAppend = response.data?.find(dp => dp.key === DecimalProperty.EDGE_WIDTH_MIN_APPEND)?.value ?? 4;
    const edgeWidthMaxAppend = response.data?.find(dp => dp.key === DecimalProperty.EDGE_WIDTH_MAX_APPEND)?.value ?? 8;
    const areaGluingAppend = response.data?.find(dp => dp.key === DecimalProperty.AREA_GLUING_APPEND)?.value ?? 8;

    return {
        minimalLength,
        minimalWidth,
        minimalLayerLength,
        minimalLayerWidth,
        edgeWidthMinAppend,
        edgeWidthMaxAppend,
        areaGluingAppend,
    }
}

interface LengthAndWidth {
    length: string;
    width: string;
}

export const validateMinimalProductDimensions = (product: Product, validationProps: ValidationProps, errors: FieldErrors<LengthAndWidth>) => {
    if (product.length < validationProps.minimalLength) {
        errors.length = `Minimálna hodnota je ${validationProps.minimalLength}`;
    }

    if (product.width < validationProps.minimalWidth) {
        errors.width = `Minimálna hodnota je ${validationProps.minimalWidth}`;
    }
}

export const validateMaximalProductDimensions = (product: Product, board: Board, lengthAddon: number, widthAddon: number, errors: FieldErrors<LengthAndWidth>) => {
    const boardLength = board.length ?? 0;
    const boardWidth = board.width ?? 0;

    if (product.length + lengthAddon > boardLength) {
        errors.length = `Maximálna hodnota je ${boardLength - lengthAddon}`;
    }

    if (product.width + widthAddon > boardWidth) {
        errors.width = `Maximálna hodnota je ${boardWidth - widthAddon}`;
    }
}

export const validateProductEdges = async (
    product: Product,
    productThickness: number[],
    validationProps: ValidationProps,
    errors: FieldErrors<FormOrderCommon>,
    getEdge: (id: string) => Promise<ClientResponse<Edge>>
) => {
    for (const productEdge of product.edges) {
        const edgeId = productEdge.materialId;
        if (isBlank(edgeId)) {
            continue;
        }

        switch (productEdge.position) {
            case ProductPosition.A1:
                await validateProductEdge('edgeA1', edgeId, productThickness[0], validationProps, errors, getEdge);
                break;
            case ProductPosition.A2:
                await validateProductEdge('edgeA2', edgeId, productThickness[1], validationProps, errors, getEdge);
                break;
            case ProductPosition.B1:
                await validateProductEdge('edgeB1', edgeId, productThickness[2], validationProps, errors, getEdge);
                break;
            case ProductPosition.B2:
                await validateProductEdge('edgeB2', edgeId, productThickness[3], validationProps, errors, getEdge);
                break;
        }
    }

    for (const productCorner of product.corners) {
        const edgeId = productCorner.edgeId ?? '';
        if (isBlank(edgeId)) {
            continue;
        }

        switch (productCorner.position) {
            case ProductCornerPosition.A1_B1:
                await validateProductEdge('edgeA1B1', edgeId, productThickness[0], validationProps, errors, getEdge);
                break;
            case ProductCornerPosition.A1_B2:
                await validateProductEdge('edgeA1B2', edgeId, productThickness[0], validationProps, errors, getEdge);
                break;
            case ProductCornerPosition.A2_B1:
                await validateProductEdge('edgeA2B1', edgeId, productThickness[1], validationProps, errors, getEdge);
                break;
            case ProductCornerPosition.A2_B2:
                await validateProductEdge('edgeA2B2', edgeId, productThickness[1], validationProps, errors, getEdge);
                break;
        }
    }
}

export const validateProductEdge = async (
    edgeKey: EdgeKey,
    edgeId: string,
    productThickness: number,
    validationProps: ValidationProps,
    errors: FieldErrors<FormOrderCommon>,
    getEdge: (id: string) => Promise<ClientResponse<Edge>>
) => {
    const edge = isBlank(edgeId) ? undefined : (await getEdge(edgeId)).data;
    const edgeWidth = edge?.width ?? 0;

    if (edgeWidth < productThickness + validationProps.edgeWidthMinAppend) {
        errors[edgeKey] = `Minimálna šírka s nadmierou je ${productThickness + validationProps.edgeWidthMinAppend}`;
    }

    if (edgeWidth > productThickness + validationProps.edgeWidthMaxAppend) {
        errors[edgeKey] = `Maximálna šírka s nadmierou je ${productThickness + validationProps.edgeWidthMaxAppend}`;
    }
}

export const validateProductCorners = async (
    product: Product,
    errors: FieldErrors<FormOrderCommon>
) => {
    const cornerA1B1 = product.corners.find(c => c.position === ProductCornerPosition.A1_B1);
    const cornerA1B2 = product.corners.find(c => c.position === ProductCornerPosition.A1_B2);
    const cornerA2B1 = product.corners.find(c => c.position === ProductCornerPosition.A2_B1);
    const cornerA2B2 = product.corners.find(c => c.position === ProductCornerPosition.A2_B2);

    const cornersLengthA1 = (cornerA1B1?.length ?? 0) + (cornerA1B2?.length ?? 0);
    const cornersLengthA2 = (cornerA2B1?.length ?? 0) + (cornerA2B2?.length ?? 0);

    const cornersWidthB1 = getProductCornerWidth(cornerA1B1) + getProductCornerWidth(cornerA1B2);
    const cornersWidthB2 = getProductCornerWidth(cornerA2B1) + getProductCornerWidth(cornerA2B2);

    if (product.length < cornersLengthA1 || product.length < cornersLengthA2 || product.width < cornersWidthB1 || product.width < cornersWidthB2) {
        errors.cornerA1B1 = `Súčet rozmerov rohov musí byť menší ako rozmery dielca`;
        errors.cornerA1B2 = errors.cornerA1B1;
        errors.cornerA2B1 = errors.cornerA1B1;
        errors.cornerA2B2 = errors.cornerA1B1;
    }
}

const getProductCornerWidth = (corner?: ProductCorner) => {
    if (!corner) {
        return 0;
    }
    return corner.type === ProductCornerType.ROUNDED ? corner.length : corner.width;
}