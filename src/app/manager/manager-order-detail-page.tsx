import {NavLink, useParams} from 'react-router-dom';
import OrderEditProvider from '../../state/order-edit';
import {type ChangeEvent, type SubmitEvent, useContext, useEffect, useState} from 'react';
import {AppContext, AuthContext, DialogContext, OrderEditContext} from '../../state';
import {type Order, type OrderContact, OrderStatus, Unit} from '../../api/model/porez';
import {
    type FieldErrors,
    formatNumber,
    formatStringDate,
    formatStringDateTime,
    getEnumValue,
    parseStringArray,
    PHONE_REGEX,
    validateEmail,
    validatePattern,
    validateRequired
} from '../../component';
import Tabs from '../../component/tabs';
import OrderUserValue from '../../component/order/order-user-value';
import OrderCommentDialog from '../../component/order/order-comment-dialog';
import {createPortal} from 'react-dom';
import BaseDialog from '../../component/dialog/base-dialog';
import FormInput from '../../component/form/form-input';

const ManagerOrderDetailPage = () => {
    const {id} = useParams();

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Manažér</li>
                    <li><NavLink to="/manager/orders">objednávky</NavLink></li>
                    <li><NavLink to={`/manager/orders/${id}/detail`}>Detail objednávky</NavLink></li>
                </ul>
            </div>

            <OrderEditProvider>
                <ManagerOrderDetailPageContent id={id ?? ''}/>
            </OrderEditProvider>
        </>
    );
};

export default ManagerOrderDetailPage;

