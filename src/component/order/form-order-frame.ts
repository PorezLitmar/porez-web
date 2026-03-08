import {
    type Board,
    type Edge,
    type Product,
    ProductDecorOrientation,
    ProductDimension,
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
} from '..';
import type {AppState} from '../../state/app/model';
import type {ClientResponse} from '../../api/client';
import {getValidationProps, validateProductEdges, type ValidationProps} from '.';

export interface FormOrderFrame {
    boardId: string;
    length: string;
    width: string;

    frameWidth: string;
    frameDecorOrientationA1: string;
    frameDecorOrientationA2: string;
    frameDecorOrientationB1: string;
    frameDecorOrientationB2: string;

    allEdgesEnabled: boolean;

    edge: string;
}

export const toFormOrderFrameValues = async (product: Product): Promise<FormOrderFrame> => {
    const item = product.layers
        .find(l => l.level === 0)?.items
        .find(i => i.position === ProductPosition.A1);

    return {
        boardId: item?.materialId ?? '',
        length: formatNumber(product.length),
        width: formatNumber(product.width),

        frameWidth: formatNumber(item?.width),
        frameDecorOrientationA1: product.layers[0]?.items[0]?.decorOrientation ?? ProductDecorOrientation.ALONG_LENGTH,
        frameDecorOrientationA2: product.layers[0]?.items[1]?.decorOrientation ?? ProductDecorOrientation.ALONG_LENGTH,
        frameDecorOrientationB1: product.layers[0]?.items[2]?.decorOrientation ?? ProductDecorOrientation.ALONG_LENGTH,
        frameDecorOrientationB2: product.layers[0]?.items[3]?.decorOrientation ?? ProductDecorOrientation.ALONG_LENGTH,

        allEdgesEnabled: false,

        edge: product.edges.find(e => e.position === ProductPosition.A1)?.materialId ?? '',
    }
}

export const toFormOrderFrameProduct = async (values: FormOrderFrame, strictDecorOrientation: boolean): Promise<Product> => {
    const length = parseNumber(values.length) ?? 0;
    const width = parseNumber(values.width) ?? 0;
    const frameWidth = parseNumber(values.frameWidth) ?? 0;

    let frameB = 0;
    if (width > 2 * frameWidth) {
        frameB = width - 2 * frameWidth;
    }

    const edge = values.edge;

    return {
        type: ProductType.FRAME,
        length: length,
        width: width,
        layers: [
            {
                type: ProductLayerType.FRAME,
                level: 0,
                items: [
                    {
                        position: ProductPosition.A1,
                        materialId: values.boardId,
                        decorOrientation: values.frameDecorOrientationA1 as ProductDecorOrientation,
                        strictDecorOrientation,
                        length: length,
                        width: frameWidth,
                        edges: isBlank(edge) ? [] : [{position: ProductPosition.A2, materialId: edge}]
                    },
                    {
                        position: ProductPosition.A2,
                        materialId: values.boardId,
                        decorOrientation: values.frameDecorOrientationA2 as ProductDecorOrientation,
                        strictDecorOrientation,
                        length: length,
                        width: frameWidth,
                        edges: isBlank(edge) ? [] : [{position: ProductPosition.A1, materialId: edge}]
                    },
                    {
                        position: ProductPosition.B1,
                        materialId: values.boardId,
                        decorOrientation: values.frameDecorOrientationB1 as ProductDecorOrientation,
                        strictDecorOrientation,
                        length: frameWidth,
                        width: frameB,
                        edges: isBlank(edge) ? [] : [
                            {position: ProductPosition.A1, materialId: edge},
                            {position: ProductPosition.A2, materialId: edge},
                            {position: ProductPosition.B2, materialId: edge}
                        ]
                    },
                    {
                        position: ProductPosition.B2,
                        materialId: values.boardId,
                        decorOrientation: values.frameDecorOrientationB2 as ProductDecorOrientation,
                        strictDecorOrientation,
                        length: frameWidth,
                        width: frameB,
                        edges: isBlank(edge) ? [] : [
                            {position: ProductPosition.A1, materialId: edge},
                            {position: ProductPosition.A2, materialId: edge},
                            {position: ProductPosition.B1, materialId: edge}
                        ]
                    }
                ]
            }
        ],
        corners: [],
        edges: isBlank(edge) ? [] : [
            {position: ProductPosition.A1, materialId: edge},
            {position: ProductPosition.A2, materialId: edge},
            {position: ProductPosition.B1, materialId: edge},
            {position: ProductPosition.B2, materialId: edge}
        ],
    };
}

