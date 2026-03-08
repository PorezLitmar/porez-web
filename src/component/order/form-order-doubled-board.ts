import {
    type Board,
    type Edge,
    type Product,
    type ProductCorner,
    ProductCornerPosition,
    ProductDecorOrientation,
    ProductDimension,
    type ProductEdge,
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
} from '..';
import type {AppState} from '../../state/app/model';
import type {FormOrderBoard} from './form-order-board';
import type {ClientResponse} from '../../api/client';
import {
    getValidationProps,
    validateMaximalProductDimensions,
    validateMinimalProductDimensions, validateProductCorners,
    validateProductEdges
} from './index.ts';

export interface FormOrderDoubledBoard extends FormOrderBoard {
    bottomBoardId: string;
}

export const toFormOrderDoubledBoardValues = async (product: Product): Promise<FormOrderDoubledBoard> => {
    const item = product.layers
        .find(l => l.level === 0)?.items
        .find(i => i.position === ProductPosition.A1);

    const bottomItem = product.layers
        .find(l => l.level === 1)?.items
        .find(i => i.position === ProductPosition.A1);

    const cornerA1B1 = product.corners.find(c => c.position === ProductCornerPosition.A1_B1);
    const cornerA1B2 = product.corners.find(c => c.position === ProductCornerPosition.A1_B2);
    const cornerA2B1 = product.corners.find(c => c.position === ProductCornerPosition.A2_B1);
    const cornerA2B2 = product.corners.find(c => c.position === ProductCornerPosition.A2_B2);

    return {
        boardId: item?.materialId ?? '',
        bottomBoardId: bottomItem?.materialId ?? '',
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
    }
}

export const toFormOrderDoubledBoardProduct = async (values: FormOrderDoubledBoard, strictDecorOrientation: boolean): Promise<Product> => {
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

    return {
        type: ProductType.DOUBLED_BOARD,
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
                type: ProductLayerType.SOLID,
                level: 1,
                items: [
                    {
                        position: ProductPosition.A1,
                        materialId: values.bottomBoardId,
                        decorOrientation: ProductDecorOrientation.ALONG_LENGTH,
                        strictDecorOrientation,
                        length: parseNumber(values.length) ?? 0,
                        width: parseNumber(values.width) ?? 0,
                        edges: []
                    }
                ]
            }
        ],
        corners,
        edges,
    };
}

export const validateFormOrderDoubledBoardValues = async (values: FormOrderDoubledBoard, appState?: AppState): Promise<FieldErrors<FormOrderBoard>> => {
    return {
        ...validateRequired<FormOrderDoubledBoard, 'boardId'>('boardId', values.boardId, 'Vyžaduje sa doska'),
        ...validateRequired<FormOrderDoubledBoard, 'bottomBoardId'>('bottomBoardId', values.bottomBoardId, 'Vyžaduje sa spodná doska'),
        ...validateIntegerNumber<FormOrderDoubledBoard, 'length'>('length', values.length, {
            message: `Neplatný formát ${getEnumValue(ProductDimension.LENGTH, appState?.productDimensions ?? [])}`,
            allowBlank: false,
            requiredMessage: `Vyžaduje sa ${getEnumValue(ProductDimension.LENGTH, appState?.productDimensions ?? [])}`
        }),
        ...validateIntegerNumber<FormOrderDoubledBoard, 'width'>('width', values.width, {
            message: `Neplatný formát ${getEnumValue(ProductDimension.WIDTH, appState?.productDimensions ?? [])}`,
            allowBlank: false,
            requiredMessage: `Vyžaduje sa ${getEnumValue(ProductDimension.WIDTH, appState?.productDimensions ?? [])}`
        })
    };
}

export const validateFormOrderDoubledBoardProduct = async (
    product: Product,
    getBoard: (id: string) => Promise<ClientResponse<Board>>,
    getEdge: (id: string) => Promise<ClientResponse<Edge>>
): Promise<FieldErrors<FormOrderBoard>> => {
    const errors: FieldErrors<FormOrderBoard> = {};

    const validationProps = await getValidationProps();

    validateMinimalProductDimensions(product, validationProps, errors)

    const boardId = product.layers[0]?.items[0]?.materialId ?? '';
    const bottomBoardId = product.layers[1]?.items[0]?.materialId ?? '';
    const board = isBlank(boardId) ? undefined : (await getBoard(boardId)).data;
    const bottomBoard = isBlank(bottomBoardId) ? undefined : (await getBoard(bottomBoardId)).data;
    if (board && bottomBoard) {
        validateMaximalProductDimensions(product, board, 2 * validationProps.areaGluingAppend, 2 * validationProps.areaGluingAppend, errors);
        validateMaximalProductDimensions(product, bottomBoard, 2 * validationProps.areaGluingAppend, 2 * validationProps.areaGluingAppend, errors);
    }

    const boardThickness = (board?.thickness ?? 0) + (bottomBoard?.thickness ?? 0);
    await validateProductEdges(product, [boardThickness, boardThickness, boardThickness, boardThickness], validationProps, errors, getEdge);

    await validateProductCorners(product, errors);

    return errors
}