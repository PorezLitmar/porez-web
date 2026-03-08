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
import {type FieldErrors, getEnumValue, isBlank} from '..';
import FormInput from '../form/form-input';
import FormBoardEditor from './board/form-board-editor';
import FormCheckBox from '../form/form-check-box';
import FormEdgeEditor from './edge/form-edge-editor';
import FormBoardOrientationEditor from './board/form-board-orientation-editor';
import {
    type FormOrderFrame,
    toFormOrderFrameProduct,
    toFormOrderFrameValues,
    validateFormOrderFrameProduct,
    validateFormOrderFrameValues
} from './form-order-frame';

export type OrderFrameFormHandle = {
    validate: () => Promise<boolean>;
    getProduct: () => Promise<Product>;
}

type OrderFrameFormProps = {
    strictDecorOrientation: boolean,
    setStrictDecorOrientation: (strictDecorOrientation: boolean) => void,
    product: Product,
    setProduct: (product: Product) => void,
    getBoard: (id: string) => Promise<ClientResponse<Board>>,
    getEdge: (id: string) => Promise<ClientResponse<Edge>>
}

const OrderFrameForm = forwardRef<OrderFrameFormHandle, OrderFrameFormProps>((props, ref) => {
    const appState = useContext(AppContext);

    const [values, setValues] = useState<FormOrderFrame>({
        boardId: '',
        length: '',
        width: '',

        frameWidth: '',
        frameDecorOrientationA1: '',
        frameDecorOrientationA2: '',
        frameDecorOrientationB1: '',
        frameDecorOrientationB2: '',

        allEdgesEnabled: false,

        edge: '',
    });
    const [errors, setErrors] = useState<FieldErrors<FormOrderFrame>>({});

    const [board, setBoard] = useState<Board>();
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
                    }

                    for (const edge of item.edges) {
                        if (!isBlank(edge.materialId)) {
                            await props.getEdge(edge.materialId);
                        }
                    }
                }
            }

            for (const edge of props.product.edges) {
                if (!isBlank(edge.materialId)) {
                    await props.getEdge(edge.materialId);
                }
            }

            const values = await toFormOrderFrameValues(props.product);
            props.setProduct(await toFormOrderFrameProduct(values, props.strictDecorOrientation));
            setValues(values);
        })().finally(() => {
            isInitializing.current = false;
            hasInitialized.current = true;
        })
    }, [props.product]);

    const validate = async () => {
        const actualValues = {...values};

        const ve = await validateFormOrderFrameValues(actualValues, appState);

        const product = await toFormOrderFrameProduct(actualValues, props.strictDecorOrientation);
        const pe = await validateFormOrderFrameProduct(product, props.getBoard, props.getEdge);

        setErrors({...pe, ...ve});

        return Object.keys(ve).length === 0 && Object.keys(pe).length === 0;
    }

    const getProduct = async (): Promise<Product> => {
        return toFormOrderFrameProduct({...values}, props.strictDecorOrientation);
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

            <FormCheckBox
                disabled={isBlank(values.length) || isBlank(values.width) || isBlank(values.boardId)}
                name="allEdgesEnabled"
                onChange={event => setValues({...values, allEdgesEnabled: event.target.checked})}
            >
                <span>Povoliť všetky hrany</span>
            </FormCheckBox>

            <FormEdgeEditor
                disabled={isBlank(values.length) || isBlank(values.width) || isBlank(values.boardId)}
                label="Hrana rámu"
                name="edge"
                allEdgesEnabled={values.allEdgesEnabled}
                edges={board?.edges ?? []}
                edgeId={values.edge}
                setEdgeId={value => setValues({...values, edge: value})}
                error={errors.edge}
                getEdge={props.getEdge}
            />

            <FormInput
                name="frameWidth"
                label={`Rozmer rámu [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}
                placeholder="Zadajte rozmer rámu"
                value={values.frameWidth}
                error={errors.frameWidth}
                onChange={event => setValues({...values, frameWidth: event.target.value})}
            />

            <span className="text-xs font-bold">Orientácia dekoru</span>
            <div className="flex flex-row w-full gap-5">
                <FormBoardOrientationEditor
                    label={getEnumValue(ProductPosition.A1, appState?.productPositions ?? [])}
                    decorOrientation={values.frameDecorOrientationA1 as ProductDecorOrientation}
                    setDecorOrientation={(orientation) => setValues({
                        ...values,
                        frameDecorOrientationA1: orientation as ProductDecorOrientation
                    })}
                />

                <FormBoardOrientationEditor
                    label={getEnumValue(ProductPosition.A2, appState?.productPositions ?? [])}
                    decorOrientation={values.frameDecorOrientationA2 as ProductDecorOrientation}
                    setDecorOrientation={(orientation) => setValues({
                        ...values,
                        frameDecorOrientationA2: orientation as ProductDecorOrientation
                    })}
                />

                <FormBoardOrientationEditor
                    label={getEnumValue(ProductPosition.B1, appState?.productPositions ?? [])}
                    decorOrientation={values.frameDecorOrientationB1 as ProductDecorOrientation}
                    setDecorOrientation={(orientation) => setValues({
                        ...values,
                        frameDecorOrientationB1: orientation as ProductDecorOrientation
                    })}
                />

                <FormBoardOrientationEditor
                    label={getEnumValue(ProductPosition.B2, appState?.productPositions ?? [])}
                    decorOrientation={values.frameDecorOrientationB2 as ProductDecorOrientation}
                    setDecorOrientation={(orientation) => setValues({
                        ...values,
                        frameDecorOrientationB2: orientation as ProductDecorOrientation
                    })}
                />
            </div>
        </>
    )
});

OrderFrameForm.displayName = 'OrderFrameForm';

export default OrderFrameForm;
