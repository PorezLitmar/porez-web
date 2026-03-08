import {
    type Board,
    type Edge,
    type Product,
    ProductDecorOrientation,
    ProductDimension,
    ProductPosition,
    Unit
} from '../../api/model/porez';
import {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react';
import type {ClientResponse} from '../../api/client';
import {AppContext} from '../../state';
import {
    type FormOrderFramedBoard,
    toFormOrderFramedBoardProduct,
    toFormOrderFramedBoardValues,
    validateFormOrderFramedBoardProduct,
    validateFormOrderFramedBoardValues
} from './form-order-framed-board';
import {type FieldErrors, getEnumValue, isBlank} from '..';
import FormInput from '../form/form-input';
import FormBoardEditor from './board/form-board-editor';
import OrderCommonForm from './order-commom-form';
import FormEdgeEditor from './edge/form-edge-editor.tsx';

export type OrderFramedBoardFormHandle = {
    validate: () => Promise<boolean>;
    getProduct: () => Promise<Product>;
}

type OrderFramedBoardFormProps = {
    strictDecorOrientation: boolean,
    setStrictDecorOrientation: (strictDecorOrientation: boolean) => void,
    product: Product,
    setProduct: (product: Product) => void,
    getBoard: (id: string) => Promise<ClientResponse<Board>>,
    getEdge: (id: string) => Promise<ClientResponse<Edge>>
}

const OrderFramedBoardForm = forwardRef<OrderFramedBoardFormHandle, OrderFramedBoardFormProps>((props, ref) => {
    const appState = useContext(AppContext);

    const [values, setValues] = useState<FormOrderFramedBoard>({
        boardId: '',
        length: '',
        width: '',

        allEdgesEnabled: false,

        edgeA1: '',
        edgeA2: '',
        edgeB1: '',
        edgeB2: '',

        edgeA1B1: '',
        edgeA1B2: '',
        edgeA2B1: '',
        edgeA2B2: '',

        frameBoardId: '',
        frameEdge: '',

        frameWidthA1: '',
        frameWidthA2: '',
        frameWidthB1: '',
        frameWidthB2: '',

        frameDecorOrientationA1: ProductDecorOrientation.ALONG_LENGTH,
        frameDecorOrientationA2: ProductDecorOrientation.ALONG_LENGTH,
        frameDecorOrientationB1: ProductDecorOrientation.ALONG_LENGTH,
        frameDecorOrientationB2: ProductDecorOrientation.ALONG_LENGTH
    });
    const [errors, setErrors] = useState<FieldErrors<FormOrderFramedBoard>>({});

    const [board, setBoard] = useState<Board>();
    const [frameBoard, setFrameBoard] = useState<Board>();
    const hasInitialized = useRef(false);
    const isInitializing = useRef(false);

    useEffect(() => {
        if (isInitializing.current || hasInitialized.current) {
            return;
        }
        isInitializing.current = true;

        (async () => {
            for (const layer of props.product.layers) {
                for (const item of layer.items) {
                    if (!isBlank(item.materialId)) {
                        const response = await props.getBoard(item.materialId);
                        if (layer.level === 0 && item.position === ProductPosition.A1) {
                            setBoard(response.data);
                        }

                        if (layer.level === 1) {
                            setFrameBoard(response.data);

                            for (const edge of item.edges) {
                                if (!isBlank(edge.materialId)) {
                                    await props.getEdge(edge.materialId);
                                }
                            }
                        }
                    }
                }
            }

            for (const edge of props.product.edges) {
                if (!isBlank(edge.materialId)) {
                    await props.getEdge(edge.materialId);
                }
            }

            const values = await toFormOrderFramedBoardValues(props.product);
            props.setProduct(await toFormOrderFramedBoardProduct(values, props.strictDecorOrientation));
            setValues(values);
        })().finally(() => {
            isInitializing.current = false;
            hasInitialized.current = true;
        })
    }, [props.product]);

    const validate = async () => {
        const actualValues = {...values};

        const ve = await validateFormOrderFramedBoardValues(actualValues, appState);

        const product = await toFormOrderFramedBoardProduct(actualValues, props.strictDecorOrientation);
        const pe = await validateFormOrderFramedBoardProduct(product, props.getBoard, props.getEdge);

        setErrors({...pe, ...ve});

        return Object.keys(ve).length === 0 && Object.keys(pe).length === 0;
    }

    const getProduct = async () => {
        return toFormOrderFramedBoardProduct({...values}, props.strictDecorOrientation);
    }

    useImperativeHandle(ref, () => ({validate, getProduct}));

    useEffect(() => {
        if (isInitializing.current) {
            return;
        }

        let cancelled = false;

        const handle = window.setTimeout(() => {
            (async () => {
                const product = await getProduct();
                if (cancelled) {
                    return;
                }
                props.setProduct(product);
            })();
        }, 300);

        return () => {
            cancelled = true;
            window.clearTimeout(handle);
        };
    }, [values]);

    return (
        <>
            <div className="flex flex-row w-full gap-5">
                <FormInput
                    name="length"
                    label={`${getEnumValue(ProductDimension.LENGTH, appState?.productDimensions ?? [])} [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}
                    placeholder={`Zadajte ${getEnumValue(ProductDimension.LENGTH, appState?.productDimensions ?? [])}`}
                    value={values.length}
                    error={errors.length}
                    onChange={event => setValues({...values, length: event.target.value})}
                />

                <FormInput
                    name="width"
                    label={`${getEnumValue(ProductDimension.WIDTH, appState?.productDimensions ?? [])} [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}
                    placeholder={`Zadajte ${getEnumValue(ProductDimension.WIDTH, appState?.productDimensions ?? [])}`}
                    value={values.width}
                    error={errors.width}
                    onChange={event => setValues({...values, width: event.target.value})}
                />
            </div>

            <FormBoardEditor
                label="Doska"
                name="boardId"
                showDecorOrientation={board?.orientation ?? false}
                decorOrientation={ProductDecorOrientation.ALONG_LENGTH}
                boardId={values.boardId}
                setBoardId={async (boardId) => {
                    if (!isBlank(boardId)) {
                        const response = await props.getBoard(boardId);
                        setBoard(response.data);
                    }
                    setValues({...values, boardId});
                }}
                error={errors.boardId}
                getBoard={props.getBoard}
            />

            <OrderCommonForm
                disabled={isBlank(values.length) || isBlank(values.width) || isBlank(values.boardId) || isBlank(values.frameBoardId)}
                values={values}
                setValues={(commonValues) => setValues({...values, ...commonValues})}
                errors={errors}
                getEdge={props.getEdge}
            />

            <span className="text-xs font-bold">Vlys</span>

            <FormBoardEditor
                label="Doska vlysu"
                name="frameBoardId"
                showDecorOrientation={frameBoard?.orientation ?? false}
                decorOrientation={ProductDecorOrientation.ALONG_LENGTH}
                boardId={values.frameBoardId}
                setBoardId={async (frameBoardId) => {
                    if (!isBlank(frameBoardId)) {
                        const response = await props.getBoard(frameBoardId);
                        setFrameBoard(response.data);
                    }
                    setValues({...values, frameBoardId});
                }}
                error={errors.frameBoardId}
                getBoard={props.getBoard}
            />

            <FormEdgeEditor
                label="Hrana vlysu"
                name="frameEdge"
                allEdgesEnabled={values.allEdgesEnabled}
                edges={frameBoard?.edges ?? []}
                edgeId={values.frameEdge}
                setEdgeId={value => setValues({...values, frameEdge: value})}
                error={errors.frameEdge}
                getEdge={props.getEdge}
            />

            <div className="flex flex-row w-full gap-5">
                <FormInput
                    name="frameWidthA1"
                    label={`Rozmer vlysu - ${getEnumValue(ProductPosition.A1, appState?.productPositions ?? [])} [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}
                    placeholder={`Zadajte rozmer vlysu ${getEnumValue(ProductPosition.A1, appState?.productPositions ?? [])}`}
                    value={values.frameWidthA1}
                    error={errors.frameWidthA1}
                    onChange={event => setValues({...values, frameWidthA1: event.target.value})}
                />

                <FormInput
                    name="frameWidthA2"
                    label={`Rozmer vlysu - ${getEnumValue(ProductPosition.A2, appState?.productPositions ?? [])} [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}
                    placeholder={`Zadajte rozmer vlysu ${getEnumValue(ProductPosition.A2, appState?.productPositions ?? [])}`}
                    value={values.frameWidthA2}
                    error={errors.frameWidthA2}
                    onChange={event => setValues({...values, frameWidthA2: event.target.value})}
                />
            </div>

            <div className="flex flex-row w-full gap-5">
                <FormInput
                    name="frameWidthB1"
                    label={`Rozmer vlysu - ${getEnumValue(ProductPosition.B1, appState?.productPositions ?? [])} [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}
                    placeholder={`Zadajte rozmer vlysu ${getEnumValue(ProductPosition.B1, appState?.productPositions ?? [])}`}
                    value={values.frameWidthB1}
                    error={errors.frameWidthB1}
                    onChange={event => setValues({...values, frameWidthB1: event.target.value})}
                />

                <FormInput
                    name="frameWidthB2"
                    label={`Rozmer vlysu - ${getEnumValue(ProductPosition.B2, appState?.productPositions ?? [])} [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}
                    placeholder={`Zadajte rozmer vlysu ${getEnumValue(ProductPosition.B2, appState?.productPositions ?? [])}`}
                    value={values.frameWidthB2}
                    error={errors.frameWidthB2}
                    onChange={event => setValues({...values, frameWidthB2: event.target.value})}
                />
            </div>
        </>
    )
});

OrderFramedBoardForm.displayName = 'OrderFramedBoardForm';

export default OrderFramedBoardForm;
