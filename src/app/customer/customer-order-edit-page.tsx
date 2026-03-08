import {NavLink, useNavigate, useParams} from 'react-router-dom';
import OrderEditProvider from '../../state/order-edit';
import {type ChangeEvent, type SubmitEvent, useContext, useEffect, useState} from 'react';
import {AppContext, DialogContext, OrderEditContext} from '../../state';
import {Authority, type Order, type OrderData, ProductPosition, Unit} from '../../api/model/porez';
import {type FieldErrors, formatNumber, getEnumValue, validateRequired} from '../../component';
import InfoIcon from '../../component/info-icon';
import PageContent from '../../component/layout/page-content';
import Table from '../../component/table';
import OrderItemDimensionValue from '../../component/order/order-item-dimension-value';
import OrderItemBoardValue from '../../component/order/order-item-board-value';
import OrderItemEdgeValue from '../../component/order/order-item-edge-value';
import {DialogAnswer, DialogType} from '../../state/dialog/model';
import {createPortal} from 'react-dom';
import BaseDialog from '../../component/dialog/base-dialog';
import FormInput from '../../component/form/form-input';
import FormTextArea from '../../component/form/form-text-area';

const CustomerOrderEditPage = () => {
    const {id} = useParams();

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li><NavLink to="/customer/order">Objednávka</NavLink></li>
                    <li><NavLink to={`/customer/orders/${id}/edit`}>Upraviť objednávku</NavLink></li>
                </ul>
            </div>

            <OrderEditProvider>
                <CustomerOrderEditPageContent id={id ?? ''}/>
            </OrderEditProvider>
        </>
    );
};

export default CustomerOrderEditPage;

