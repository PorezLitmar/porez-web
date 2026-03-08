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
import {
    type FormOrderDoubledBoard,
    toFormOrderDoubledBoardProduct,
    toFormOrderDoubledBoardValues,
    validateFormOrderDoubledBoardProduct,
    validateFormOrderDoubledBoardValues
} from './form-order-doubled-board';
import OrderCommonForm from './order-commom-form';

export type OrderDoubledBoardFormHandle = {
    validate: () => Promise<boolean>;
    getProduct: () => Promise<Product>;
}

type OrderDoubledBoardFormProps = {
    strictDecorOrientation: boolean,
    setStrictDecorOrientation: (strictDecorOrientation: boolean) => void,
    product: Product,
    setProduct: (product: Product) => void,
    getBoard: (id: string) => Promise<ClientResponse<Board>>,
    getEdge: (id: string) => Promise<ClientResponse<Edge>>
}

const OrderDoubledBoardForm = forwardRef<OrderDoubledBoardFormHandle, OrderDoubledBoardFormProps>((props, ref) => {
    const appState = useContext(AppContext);

    const [values, setValues] = useState<FormOrderDoubledBoard>({
        boardId: '',
        bottomBoardId: '',
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
    });
    const [errors, setErrors] = useState<FieldErrors<FormOrderDoubledBoard>>({});

    const [board, setBoard] = useState<Board>();
    const [bottomBoard, setBottomBoard] = useState<Board>();
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
                        if (layer.level === 1 && item.position === ProductPosition.A1) {
                            setBottomBoard(response.data);
                        }
                    }
                }
            }

            for (const edge of props.product.edges) {
                if (!isBlank(edge.materialId)) {
                    await props.getEdge(edge.materialId);
                }
            }

            const values = await toFormOrderDoubledBoardValues(props.product);
            props.setProduct(await toFormOrderDoubledBoardProduct(values, props.strictDecorOrientation));
            setValues(values);
        })().finally(() => {
            isInitializing.current = false;
            hasInitialized.current = true;
        })
    }, [props.product]);

    const validate = async () => {
        const actualValues = {...values};

        const ve = await validateFormOrderDoubledBoardValues(actualValues, appState);

        const product = await toFormOrderDoubledBoardProduct(actualValues, props.strictDecorOrientation);
        const pe = await validateFormOrderDoubledBoardProduct(product, props.getBoard, props.getEdge);

        setErrors({...pe, ...ve});

        return Object.keys(ve).length === 0 && Object.keys(pe).length === 0;
    }

    const getProduct = async (): Promise<Product> => {
        return toFormOrderDoubledBoardProduct({...values}, props.strictDecorOrientation);
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

            <FormBoardEditor
                label="Spodná doska"
                name="bottomBoardId"
                showDecorOrientation={bottomBoard?.orientation ?? false}
                decorOrientation={ProductDecorOrientation.ALONG_LENGTH}
                boardId={values.bottomBoardId}
                setBoardId={async (bottomBoardId) => {
                    if (!isBlank(bottomBoardId)) {
                        const response = await props.getBoard(bottomBoardId);
                        setBottomBoard(response.data);
                    }
                    setValues({...values, bottomBoardId});
                }}
                error={errors.bottomBoardId}
                getBoard={props.getBoard}
            />

            <OrderCommonForm
                disabled={isBlank(values.length) || isBlank(values.width) || isBlank(values.boardId) || isBlank(values.bottomBoardId)}
                values={values}
                setValues={(commonValues) => setValues({...values, ...commonValues})}
                errors={errors}
                getEdge={props.getEdge}
            />
        </>
    )
});

OrderDoubledBoardForm.displayName = 'OrderDoubledBoardForm';

export default OrderDoubledBoardForm;