const ManagerOrderDetailPageContent = ({id}: { id: string }) => {
    const appState = useContext(AppContext);
    const authState = useContext(AuthContext);
    const orderEditState = useContext(OrderEditContext);

    const [order, setOrder] = useState<Order>();

    const [detail, setDetail] = useState('');
    const [csv, setCsv] = useState<string>('');
    const [csvUrl, setCsvUrl] = useState<string>();

    const [showContactInfoDialog, setShowContactInfoDialog] = useState(false);
    const [showCommentDialog, setShowCommentDialog] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const orderResponse = await orderEditState?.getOrder(id);
                setOrder(orderResponse?.data);
                const htmlResponse = await orderEditState?.getHtml(id);
                setDetail(htmlResponse?.data?.value ?? '');
                const csvResponse = await orderEditState?.getCsv(id);
                setCsv(csvResponse?.data?.value ?? '');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    useEffect(() => {
        if (!csv) {
            setCsvUrl(undefined);
            return;
        }

        const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv'}));
        setCsvUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [csv]);

    const mapRows = (data: string) => {
        return parseStringArray('\n', data).map((row, index) => <tr key={index}>{mapCols(row)}</tr>)
    }

    const mapCols = (row: string) => {
        return parseStringArray(appState?.csvSeparator || ';', row).map((col, index) =>
            <td key={index}>
                <span>{col.split('"').join('')}</span>
            </td>
        );
    }

    return (
        <>
            {loading &&
                <div className=" flex flex-col justify-center items-center text-center">
                    <span className="loading loading-xl loading-spinner text-primary"></span>
                    <span>Načítavanie objednávky...</span>
                </div>
            }

            {!loading &&
                <>
                    <span
                        className="text-base font-bold text-center">Objednávka č.{formatNumber(order?.orderNumber)}</span>

                    <label className="input validator w-full">
                        <input
                            type="text"
                            value={order?.name}
                            disabled
                        />
                    </label>
                    <textarea
                        className="textarea w-full"
                        value={order?.description}
                        disabled
                    />

                    <div className="w-full overflow-auto">
                        <table className="table table-xs w-full">
                            <thead>
                            <tr>
                                <th>Vytvoril</th>
                                <th>Vytvorená</th>
                                <th>Stav objednávky</th>
                                <th>{`Hmotnosť [${getEnumValue(Unit.KILOGRAM, appState?.units ?? [])}]`}</th>
                                <th>{`Cena [${getEnumValue(Unit.CURRENCY, appState?.units ?? [])}]`}</th>
                                <th>{`Cena s DPH [${getEnumValue(Unit.CURRENCY, appState?.units ?? [])}]`}</th>
                                <th>Dátum doručenia</th>
                                <th>Spôsob doručenia a balenia</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td><OrderUserValue value={order?.creator}/></td>
                                <td>{formatStringDateTime(order?.created)}</td>
                                <td>{order?.status ? getEnumValue(order?.status, appState?.orderStatuses ?? []) : ''}</td>
                                <td>{formatNumber(order?.weight)}</td>
                                <td>{formatNumber(order?.total)}</td>
                                <td>{formatNumber(order?.vatTotal)}</td>
                                <td>{formatStringDate(order?.deliveryDate)}</td>
                                <td>{order?.packageType ? getEnumValue(order?.packageType, appState?.orderPackageTypes ?? []) : ''}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <Tabs
                        tabs={[
                            {
                                name: 'HTML',
                                node:
                                    <>
                                        <button
                                            type="button"
                                            title="Upraviť kontaktné informácie"
                                            className="btn btn-primary btn-sm"
                                            disabled={orderEditState?.busy || ([OrderStatus.NEW, OrderStatus.FINISHED, OrderStatus.CANCELLED] as OrderStatus[]).includes(order?.status || OrderStatus.NEW)}
                                            onClick={() => setShowContactInfoDialog(true)}
                                        ><span className="icon-[lucide--edit] text-base"></span>
                                        </button>

                                        <div className="w-full overflow-auto flex flex-col min-h-0">
                                            <iframe
                                                title="Order detail"
                                                className="w-full grow min-h-96"
                                                sandbox=""
                                                srcDoc={detail}>
                                            </iframe>
                                        </div>

                                        {showContactInfoDialog && <OrderContactDialog
                                            dialogId="manager-order-detail-contact-dialog-id-001"
                                            showDialog={showContactInfoDialog}
                                            orderContact={order?.contact}
                                            okHandler={async (orderContact) => {
                                                const response = await orderEditState?.setOrderContact(id, orderContact);
                                                if (response?.data) {
                                                    setOrder(response.data);
                                                    const htmlResponse = await orderEditState?.getHtml(id);
                                                    setDetail(htmlResponse?.data?.value ?? '');
                                                    const csvResponse = await orderEditState?.getCsv(id);
                                                    setCsv(csvResponse?.data?.value ?? '');
                                                }
                                                setShowContactInfoDialog(false);
                                            }}
                                            cancelHandler={() => setShowContactInfoDialog(false)}
                                        />
                                        }
                                    </>
                            },
                            {
                                name: 'CSV',
                                node:
                                    <>
                                        <a
                                            className="btn btn-ghost btn-sm"
                                            title="Stiahnuť CSV"
                                            id="download"
                                            download={`Objednávka_č_${order?.orderNumber}.csv`}
                                            href={csvUrl ?? ''}>
                                            <span className="icon-[lucide--save] text-base"></span>
                                        </a>
                                        <div className="w-full overflow-auto flex flex-col min-h-0">
                                            <div className="w-full grow min-h-0">
                                                <table
                                                    className="table table-zebra table-xs w-full">
                                                    <tbody>
                                                    {mapRows(csv)}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                            },
                            {
                                name: 'Komentáre',
                                node:
                                    <>
                                        <button
                                            type="button"
                                            title="Pridať"
                                            className="btn btn-primary btn-sm"
                                            disabled={orderEditState?.busy || orderEditState?.orderFinal(order)}
                                            onClick={() => setShowCommentDialog(true)}
                                        ><span className="icon-[lucide--file-plus] text-base"></span>
                                        </button>

                                        <div className="w-full overflow-auto flex flex-col min-h-0">
                                            <div className="w-full grow min-h-0">
                                                {order?.comments?.map(comment =>
                                                    <div key={comment.id}>
                                                        {comment.creator?.id === authState?.user?.id ?
                                                            <div className="chat chat-start">
                                                                <div className="chat-bubble chat-bubble-primary">
                                                                    <span
                                                                        className="text-xs">{formatStringDateTime(comment.created)}</span>
                                                                    <span>{comment.comment}</span>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className="chat chat-end">
                                                                <div className="chat-bubble chat-bubble-success">
                                                                    <span className="text-xs"><OrderUserValue
                                                                        value={comment.creator}/></span>
                                                                    <span
                                                                        className="text-xs">{formatStringDateTime(comment.created)}</span>
                                                                    <span>{comment.comment}</span>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {showCommentDialog && <OrderCommentDialog
                                            dialogId="customer-order-detail-comment-dialog-id-001"
                                            showDialog={showCommentDialog}
                                            setShowDialog={setShowCommentDialog}
                                            okHandler={async (orderCommentData) => {
                                                const response = await orderEditState?.addComment(id, orderCommentData)
                                                if (response?.data) {
                                                    setOrder(response?.data);
                                                }
                                            }}
                                        />}
                                    </>
                            }
                        ]}
                    />
                </>
            }
        </>
    )
}

const OrderContactDialog = ({dialogId, showDialog, orderContact, okHandler, cancelHandler}: {
    dialogId: string,
    showDialog: boolean,
    orderContact?: OrderContact,
    okHandler: (orderContact: OrderContact) => Promise<void>,
    cancelHandler: () => void,
}) => {
    const dialogState = useContext(DialogContext);

    const [values, setValues] = useState<OrderContact>({
        name: orderContact?.name ?? '',
        street: orderContact?.street ?? '',
        zipCode: orderContact?.zipCode ?? '',
        city: orderContact?.city ?? '',
        state: orderContact?.state ?? '',
        phone: orderContact?.phone ?? '',
        email: orderContact?.email ?? '',
        businessId: orderContact?.businessId ?? '',
        taxId: orderContact?.taxId ?? '',
    });
    const [errors, setErrors] = useState<FieldErrors<OrderContact>>({});
    const [busy, setBusy] = useState(false);

    const validate = (v: OrderContact): FieldErrors<OrderContact> => {
        return {
            ...validateRequired<OrderContact, 'name'>('name', v.name, 'Vyžaduje sa názov'),
            ...validateRequired<OrderContact, 'street'>('street', v.street, 'Vyžaduje sa ulica'),
            ...validateRequired<OrderContact, 'zipCode'>('zipCode', v.zipCode, 'Vyžaduje sa PSČ'),
            ...validateRequired<OrderContact, 'city'>('city', v.city, 'Vyžaduje sa mesto'),
            ...validateRequired<OrderContact, 'state'>('state', v.state, 'Vyžaduje sa štát'),
            ...validatePattern<OrderContact, 'phone'>('phone', v.phone, PHONE_REGEX, {
                message: 'Neplatné telefónne číslo',
                allowBlank: false,
                requiredMessage: 'Vyžaduje sa telefónne číslo'
            }),
            ...validateEmail<OrderContact, 'email'>('email', v.email),
        }
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setValues(prev => ({
            ...prev,
            [name as keyof OrderContact]: value,
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
                        label="Názov"
                        placeholder="Zadajte názov"
                        value={values.name}
                        error={errors.name}
                        onChange={onChange}
                    />

                    <FormInput
                        type="email"
                        name="email"
                        label="Email"
                        placeholder="Zadajte email"
                        value={values.email}
                        error={errors.email}
                        onChange={onChange}
                    />

                    <FormInput
                        name="phone"
                        label="Telefónne číslo"
                        placeholder="Zadajte telefónne číslo"
                        value={values.phone}
                        error={errors.phone}
                        onChange={onChange}
                    />

                    <FormInput
                        name="street"
                        label="Ulica"
                        placeholder="Zadajte ulicu"
                        value={values.street}
                        error={errors.street}
                        onChange={onChange}
                    />

                    <FormInput
                        name="city"
                        label="Mesto"
                        placeholder="Zadajte mesto"
                        value={values.city}
                        error={errors.city}
                        onChange={onChange}
                    />

                    <FormInput
                        name="zipCode"
                        label="PSČ"
                        placeholder="Zadajte PSČ"
                        value={values.zipCode}
                        error={errors.zipCode}
                        onChange={onChange}
                    />

                    <FormInput
                        name="state"
                        label="Štát"
                        placeholder="Zadajte štát"
                        value={values.state}
                        error={errors.state}
                        onChange={onChange}
                    />

                    <FormInput
                        name="businessId"
                        label="IČO"
                        placeholder="Zadajte IČO"
                        value={values.businessId}
                        error={errors.businessId}
                        onChange={onChange}
                    />

                    <FormInput
                        name="taxId"
                        label="DIČ"
                        placeholder="Zadajte DIČ"
                        value={values.taxId}
                        error={errors.taxId}
                        onChange={onChange}
                    />

                    <div className="join">
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
