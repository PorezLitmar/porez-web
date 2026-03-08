import {
    type Board,
    type Edge,
    type Product,
    type ProductCorner,
    ProductCornerPosition,
    ProductDecorOrientation,
    ProductDimension,
    type ProductEdge,
    type ProductItem,
    ProductLayerType,
    ProductPosition,
    ProductType
} from '../../api/model/porez';
import {
    type FieldErrors,
    formatNumber,
    getEnumValue,
    isBlank,
    parseNumber,
    validateIntegerNumber,
    validateRequired
} from '../index.ts';
import type {AppState} from '../../state/app/model';
import type {FormOrderBoard} from './form-order-board.ts';
import type {ClientResponse} from '../../api/client';
import {
    getValidationProps,
    validateMaximalProductDimensions,
    validateMinimalProductDimensions,
    validateProductCorners,
    validateProductEdge
} from './index.ts';

export interface FormOrderFramedBoard extends FormOrderBoard {
    frameBoardId: string;

    frameEdge: string;

    frameWidthA1: string;
    frameWidthA2: string;
    frameWidthB1: string;
    frameWidthB2: string;

    frameDecorOrientationA1: ProductDecorOrientation;
    frameDecorOrientationA2: ProductDecorOrientation;
    frameDecorOrientationB1: ProductDecorOrientation;
    frameDecorOrientationB2: ProductDecorOrientation;
}

export const toFormOrderFramedBoardValues = async (product: Product): Promise<FormOrderFramedBoard> => {
    const item = product.layers
        .find(l => l.level === 0)?.items
        .find(i => i.position === ProductPosition.A1);

    const cornerA1B1 = product.corners.find(c => c.position === ProductCornerPosition.A1_B1);
    const cornerA1B2 = product.corners.find(c => c.position === ProductCornerPosition.A1_B2);
    const cornerA2B1 = product.corners.find(c => c.position === ProductCornerPosition.A2_B1);
    const cornerA2B2 = product.corners.find(c => c.position === ProductCornerPosition.A2_B2);


    let frameBoardId = '';
    let frameEdge = '';

    const frameItemA1 = product.layers
        .find(l => l.level === 1)?.items
        .find(i => i.position === ProductPosition.A1);
    if (frameItemA1) {
        frameBoardId = frameItemA1.materialId ?? '';
        frameEdge = frameItemA1.edges[0]?.materialId ?? '';
    }

    const frameItemA2 = product.layers
        .find(l => l.level === 1)?.items
        .find(i => i.position === ProductPosition.A2);
    if (frameItemA2) {
        if (isBlank(frameBoardId)) {
            frameBoardId = frameItemA2.materialId ?? '';
        }
        if (isBlank(frameEdge)) {
            frameEdge = frameItemA2.edges[0]?.materialId ?? '';
        }
    }

    const frameItemB1 = product.layers
        .find(l => l.level === 1)?.items
        .find(i => i.position === ProductPosition.B1);
    if (frameItemB1) {
        if (isBlank(frameBoardId)) {
            frameBoardId = frameItemB1.materialId ?? '';
        }
        if (isBlank(frameEdge)) {
            frameEdge = frameItemB1.edges[0]?.materialId ?? '';
        }
    }

    const frameItemB2 = product.layers
        .find(l => l.level === 1)?.items
        .find(i => i.position === ProductPosition.B2);
    if (frameItemB2) {
        if (isBlank(frameBoardId)) {
            frameBoardId = frameItemB2.materialId ?? '';
        }
        if (isBlank(frameEdge)) {
            frameEdge = frameItemB2.edges[0]?.materialId ?? '';
        }
    }

    return {
        boardId: item?.materialId ?? '',
        length: formatNumber(product.length),
        width: formatNumber(product.width),

        allEdgesEnabled: false,

        edgeA1: product.edges.find(e => e.position === ProductPosition.A1)?.materialId ?? '',
        edgeA2: product.edges.find(e => e.position === ProductPosition.A2)?.materialId ?? '',
        edgeB1: product.edges.find(e => e.position === ProductPosition.B1)?.materialId ?? '',
        edgeB2: product.edges.find(e => e.position === ProductPosition.B2)?.materialId ?? '',

        cornerA1B1: cornerA1B1 ? {
            type: cornerA1B1.type,
            length: formatNumber(cornerA1B1.length) ?? '',
            width: formatNumber(cornerA1B1.width) ?? ''
        } : undefined,
        cornerA1B2: cornerA1B2 ? {
            type: cornerA1B2.type,
            length: formatNumber(cornerA1B2.length) ?? '',
            width: formatNumber(cornerA1B2.width) ?? ''
        } : undefined,
        cornerA2B1: cornerA2B1 ? {
            type: cornerA2B1.type,
            length: formatNumber(cornerA2B1.length) ?? '',
            width: formatNumber(cornerA2B1.width) ?? ''
        } : undefined,
        cornerA2B2: cornerA2B2 ? {
            type: cornerA2B2.type,
            length: formatNumber(cornerA2B2.length) ?? '',
            width: formatNumber(cornerA2B2.width) ?? ''
        } : undefined,

        edgeA1B1: cornerA1B1 ? cornerA1B1.edgeId ?? '' : '',
        edgeA1B2: cornerA1B2 ? cornerA1B2.edgeId ?? '' : '',
        edgeA2B1: cornerA2B1 ? cornerA2B1.edgeId ?? '' : '',
        edgeA2B2: cornerA2B2 ? cornerA2B2.edgeId ?? '' : '',

        frameBoardId,
        frameEdge,

        frameWidthA1: frameItemA1 ? formatNumber(frameItemA1.width) : '',
        frameWidthA2: frameItemA2 ? formatNumber(frameItemA2.width) : '',
        frameWidthB1: frameItemB1 ? formatNumber(frameItemB1.length) : '',
        frameWidthB2: frameItemB2 ? formatNumber(frameItemB2.length) : '',

        frameDecorOrientationA1: frameItemA1 ? frameItemA1.decorOrientation : ProductDecorOrientation.ALONG_LENGTH,
        frameDecorOrientationA2: frameItemA2 ? frameItemA2.decorOrientation : ProductDecorOrientation.ALONG_LENGTH,
        frameDecorOrientationB1: frameItemB1 ? frameItemB1.decorOrientation : ProductDecorOrientation.ALONG_LENGTH,
        frameDecorOrientationB2: frameItemB2 ? frameItemB2.decorOrientation : ProductDecorOrientation.ALONG_LENGTH
    }
}

