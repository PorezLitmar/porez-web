import {type SubmitEvent, useContext, useEffect, useRef, useState} from 'react';
import {
    type Board,
    type Edge,
    type OrderItemData,
    type Product,
    type ProductImage,
    ProductType,
    Unit
} from '../../api/model/porez';
import {AppContext, AuthContext, ErrorContext} from '../../state';
import * as orderApi from '../../api/client/order'
import OrderBoardForm, {type OrderBoardFormHandle} from './order-board-form';
import OrderDoubledBoardForm, {type OrderDoubledBoardFormHandle} from './order-doubled-board-form';
import OrderFramedBoardForm, {type OrderFramedBoardFormHandle} from './order-framed-board-form';
import OrderFrameForm, {type OrderFrameFormHandle} from './order-frame-form';
import * as apiBoard from '../../api/client/board';
import * as apiEdge from '../../api/client/edge';
import {
    type FieldErrors,
    formatNumber,
    getEnumValue,
    isBlank,
    parseNumber,
    validateIntegerNumber,
    validateRequired
} from '..';
import FormSelect from '../form/form-select';
import FormInput from '../form/form-input';
import FormTextArea from '../form/form-text-area';
import OrderImage from './order-image';

type FormValues = {
    name: string,
    description: string,
    quantity: string,
}