export const validateFormOrderFrameValues = async (values: FormOrderFrame, appState?: AppState): Promise<FieldErrors<FormOrderFrame>> => {
    return {
        ...validateRequired<FormOrderFrame, 'boardId'>('boardId', values.boardId, 'Vyžaduje sa doska'),
        ...validateIntegerNumber<FormOrderFrame, 'length'>('length', values.length, {
            message: `Neplatný formát ${getEnumValue(ProductDimension.LENGTH, appState?.productDimensions ?? [])}`,
            allowBlank: false,
            requiredMessage: `Vyžaduje sa ${getEnumValue(ProductDimension.LENGTH, appState?.productDimensions ?? [])}`
        }),
        ...validateIntegerNumber<FormOrderFrame, 'width'>('width', values.width, {
            message: `Neplatný formát ${getEnumValue(ProductDimension.WIDTH, appState?.productDimensions ?? [])}`,
            allowBlank: false,
            requiredMessage: `Vyžaduje sa ${getEnumValue(ProductDimension.WIDTH, appState?.productDimensions ?? [])}`
        }),
        ...validateRequired<FormOrderFrame, 'edge'>('edge', values.edge, 'Vyžaduje sa hrana rámu'),
        ...validateIntegerNumber<FormOrderFrame, 'frameWidth'>('frameWidth', values.frameWidth, {
            message: 'Neplatný formát rozmeru rámu',
            allowBlank: false,
            requiredMessage: 'Vyžaduje sa rozmer rámu'
        })
    };
}

export const validateFormOrderFrameProduct = async (
    product: Product,
    getBoard: (id: string) => Promise<ClientResponse<Board>>,
    getEdge: (id: string) => Promise<ClientResponse<Edge>>
): Promise<FieldErrors<FormOrderFrame>> => {
    const errors: FieldErrors<FormOrderFrame> = {};

    const validationProps = await getValidationProps();
    const boardId = product.layers[0]?.items[0]?.materialId ?? '';
    const board = isBlank(boardId) ? undefined : (await getBoard(boardId)).data;
    const boardThickness = board?.thickness ?? 0;

    for (const productItem of product.layers[0]?.items ?? []) {
        validateMinimalProductItemDimensions(productItem, validationProps, errors);
        if (board) {
            validateMaximalProductItemDimensions(productItem, board, errors);
        }
        for (const productItemEdge of productItem.edges) {
            await validateProductItemEdge(productItemEdge.materialId, boardThickness, validationProps, errors, getEdge);
        }
    }

    await validateProductEdges(product, [boardThickness, boardThickness, boardThickness, boardThickness], validationProps, errors, getEdge);

    return errors
}