export const toFormOrderFramedBoardProduct = async (values: FormOrderFramedBoard, strictDecorOrientation: boolean): Promise<Product> => {
    const corners: ProductCorner[] = [];
    if (values.cornerA1B1) {
        corners.push({
            position: ProductCornerPosition.A1_B1,
            type: values.cornerA1B1.type,
            length: parseNumber(values.cornerA1B1.length) ?? 0,
            width: parseNumber(values.cornerA1B1.width) ?? 0,
            edgeId: values.edgeA1B1
        });
    }
    if (values.cornerA1B2) {
        corners.push({
            position: ProductCornerPosition.A1_B2,
            type: values.cornerA1B2.type,
            length: parseNumber(values.cornerA1B2.length) ?? 0,
            width: parseNumber(values.cornerA1B2.width) ?? 0,
            edgeId: values.edgeA1B2
        });
    }
    if (values.cornerA2B1) {
        corners.push({
            position: ProductCornerPosition.A2_B1,
            type: values.cornerA2B1.type,
            length: parseNumber(values.cornerA2B1.length) ?? 0,
            width: parseNumber(values.cornerA2B1.width) ?? 0,
            edgeId: values.edgeA2B1
        });
    }
    if (values.cornerA2B2) {
        corners.push({
            position: ProductCornerPosition.A2_B2,
            type: values.cornerA2B2.type,
            length: parseNumber(values.cornerA2B2.length) ?? 0,
            width: parseNumber(values.cornerA2B2.width) ?? 0,
            edgeId: values.edgeA2B2
        });
    }

    const edges: ProductEdge[] = [];
    if (!isBlank(values.edgeA1)) {
        edges.push({
            position: ProductPosition.A1,
            materialId: values.edgeA1
        })
    }

    if (!isBlank(values.edgeA2)) {
        edges.push({
            position: ProductPosition.A2,
            materialId: values.edgeA2
        })
    }

    if (!isBlank(values.edgeB1)) {
        edges.push({
            position: ProductPosition.B1,
            materialId: values.edgeB1
        })
    }

    if (!isBlank(values.edgeB2)) {
        edges.push({
            position: ProductPosition.B2,
            materialId: values.edgeB2
        })
    }

    const frameItems: ProductItem[] = [];
    if (!isBlank(values.frameBoardId)) {
        const totalWidth = parseNumber(values.width) ?? 0;
        const frameWidthA1 = parseNumber(values.frameWidthA1) ?? 0;
        const frameWidthA2 = parseNumber(values.frameWidthA2) ?? 0;
        const innerWidth = Math.max(0, totalWidth - frameWidthA1 - frameWidthA2);

        if (!isBlank(values.frameWidthA1)) {
            frameItems.push(
                {
                    position: ProductPosition.A1,
                    materialId: values.frameBoardId,
                    decorOrientation: values.frameDecorOrientationA1,
                    strictDecorOrientation,
                    length: parseNumber(values.length) ?? 0,
                    width: parseNumber(values.frameWidthA1) ?? 0,
                    edges: isBlank(values.frameEdge) ? [] : [{
                        position: ProductPosition.A2,
                        materialId: values.frameEdge
                    }]
                }
            )
        }

        if (!isBlank(values.frameWidthA2)) {
            frameItems.push(
                {
                    position: ProductPosition.A2,
                    materialId: values.frameBoardId,
                    decorOrientation: values.frameDecorOrientationA2,
                    strictDecorOrientation,
                    length: parseNumber(values.length) ?? 0,
                    width: parseNumber(values.frameWidthA2) ?? 0,
                    edges: isBlank(values.frameEdge) ? [] : [{
                        position: ProductPosition.A1,
                        materialId: values.frameEdge
                    }]
                }
            )
        }

        if (!isBlank(values.frameWidthB1)) {
            const frameEdges = isBlank(values.frameEdge) ? [] : [
                ...(isBlank(values.frameWidthA1) ? [] : [{position: ProductPosition.A1, materialId: values.frameEdge}]),
                ...(isBlank(values.frameWidthA2) ? [] : [{position: ProductPosition.A2, materialId: values.frameEdge}]),
                {position: ProductPosition.B2, materialId: values.frameEdge}
            ];

            frameItems.push(
                {
                    position: ProductPosition.B1,
                    materialId: values.frameBoardId,
                    decorOrientation: values.frameDecorOrientationB1,
                    strictDecorOrientation,
                    length: parseNumber(values.frameWidthB1) ?? 0,
                    width: innerWidth,
                    edges: frameEdges
                }
            )
        }

        if (!isBlank(values.frameWidthB2)) {
            const frameEdges = isBlank(values.frameEdge) ? [] : [
                ...(isBlank(values.frameWidthA1) ? [] : [{position: ProductPosition.A1, materialId: values.frameEdge}]),
                ...(isBlank(values.frameWidthA2) ? [] : [{position: ProductPosition.A2, materialId: values.frameEdge}]),
                {position: ProductPosition.B1, materialId: values.frameEdge}
            ];

            frameItems.push(
                {
                    position: ProductPosition.B2,
                    materialId: values.frameBoardId,
                    decorOrientation: values.frameDecorOrientationB2,
                    strictDecorOrientation,
                    length: parseNumber(values.frameWidthB2) ?? 0,
                    width: innerWidth,
                    edges: frameEdges
                }
            )
        }
    }

    return {
        type: ProductType.FRAMED_BOARD,
        length: parseNumber(values.length) ?? 0,
        width: parseNumber(values.width) ?? 0,
        layers: [
            {
                type: ProductLayerType.SOLID,
                level: 0,
                items: [
                    {
                        position: ProductPosition.A1,
                        materialId: values.boardId,
                        decorOrientation: ProductDecorOrientation.ALONG_LENGTH,
                        strictDecorOrientation,
                        length: parseNumber(values.length) ?? 0,
                        width: parseNumber(values.width) ?? 0,
                        edges: []
                    }
                ]
            },
            {
                type: ProductLayerType.FRAME,
                level: 1,
                items: frameItems
            }
        ],
        corners,
        edges,
    };
}