const CustomerOrderEditPageContent = ({id}: { id: string }) => {
    const navigate = useNavigate();

    const appState = useContext(AppContext);
    const orderEditState = useContext(OrderEditContext);
    const dialogState = useContext(DialogContext);

    const [order, setOrder] = useState<Order>();

    const [showEditOrderDialog, setShowEditOrderDialog] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const response = await orderEditState?.getOrder(id);
                if (response?.data) {
                    setOrder(response?.data);
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    useEffect(() => {
        if (order !== undefined) {
            if (!orderEditState?.editEnabled(Authority.P_CUSTOMER, order)) {
                navigate('/customer/orders/' + order.id + '/detail')
            }
        }
    }, [order]);

    return (
        <>
            {loading &&
                <div className="flex flex-col justify-center items-center w-full">
                    <span className="loading loading-xl loading-spinner text-primary"></span>
                    <span>Načítavanie objednávky...</span>
                </div>
            }
            {!loading &&
                <>
                    <span
                        className="text-base font-bold text-center">Objednávka č.{formatNumber(order?.orderNumber)}</span>

                    <div className="flex flex-row justify-center items-center w-full gap-2">
                        <label className="input validator w-full">
                            <input
                                type="text"
                                value={order?.name}
                                disabled
                            />
                        </label>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            title="Upraviť"
                            disabled={orderEditState?.busy}
                            onClick={() => setShowEditOrderDialog(true)}
                        ><span className="icon-[lucide--edit] text-base"></span>
                        </button>
                    </div>
                    <textarea
                        className="textarea w-full"
                        value={order?.description}
                        disabled
                    />

                    <PageContent
                        toolBar={
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-primary mt-5"
                                    title="Pridať položku objednávky"
                                    disabled={orderEditState?.busy}
                                    onClick={async () => {
                                        navigate('/customer/orders/' + order?.id + '/edit-item');
                                    }}
                                >
                                    <span className="icon-[lucide--file-plus] text-base"></span>
                                    <span>Pridať položku objednávky</span>
                                </button>
                            </div>
                        }
                        pageNav={
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    title="Odoslať objednávku"
                                    disabled={orderEditState?.busy || !orderEditState?.submitEnabled(order)}
                                    onClick={async () => {
                                        navigate('/customer/orders/' + order?.id + '/submit');
                                    }}
                                >
                                    <span className="icon-[lucide--send] text-base"></span>
                                    <span>Odoslať objednávku</span>
                                </button>
                            </div>
                        }
                    >
                        <Table
                            fields={['sortNum', 'name', 'quantity', 'dimensions', 'board', 'edgeA1', 'edgeA2', 'edgeB1', 'edgeB2', 'actions']}
                            tableHeaderColumn={(field) => {
                                switch (field) {
                                    case 'sortNum':
                                        return (<th key={field}>P.č.</th>);
                                    case 'name':
                                        return (<th key={field}>Názov</th>);
                                    case 'quantity':
                                        return (
                                            <th key={field}>{`Množstvo [${getEnumValue(Unit.PIECE, appState?.units ?? [])}]`}</th>
                                        );
                                    case 'dimensions':
                                        return (
                                            <th key={field}>{`Rozmery [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}</th>
                                        );
                                    case 'board':
                                        return (<th key={field}>Doska</th>);
                                    case 'edgeA1':
                                        return (
                                            <td key={field}>{`${getEnumValue(ProductPosition.A1, appState?.productEdgePositions ?? [])}`}</td>
                                        );
                                    case 'edgeA2':
                                        return (
                                            <td key={field}>{`${getEnumValue(ProductPosition.A2, appState?.productEdgePositions ?? [])}`}</td>
                                        );
                                    case 'edgeB1':
                                        return (
                                            <td key={field}>{`${getEnumValue(ProductPosition.B1, appState?.productEdgePositions ?? [])}`}</td>
                                        );
                                    case 'edgeB2':
                                        return (
                                            <td key={field}>{`${getEnumValue(ProductPosition.B2, appState?.productEdgePositions ?? [])}`}</td>
                                        );
                                    case 'actions':
                                        return (<th key={field}></th>);
                                }
                            }}
                            rows={order?.items}
                            tableRowKey={(row) => `${row.id}`}
                            tableRowColumn={(field, row) => {
                                switch (field) {
                                    case 'sortNum':
                                        return (
                                            <td key={field}>
                                                <div className="flex flex-row w-full items-center gap-2">
                                                    <div className="join join-horizontal">
                                                        <button
                                                            type="button"
                                                            className="btn btn-ghost btn-xs join-item"
                                                            title="Presunúť hore"
                                                            disabled={orderEditState?.busy}
                                                            onClick={async () => {
                                                                const response = await orderEditState?.moveUpItem(order?.id ?? '', row.id ?? '');
                                                                if (response?.data) {
                                                                    setOrder(response?.data);
                                                                }
                                                            }}
                                                        ><span className="icon-[lucide--arrow-up] text-base"></span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-ghost btn-xs join-item"
                                                            title="Presunúť dole"
                                                            disabled={orderEditState?.busy}
                                                            onClick={async () => {
                                                                const response = await orderEditState?.moveDownItem(order?.id ?? '', row.id ?? '');
                                                                if (response?.data) {
                                                                    setOrder(response?.data);
                                                                }
                                                            }}
                                                        ><span className="icon-[lucide--arrow-down] text-base"></span>
                                                        </button>
                                                    </div>
                                                    <span>{(row.sortNum ?? 0) + 1}</span>
                                                </div>
                                            </td>
                                        );
                                    case 'name':
                                        return (
                                            <td key={field}>
                                                <div className="flex flex-row w-full justify-center items-center">
                                                    <div className="w-full">
                                                        <span>{row.name}</span>
                                                    </div>
                                                    <InfoIcon info={row.description}/>
                                                </div>
                                            </td>
                                        );
                                    case 'quantity':
                                        return (<td key={field}>{formatNumber(row.quantity)}</td>);
                                    case 'dimensions':
                                        return (<td key={field}><OrderItemDimensionValue item={row}/></td>);
                                    case 'board':
                                        return (
                                            <td key={field}>
                                                <OrderItemBoardValue
                                                    item={row}
                                                    boards={order?.boards ?? []}/>
                                            </td>
                                        );
                                    case 'edgeA1':
                                        return (
                                            <td key={field}>
                                                <OrderItemEdgeValue
                                                    position={ProductPosition.A1}
                                                    item={row}
                                                    edges={order?.edges ?? []}
                                                />
                                            </td>
                                        );
                                    case 'edgeA2':
                                        return (
                                            <td key={field}>
                                                <OrderItemEdgeValue
                                                    position={ProductPosition.A2}
                                                    item={row}
                                                    edges={order?.edges ?? []}
                                                />
                                            </td>
                                        );
                                    case 'edgeB1':
                                        return (
                                            <td key={field}>
                                                <OrderItemEdgeValue
                                                    position={ProductPosition.B1}
                                                    item={row}
                                                    edges={order?.edges ?? []}
                                                />
                                            </td>
                                        );
                                    case 'edgeB2':
                                        return (
                                            <td key={field}>
                                                <OrderItemEdgeValue
                                                    position={ProductPosition.B2}
                                                    item={row}
                                                    edges={order?.edges ?? []}
                                                />
                                            </td>
                                        );
                                    case 'actions':
                                        return (
                                            <td key={field}>
                                                <div className="join join-horizontal">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary btn-xs join-item"
                                                        title="Upraviť"
                                                        disabled={orderEditState?.busy}
                                                        onClick={() => {
                                                            navigate('/customer/orders/' + order?.id + '/edit-item/' + row.id);
                                                        }}
                                                    ><span className="icon-[lucide--edit] text-base"></span></button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-ghost btn-xs join-item"
                                                        title="Kopírovať"
                                                        disabled={orderEditState?.busy}
                                                        onClick={() => {
                                                            navigate({
                                                                pathname: '/customer/orders/' + order?.id + '/edit-item/' + row.id,
                                                                search: '?mode=copy'
                                                            });
                                                        }}
                                                    ><span className="icon-[lucide--copy] text-base"></span></button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-accent btn-xs join-item"
                                                        title="Zmazať"
                                                        disabled={orderEditState?.busy}
                                                        onClick={() => {
                                                            dialogState?.showDialog({
                                                                type: DialogType.YES_NO,
                                                                title: 'Zmazať položku objednávky',
                                                                message: 'Naozaj si želáte zmazať položku objednávky?',
                                                                callback: (answer: DialogAnswer) => {
                                                                    if (answer === DialogAnswer.YES) {
                                                                        (async () => {
                                                                            const response = await orderEditState?.deleteItem(order?.id ?? '', row.id ?? '');
                                                                            if (response?.data) {
                                                                                setOrder(response?.data);
                                                                            }
                                                                        })();
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                    ><span className="icon-[lucide--trash] text-base"></span></button>
                                                </div>
                                            </td>
                                        );
                                }
                            }}
                        />
                    </PageContent>
                </>
            }

            {showEditOrderDialog && <OrderDialog
                dialogId="order-edit-order-dialog-001"
                showDialog={showEditOrderDialog}
                order={order}
                okHandler={async (orderData) => {
                    if (order) {
                        console.log(orderData);
                        const response = await orderEditState?.setOrder(order.id ?? '', orderData);
                        if (response?.data) {
                            setOrder(response?.data);
                        }
                    }
                    setShowEditOrderDialog(false);
                }}
                cancelHandler={() => setShowEditOrderDialog(false)}
            />}
        </>
    )
}

const OrderDialog = ({dialogId, showDialog, order, okHandler, cancelHandler}: {
    dialogId: string,
    showDialog: boolean,
    order?: Order,
    okHandler: (orderData: OrderData) => Promise<void>,
    cancelHandler: () => void,
}) => {
    const dialogState = useContext(DialogContext);

    const [values, setValues] = useState<OrderData>({
        name: order?.name ?? '',
        description: order?.description ?? '',
    });
    const [errors, setErrors] = useState<FieldErrors<OrderData>>({});
    const [busy, setBusy] = useState(false);

    const validate = (v: OrderData): FieldErrors<OrderData> => {
        return {
            ...validateRequired<OrderData, 'name'>('name', v.name, 'Vyžaduje sa vlastné označenie objednávky'),
        }
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setValues(prev => ({
            ...prev,
            [name as keyof OrderData]: value,
        }));
    }

    const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        setBusy(true);
        try {
            e.preventDefault();

            const validationErrors = validate(values);
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length !== 0) return;

            await okHandler(values);
        } finally {
            setBusy(false);
        }
    }

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog id={dialogId} showDialog={showDialog} closeHandler={cancelHandler}>
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">Kontaktné informácie</div>
                </div>

                <form
                    className="flex flex-col justify-center items-center w-full max-w-md"
                    onSubmit={onSubmit}
                    noValidate
                >
                    <FormInput
                        name="name"
                        label="Vlastné označenie objednávky"
                        placeholder="Zadajte vlastné označenie objednávky"
                        value={values.name}
                        error={errors.name}
                        onChange={onChange}
                    />

                    <FormTextArea
                        name="description"
                        label="Vlastný popis objednávky"
                        placeholder="Zadajte vlastný popis objednávky"
                        value={values.description}
                        error={errors.description}
                        onChange={value => setValues({...values, description: value})}
                    />

                    <div className="join mt-5">
                        <button
                            type="submit"
                            className="btn btn-primary join-item"
                            disabled={busy}
                        >Potvrdiť
                        </button>
                        <button
                            type="button"
                            className="btn btn-accent join-item"
                            onClick={cancelHandler}
                        >Zrušiť
                        </button>
                    </div>
                </form>
            </div>
        </BaseDialog>
        , dialogState.modalRoot))
}