const OrderItemEditor = (
    {
        orderId,
        itemId,
        copy,
        setInitInProgress,
        setSubmitInProgress,
        afterSubmitNavigationHandler
    }: {
        orderId: string,
        itemId?: string,
        copy: boolean,
        setInitInProgress: (value: boolean) => void,
        setSubmitInProgress: (value: boolean) => void,
        afterSubmitNavigationHandler: () => void
    }
) => {
    const appState = useContext(AppContext);
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [productType, setProductType] = useState<ProductType>(ProductType.BOARD);
    const [product, setProduct] = useState<Product>();
    const [boards, setBoards] = useState<Board[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const getBoard = async (id: string) => {
        const board = boards.find(board => board.id === id);
        if (board) {
            return {data: board, error: undefined};
        }
        const response = await apiBoard.getBoard(id, authState?.accessToken);
        if (response.data) {
            setBoards([response.data, ...boards]);
        }
        errorState?.addError(response.error);
        return response;
    }

    const getEdge = async (id: string) => {
        const edge = edges.find(edge => edge.id === id);
        if (edge) {
            return {data: edge, error: undefined};
        }
        const response = await apiEdge.getEdge(id, authState?.accessToken);
        if (response.data) {
            setEdges([response.data, ...edges]);
        }
        errorState?.addError(response.error);
        return response;
    }

    const [productImage, setProductImage] = useState<ProductImage>();
    const [generateImageInProgress, setGenerateImageInProgress] = useState(true);

    const [values, setValues] = useState<FormValues>({
        name: '',
        description: '',
        quantity: '',
    });
    const [errors, setErrors] = useState<FieldErrors<FormValues>>({});
    const [strictDecorOrientation, setStrictDecorOrientation] = useState(true);
    const [busy, setBusy] = useState(false);

    const boardFormRef = useRef<OrderBoardFormHandle>(null);
    const doubledBoardFormRef = useRef<OrderDoubledBoardFormHandle>(null);
    const framedBoardFormRef = useRef<OrderFramedBoardFormHandle>(null);
    const frameFormRef = useRef<OrderFrameFormHandle>(null);

    useEffect(() => {
        (async () => {
            setInitInProgress(true);
            try {
                if (itemId) {
                    const response = await orderApi.getOrder(orderId, authState?.accessToken);
                    errorState?.addError(response.error);
                    if (response.data) {
                        const item = response.data.items?.find(item => item.id === itemId);
                        if (item) {
                            setValues({
                                name: (item.name + (copy ? ' - kópia' : '')),
                                description: item.description ?? '',
                                quantity: formatNumber(item.quantity) ?? 0,
                            });
                            if (item.product) {
                                setProductType(item.product.type);
                                setProduct(item.product);
                            }
                        }
                    }
                } else {
                    setProductType(ProductType.BOARD);
                    setProduct({
                        type: ProductType.BOARD,
                        length: 0,
                        width: 0,
                        layers: [],
                        edges: [],
                        corners: []
                    });
                }
            } finally {
                setInitInProgress(false);
            }
        })();
    }, [orderId, itemId, copy]);

    useEffect(() => {
        setProductImage(undefined);
        (async () => {
            setGenerateImageInProgress(true);
            try {
                if (product) {
                    const response = await orderApi.generateImage(product, authState?.accessToken);
                    setProductImage(response.data);
                }
            } finally {
                setGenerateImageInProgress(false);
            }
        })();
    }, [product]);

    const validate = (v: FormValues): FieldErrors<FormValues> => {
        const e = {
            ...validateRequired<FormValues, 'name'>('name', v.name, 'Vyžaduje sa názov'),
            ...validateIntegerNumber<FormValues, 'quantity'>('quantity', v.quantity, {
                message: 'Neplatný formát množstva',
                allowBlank: false,
                requiredMessage: 'Vyžaduje sa množstvo'
            })
        };

        if (isBlank(e.quantity) && (parseNumber(v.quantity) ?? 0) <= 0) {
            e.quantity = "Vyžaduje sa číslo > 0";
        }

        return e;
    }

    const validateProduct = async () => {
        switch (productType) {
            case ProductType.BOARD:
                return (await boardFormRef.current?.validate()) ?? true;
            case ProductType.DOUBLED_BOARD:
                return (await doubledBoardFormRef.current?.validate()) ?? true;
            case ProductType.FRAMED_BOARD:
                return (await framedBoardFormRef.current?.validate()) ?? true;
            case ProductType.FRAME:
                return (await frameFormRef.current?.validate()) ?? true;
            default:
                return true;
        }
    };

    const getProduct = async () => {
        switch (productType) {
            case ProductType.BOARD:
                return (await boardFormRef.current?.getProduct()) ?? {} as Product;
            case ProductType.DOUBLED_BOARD:
                return (await doubledBoardFormRef.current?.getProduct()) ?? {} as Product;
            case ProductType.FRAMED_BOARD:
                return (await framedBoardFormRef.current?.getProduct()) ?? {} as Product;
            case ProductType.FRAME:
                return (await frameFormRef.current?.getProduct()) ?? {} as Product;
            default:
                return {} as Product;
        }
    };

    const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        setBusy(true);
        setSubmitInProgress(true);
        try {
            e.preventDefault();

            const validationErrors = validate(values);
            setErrors(validationErrors);

            const productValid = await validateProduct();

            if (Object.keys(validationErrors).length !== 0 || !productValid) return;

            const data: OrderItemData = {
                name: values.name,
                description: values.description,
                quantity: parseNumber(values.quantity) ?? 0,
                product: await getProduct()
            }

            let response;
            if (itemId && !copy) {
                response = await orderApi.setItem(orderId, itemId, data, authState?.accessToken);
            } else {
                response = await orderApi.addItem(orderId, data, authState?.accessToken);
            }
            errorState?.addError(response.error);
            if (!response.error) {
                afterSubmitNavigationHandler();
            }
        } finally {
            setSubmitInProgress(false);
            setBusy(false);
        }
    }

    return (
        <div className="flex flex-row w-full gap-5 flex-1 min-h-0">
            <div className="flex flex-col flex-2 min-h-0">
                <form
                    className="flex flex-col justify-center items-center w-full"
                    onSubmit={onSubmit}
                    noValidate
                >
                    <div className="flex flex-row gap-5 w-full">
                        <div className="w-3/4">
                            <FormSelect
                                name="type"
                                label="Typ dielca"
                                value={productType}
                                onChange={event => setProductType(event.currentTarget.value as ProductType)}
                            >
                                <option value={ProductType.BOARD}>
                                    {getEnumValue(ProductType.BOARD, appState?.productTypes ?? [])}
                                </option>
                                <option value={ProductType.DOUBLED_BOARD}>
                                    {getEnumValue(ProductType.DOUBLED_BOARD, appState?.productTypes ?? [])}
                                </option>
                                <option value={ProductType.FRAMED_BOARD}>
                                    {getEnumValue(ProductType.FRAMED_BOARD, appState?.productTypes ?? [])}
                                </option>
                                <option value={ProductType.FRAME}>
                                    {getEnumValue(ProductType.FRAME, appState?.productTypes ?? [])}
                                </option>
                            </FormSelect>
                        </div>

                        <div className="w-1/4">
                            <FormSelect
                                name="strictDecorOrientation"
                                label="Orientácia"
                                value={strictDecorOrientation ? '1' : '0'}
                                onChange={value => setStrictDecorOrientation(parseInt(value.currentTarget.value) === 1)}
                            >
                                <option value="0">otáčať</option>
                                <option value="1">neotáčať</option>
                            </FormSelect>
                        </div>
                    </div>

                    <div className="flex flex-row gap-5 w-full">
                        <div className="w-3/4">
                            <FormInput
                                name="name"
                                label="Názov"
                                placeholder="Zadajte názov"
                                value={values.name}
                                error={errors.name}
                                onChange={event => setValues({...values, name: event.currentTarget.value})}
                            />
                        </div>

                        <div className="w-1/4">
                            <FormInput
                                name="quantity"
                                label={`Množstvo [${getEnumValue(Unit.PIECE, appState?.units ?? [])}]`}
                                placeholder="Zadajte množstvo"
                                value={values.quantity}
                                error={errors.quantity}
                                onChange={event => setValues({...values, quantity: event.currentTarget.value})}
                            />
                        </div>
                    </div>

                    <FormTextArea
                        name="description"
                        label="Poznámka"
                        placeholder="Zadajte poznámku"
                        value={values.description}
                        error={errors.description}
                        onChange={value => setValues({...values, description: value})}
                    />

                    {productType === ProductType.BOARD && product && <OrderBoardForm
                        ref={boardFormRef}
                        strictDecorOrientation={strictDecorOrientation}
                        setStrictDecorOrientation={setStrictDecorOrientation}
                        product={product}
                        setProduct={setProduct}
                        getBoard={getBoard}
                        getEdge={getEdge}
                    />}
                    {productType === ProductType.DOUBLED_BOARD && product && <OrderDoubledBoardForm
                        ref={doubledBoardFormRef}
                        strictDecorOrientation={strictDecorOrientation}
                        setStrictDecorOrientation={setStrictDecorOrientation}
                        product={product}
                        setProduct={setProduct}
                        getBoard={getBoard}
                        getEdge={getEdge}
                    />}
                    {productType === ProductType.FRAMED_BOARD && product && <OrderFramedBoardForm
                        ref={framedBoardFormRef}
                        strictDecorOrientation={strictDecorOrientation}
                        setStrictDecorOrientation={setStrictDecorOrientation}
                        product={product}
                        setProduct={setProduct}
                        getBoard={getBoard}
                        getEdge={getEdge}
                    />}
                    {productType === ProductType.FRAME && product && <OrderFrameForm
                        ref={frameFormRef}
                        strictDecorOrientation={strictDecorOrientation}
                        setStrictDecorOrientation={setStrictDecorOrientation}
                        product={product}
                        setProduct={setProduct}
                        getBoard={getBoard}
                        getEdge={getEdge}
                    />}

                    <button
                        type="submit"
                        className="btn btn-primary mt-5"
                        disabled={busy}
                    >Potvrdiť
                    </button>
                </form>
            </div>
            <div className="flex flex-col flex-1 min-h-0">
                <OrderImage productImage={productImage} generateImageInProgress={generateImageInProgress}/>
            </div>
        </div>
    )
}

export default OrderItemEditor;