export const validateFormOrderFramedBoardValues = async (values: FormOrderFramedBoard, appState?: AppState): Promise<FieldErrors<FormOrderBoard>> => {
    return {
        ...validateRequired<FormOrderFramedBoard, 'boardId'>('boardId', values.boardId, 'Vyžaduje sa doska'),
        ...validateRequired<FormOrderFramedBoard, 'frameBoardId'>('frameBoardId', values.frameBoardId, 'Vyžaduje sa doska vlysu'),
        ...validateIntegerNumber<FormOrderFramedBoard, 'length'>('length', values.length, {
            message: `Neplatný formát ${getEnumValue(ProductDimension.LENGTH, appState?.productDimensions ?? [])}`,
            allowBlank: false,
            requiredMessage: `Vyžaduje sa ${getEnumValue(ProductDimension.LENGTH, appState?.productDimensions ?? [])}`
        }),
        ...validateIntegerNumber<FormOrderFramedBoard, 'width'>('width', values.width, {
            message: `Neplatný formát ${getEnumValue(ProductDimension.WIDTH, appState?.productDimensions ?? [])}`,
            allowBlank: false,
            requiredMessage: `Vyžaduje sa ${getEnumValue(ProductDimension.WIDTH, appState?.productDimensions ?? [])}`
        })
    };
}