const validateMinimalProductItemDimensions = (
    productItem: ProductItem,
    validationProps: ValidationProps,
    errors: FieldErrors<FormOrderFrame>
) => {
    const canRotate = !productItem.strictDecorOrientation;
    const isStrictRotate = productItem.strictDecorOrientation
        && productItem.decorOrientation === ProductDecorOrientation.ALONG_WIDTH;
    const minimalLength = validationProps.minimalLength;
    const minimalWidth = validationProps.minimalWidth;

    const setLengthError = (value: number) => {
        if (productItem.position === ProductPosition.A1 || productItem.position === ProductPosition.A2) {
            errors.length = `Minimálna hodnota je ${value}`;
            return;
        }

        errors.frameWidth = `Minimálna hodnota je ${value}`;
    };

    const setWidthError = (value: number) => {
        if (productItem.position === ProductPosition.A1 || productItem.position === ProductPosition.A2) {
            errors.frameWidth = `Minimálna hodnota je ${value}`;
            return;
        }

        errors.width = `Minimálna hodnota je ${value}`;
    };

    const setEffectiveLengthError = (value: number) => {
        if (isStrictRotate) {
            setWidthError(value);
            return;
        }

        setLengthError(value);
    };

    const setEffectiveWidthError = (value: number) => {
        if (isStrictRotate) {
            setLengthError(value);
            return;
        }

        setWidthError(value);
    };

    const lengthValue = isStrictRotate ? productItem.width : productItem.length;
    const widthValue = isStrictRotate ? productItem.length : productItem.width;

    if (productItem.position === ProductPosition.A1 || productItem.position === ProductPosition.A2) {
        if (!canRotate) {
            if (lengthValue < minimalLength) {
                setEffectiveLengthError(minimalLength);
            }

            if (widthValue < minimalWidth) {
                setEffectiveWidthError(minimalWidth);
            }

            return;
        }

        const longSide = Math.max(lengthValue, widthValue);
        const shortSide = Math.min(lengthValue, widthValue);

        if (longSide < minimalLength) {
            if (lengthValue >= widthValue) {
                setLengthError(minimalLength);
            } else {
                setWidthError(minimalLength);
            }
        }

        if (shortSide < minimalWidth) {
            if (lengthValue <= widthValue) {
                setLengthError(minimalWidth);
            } else {
                setWidthError(minimalWidth);
            }
        }

        return;
    }

    if (!canRotate) {
        if (lengthValue < minimalLength) {
            setEffectiveLengthError(minimalLength);
        }

        if (widthValue < minimalWidth) {
            setEffectiveWidthError(minimalWidth);
        }

        return;
    }

    const longSide = Math.max(lengthValue, widthValue);
    const shortSide = Math.min(lengthValue, widthValue);

    if (longSide < minimalLength) {
        if (lengthValue >= widthValue) {
            setLengthError(minimalLength);
        } else {
            setWidthError(minimalLength);
        }
    }

    if (shortSide < minimalWidth) {
        if (lengthValue <= widthValue) {
            setLengthError(minimalWidth);
        } else {
            setWidthError(minimalWidth);
        }
    }
}

const validateMaximalProductItemDimensions = (
    productItem: ProductItem,
    board: Board,
    errors: FieldErrors<FormOrderFrame>
) => {
    const boardLength = board.length ?? 0;
    const boardWidth = board.width ?? 0;
    const canRotate = !productItem.strictDecorOrientation;
    const isStrictRotate = productItem.strictDecorOrientation
        && productItem.decorOrientation === ProductDecorOrientation.ALONG_WIDTH;

    const setLengthError = (value: number) => {
        if (productItem.position === ProductPosition.A1 || productItem.position === ProductPosition.A2) {
            errors.length = `Maximálna hodnota je ${value}`;
            return;
        }

        errors.frameWidth = `Maximálna hodnota je ${value}`;
    };

    const setWidthError = (value: number) => {
        if (productItem.position === ProductPosition.A1 || productItem.position === ProductPosition.A2) {
            errors.frameWidth = `Maximálna hodnota je ${value}`;
            return;
        }

        errors.width = `Maximálna hodnota je ${value}`;
    };

    const setEffectiveLengthError = (value: number) => {
        if (isStrictRotate) {
            setWidthError(value);
            return;
        }

        setLengthError(value);
    };

    const setEffectiveWidthError = (value: number) => {
        if (isStrictRotate) {
            setLengthError(value);
            return;
        }

        setWidthError(value);
    };

    const lengthValue = isStrictRotate ? productItem.width : productItem.length;
    const widthValue = isStrictRotate ? productItem.length : productItem.width;

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
}

const validateProductItemEdge = async (
    edgeId: string,
    boardThickness: number,
    validationProps: ValidationProps,
    errors: FieldErrors<FormOrderFrame>,
    getEdge: (id: string) => Promise<ClientResponse<Edge>>
) => {
    if (isBlank(edgeId)) {
        return;
    }

    const edge = isBlank(edgeId) ? undefined : (await getEdge(edgeId)).data;
    const edgeWidth = edge?.width ?? 0;

    if (edgeWidth < boardThickness + validationProps.edgeWidthMinAppend) {
        errors.edge = `Minimálna šírka s nadmierou je ${boardThickness + validationProps.edgeWidthMinAppend}`;
    }

    if (edgeWidth > boardThickness + validationProps.edgeWidthMaxAppend) {
        errors.edge = `Maximálna šírka s nadmierou je ${boardThickness + validationProps.edgeWidthMaxAppend}`;
    }
}