export const validateFormOrderFramedBoardProduct = async (
    product: Product,
    getBoard: (id: string) => Promise<ClientResponse<Board>>,
    getEdge: (id: string) => Promise<ClientResponse<Edge>>
): Promise<FieldErrors<FormOrderFramedBoard>> => {
    const errors: FieldErrors<FormOrderFramedBoard> = {};

    const validationProps = await getValidationProps();

    validateMinimalProductDimensions(product, validationProps, errors)

    const baseLayer = product.layers.find(layer => layer.level === 0);
    const boardId = baseLayer?.items[0]?.materialId ?? '';
    const board = isBlank(boardId) ? undefined : (await getBoard(boardId)).data;

    const frameLayer = product.layers.find(layer => layer.level === 1);
    const frameItems = frameLayer?.items ?? [];
    const frameBoardId = frameItems[0]?.materialId ?? '';
    const frameBoard = isBlank(frameBoardId) ? undefined : (await getBoard(frameBoardId)).data;

    if (board) {
        let lengthAddon = 0;
        let widthAddon = 0;
        if (frameItems.length > 1) {
            lengthAddon = 2 * validationProps.areaGluingAppend;
            widthAddon = 2 * validationProps.areaGluingAppend;
        } else if (frameItems.length === 1) {
            const position = frameItems[0].position;
            if (position === ProductPosition.A1 || position === ProductPosition.A2) {
                lengthAddon = 2 * validationProps.areaGluingAppend;
                widthAddon = validationProps.areaGluingAppend;
            } else {
                lengthAddon = validationProps.areaGluingAppend;
                widthAddon = 2 * validationProps.areaGluingAppend;
            }
        }
        validateMaximalProductDimensions(product, board, lengthAddon, widthAddon, errors);
    }

    const setError = (key: keyof FormOrderFramedBoard, prefix: string, value: number) => {
        errors[key] = `${prefix} hodnota je ${value}`;
    };

    const getKeysForPosition = (position: ProductPosition): {lengthKey: keyof FormOrderFramedBoard; widthKey: keyof FormOrderFramedBoard} => {
        switch (position) {
            case ProductPosition.A1:
                return {lengthKey: 'length', widthKey: 'frameWidthA1'};
            case ProductPosition.A2:
                return {lengthKey: 'length', widthKey: 'frameWidthA2'};
            case ProductPosition.B1:
                return {lengthKey: 'frameWidthB1', widthKey: 'width'};
            case ProductPosition.B2:
                return {lengthKey: 'frameWidthB2', widthKey: 'width'};
        }
    };

    const validateItemMinDimensions = (productItem: ProductItem) => {
        const {lengthKey, widthKey} = getKeysForPosition(productItem.position);
        const canRotate = !productItem.strictDecorOrientation;
        const isStrictRotate = productItem.strictDecorOrientation
            && productItem.decorOrientation === ProductDecorOrientation.ALONG_WIDTH;
        const lengthValue = isStrictRotate ? productItem.width : productItem.length;
        const widthValue = isStrictRotate ? productItem.length : productItem.width;

        const setLengthError = (value: number) => setError(lengthKey, 'Minimálna', value);
        const setWidthError = (value: number) => setError(widthKey, 'Minimálna', value);
        const setEffectiveLengthError = (value: number) => (isStrictRotate ? setWidthError : setLengthError)(value);
        const setEffectiveWidthError = (value: number) => (isStrictRotate ? setLengthError : setWidthError)(value);

        if (!canRotate) {
            if (lengthValue < validationProps.minimalLength) {
                setEffectiveLengthError(validationProps.minimalLength);
            }

            if (widthValue < validationProps.minimalWidth) {
                setEffectiveWidthError(validationProps.minimalWidth);
            }

            return;
        }

        const longSide = Math.max(lengthValue, widthValue);
        const shortSide = Math.min(lengthValue, widthValue);

        if (longSide < validationProps.minimalLength) {
            if (lengthValue >= widthValue) {
                setLengthError(validationProps.minimalLength);
            } else {
                setWidthError(validationProps.minimalLength);
            }
        }

        if (shortSide < validationProps.minimalWidth) {
            if (lengthValue <= widthValue) {
                setLengthError(validationProps.minimalWidth);
            } else {
                setWidthError(validationProps.minimalWidth);
            }
        }
    };

    const validateItemMaxDimensions = (productItem: ProductItem, boardForItem: Board) => {
        const {lengthKey, widthKey} = getKeysForPosition(productItem.position);
        const canRotate = !productItem.strictDecorOrientation;
        const isStrictRotate = productItem.strictDecorOrientation
            && productItem.decorOrientation === ProductDecorOrientation.ALONG_WIDTH;
        const lengthValue = isStrictRotate ? productItem.width : productItem.length;
        const widthValue = isStrictRotate ? productItem.length : productItem.width;
        const boardLength = boardForItem.length ?? 0;
        const boardWidth = boardForItem.width ?? 0;

        const setLengthError = (value: number) => setError(lengthKey, 'Maximálna', value);
        const setWidthError = (value: number) => setError(widthKey, 'Maximálna', value);
        const setEffectiveLengthError = (value: number) => (isStrictRotate ? setWidthError : setLengthError)(value);
        const setEffectiveWidthError = (value: number) => (isStrictRotate ? setLengthError : setWidthError)(value);

        if (!canRotate) {
            if (lengthValue > boardLength) {
                setEffectiveLengthError(boardLength);
            }

            if (widthValue > boardWidth) {
                setEffectiveWidthError(boardWidth);
            }

            return;
        }

        const longSide = Math.max(lengthValue, widthValue);
        const shortSide = Math.min(lengthValue, widthValue);
        const boardLong = Math.max(boardLength, boardWidth);
        const boardShort = Math.min(boardLength, boardWidth);

        if (longSide > boardLong) {
            if (lengthValue >= widthValue) {
                setLengthError(boardLong);
            } else {
                setWidthError(boardLong);
            }
        }

        if (shortSide > boardShort) {
            if (lengthValue <= widthValue) {
                setLengthError(boardShort);
            } else {
                setWidthError(boardShort);
            }
        }
    };

    const validateFrameEdge = async (edgeId: string, frameThickness: number) => {
        if (isBlank(edgeId)) {
            return;
        }

        const edge = isBlank(edgeId) ? undefined : (await getEdge(edgeId)).data;
        const edgeWidth = edge?.width ?? 0;

        if (edgeWidth < frameThickness + validationProps.edgeWidthMinAppend) {
            errors.frameEdge = `Minimálna šírka s nadmierou je ${frameThickness + validationProps.edgeWidthMinAppend}`;
        }

        if (edgeWidth > frameThickness + validationProps.edgeWidthMaxAppend) {
            errors.frameEdge = `Maximálna šírka s nadmierou je ${frameThickness + validationProps.edgeWidthMaxAppend}`;
        }
    };

    for (const productItem of frameItems) {
        validateItemMinDimensions(productItem);
        if (frameBoard) {
            validateItemMaxDimensions(productItem, frameBoard);
        }

        for (const productItemEdge of productItem.edges) {
            await validateFrameEdge(productItemEdge.materialId, frameBoard?.thickness ?? 0);
        }
    }

    const framePositions = new Set(frameItems.map(item => item.position));
    const baseThickness = board?.thickness ?? 0;
    const frameThickness = frameBoard?.thickness ?? 0;

    const edgeThickness = (position: ProductPosition) => {
        switch (position) {
            case ProductPosition.A1:
                return baseThickness + ((framePositions.has(ProductPosition.A1)
                    || framePositions.has(ProductPosition.B1)
                    || framePositions.has(ProductPosition.B2)) ? frameThickness : 0);
            case ProductPosition.A2:
                return baseThickness + ((framePositions.has(ProductPosition.A2)
                    || framePositions.has(ProductPosition.B1)
                    || framePositions.has(ProductPosition.B2)) ? frameThickness : 0);
            case ProductPosition.B1:
                return baseThickness + ((framePositions.has(ProductPosition.B1)
                    || framePositions.has(ProductPosition.A1)
                    || framePositions.has(ProductPosition.A2)) ? frameThickness : 0);
            case ProductPosition.B2:
                return baseThickness + ((framePositions.has(ProductPosition.B2)
                    || framePositions.has(ProductPosition.A1)
                    || framePositions.has(ProductPosition.A2)) ? frameThickness : 0);
        }
    };

    const thicknessA1 = edgeThickness(ProductPosition.A1);
    const thicknessA2 = edgeThickness(ProductPosition.A2);
    const thicknessB1 = edgeThickness(ProductPosition.B1);
    const thicknessB2 = edgeThickness(ProductPosition.B2);

    const hasA1 = framePositions.has(ProductPosition.A1);
    const hasA2 = framePositions.has(ProductPosition.A2);
    const hasB1 = framePositions.has(ProductPosition.B1);
    const hasB2 = framePositions.has(ProductPosition.B2);

    let allowedEdges = new Set<ProductPosition>(framePositions);
    if ((hasA1 && !hasA2 && !hasB1 && !hasB2)
        || (!hasA1 && hasA2 && !hasB1 && !hasB2)
    ) {
        allowedEdges = new Set([ProductPosition.A1, ProductPosition.A2]);
    } else if ((!hasA1 && !hasA2 && hasB1 && !hasB2)
        || (!hasA1 && !hasA2 && !hasB1 && hasB2)
    ) {
        allowedEdges = new Set([ProductPosition.B1, ProductPosition.B2]);
    } else if (hasA1 && hasB1 && !hasA2 && !hasB2) {
        allowedEdges = new Set([ProductPosition.A1, ProductPosition.B1]);
    } else if (hasA1 && hasA2 && hasB1 && !hasB2) {
        allowedEdges = new Set([ProductPosition.A1, ProductPosition.A2, ProductPosition.B1]);
    } else if (hasA1 && hasA2 && hasB1 && hasB2) {
        allowedEdges = new Set([ProductPosition.A1, ProductPosition.A2, ProductPosition.B1, ProductPosition.B2]);
    }

    for (const productEdge of product.edges) {
        const edgeId = productEdge.materialId;
        if (isBlank(edgeId)) {
            continue;
        }

        if (!allowedEdges.has(productEdge.position)) {
            switch (productEdge.position) {
                case ProductPosition.A1:
                    errors.edgeA1 = 'Hrana nie je povolená pre vybraný vlys';
                    break;
                case ProductPosition.A2:
                    errors.edgeA2 = 'Hrana nie je povolená pre vybraný vlys';
                    break;
                case ProductPosition.B1:
                    errors.edgeB1 = 'Hrana nie je povolená pre vybraný vlys';
                    break;
                case ProductPosition.B2:
                    errors.edgeB2 = 'Hrana nie je povolená pre vybraný vlys';
                    break;
            }
            continue;
        }

        switch (productEdge.position) {
            case ProductPosition.A1: {
                await validateProductEdge('edgeA1', edgeId, thicknessA1, validationProps, errors, getEdge);
                break;
            }
            case ProductPosition.A2: {
                await validateProductEdge('edgeA2', edgeId, thicknessA2, validationProps, errors, getEdge);
                break;
            }
            case ProductPosition.B1: {
                await validateProductEdge('edgeB1', edgeId, thicknessB1, validationProps, errors, getEdge);
                break;
            }
            case ProductPosition.B2: {
                await validateProductEdge('edgeB2', edgeId, thicknessB2, validationProps, errors, getEdge);
                break;
            }
        }
    }

    for (const productCorner of product.corners) {
        const edgeId = productCorner.edgeId ?? '';
        if (isBlank(edgeId)) {
            continue;
        }

        switch (productCorner.position) {
            case ProductCornerPosition.A1_B1: {
                await validateProductEdge('edgeA1B1', edgeId, thicknessA1, validationProps, errors, getEdge);
                break;
            }
            case ProductCornerPosition.A1_B2: {
                await validateProductEdge('edgeA1B2', edgeId, thicknessA1, validationProps, errors, getEdge);
                break;
            }
            case ProductCornerPosition.A2_B1: {
                await validateProductEdge('edgeA2B1', edgeId, thicknessA2, validationProps, errors, getEdge);
                break;
            }
            case ProductCornerPosition.A2_B2: {
                await validateProductEdge('edgeA2B2', edgeId, thicknessA2, validationProps, errors, getEdge);
                break;
            }
        }
    }

    await validateProductCorners(product, errors);

    return errors
}
