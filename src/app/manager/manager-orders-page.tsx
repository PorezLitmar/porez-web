import {NavLink, useNavigate} from 'react-router-dom';
import OrderProvider from '../../state/order';
import {type Order, OrderStatus, type OrderStatusData, type OrderUser, Unit} from '../../api/model/porez';
import OrderUserProvider from '../../state/order-user';
import {useContext, useEffect, useState} from 'react';
import {AppContext, DialogContext, OrderContext, OrderUserContext} from '../../state';
import PageContent from '../../component/layout/page-content';
import type {OrderSearchCriteria, OrderUserSearchCriteria} from '../../api/client/order';
import Pageable from '../../component/pageable';
import {formatNumber, formatStringDate, formatStringDateTime, getEnumValue, parseDate} from '../../component';
import OrderUserValue from '../../component/order/order-user-value';
import InfoIcon from '../../component/info-icon';
import {DialogAnswer, DialogType} from '../../state/dialog/model';
import Table from '../../component/table';
import FormCheckBox from '../../component/form/form-check-box';
import FormInput from '../../component/form/form-input';
import BaseDialog from '../../component/dialog/base-dialog';
import {createPortal} from 'react-dom';
import FormRadio from '../../component/form/form-radio';

const ManagerOrdersPage = () => {

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Manažér</li>
                    <li><NavLink to="/manager/orders">Objednávky</NavLink></li>
                </ul>
            </div>

            <OrderProvider statuses={[OrderStatus.SENT, OrderStatus.IN_PRODUCTION, OrderStatus.READY]}>
                <OrderUserProvider>
                    <ManagerOrdersPageContent/>
                </OrderUserProvider>
            </OrderProvider>
        </>
    );
};

export default ManagerOrdersPage;

const ManagerOrdersPageContent = () => {
    const navigate = useNavigate();

    const appState = useContext(AppContext);
    const dialogState = useContext(DialogContext);
    const orderState = useContext(OrderContext);

    const [selected, setSelected] = useState<Order>();
    const [showOrderStatusDialog, setShowOrderStatusDialog] = useState(false);

    useEffect(() => {
        orderState?.getOrders();
    }, []);

    return (
        <>
            <PageContent
                toolBar={
                    <ManagerOrderSearchCriteriaForm
                        searchHandler={(criteria) => orderState?.setCriteria(criteria)}
                    />
                }
                pageNav={
                    <Pageable
                        isPrevious={orderState?.previous ?? false}
                        previousHandler={() => orderState?.setPage(orderState?.page - 1)}
                        page={(orderState?.page ?? 0) + 1}
                        totalPages={orderState?.totalPages ?? 0}
                        isNext={orderState?.next ?? false}
                        nextHandler={() => orderState?.setPage(orderState?.page + 1)}
                        disabled={orderState?.busy}
                    />
                }
            >
                <Table
                    fields={['orderNumber', 'creator', 'created', 'status', 'name', 'weight', 'total', 'vatTotal',
                        'deliveryDate', 'packageType', 'actions']}
                    tableHeaderColumn={(field) => {
                        switch (field) {
                            case 'orderNumber':
                                return (<th key={field}>Číslo</th>);
                            case 'creator':
                                return (<th key={field}>Vytvoril</th>);
                            case 'created':
                                return (<th key={field}>Vytvorená</th>);
                            case 'status':
                                return (<th key={field}>Stav</th>);
                            case 'name':
                                return (<th key={field}>Vlastné označenie objednávky</th>);
                            case 'weight':
                                return (
                                    <th key={field}>{`Hmotnosť [${getEnumValue(Unit.KILOGRAM, appState?.units ?? [])}]`}</th>
                                );
                            case 'total':
                                return (
                                    <th key={field}>{`Cena [${getEnumValue(Unit.CURRENCY, appState?.units ?? [])}]`}</th>
                                );
                            case 'vatTotal':
                                return (
                                    <th key={field}>{`Cena s DPH [${getEnumValue(Unit.CURRENCY, appState?.units ?? [])}]`}</th>
                                );
                            case 'deliveryDate':
                                return (<th key={field}>Dátum doručenia</th>);
                            case 'packageType':
                                return (<th key={field}>Spôsob doručenia a balenia</th>);
                            case 'actions':
                                return (<th key={field}></th>);
                        }
                    }}
                    rows={orderState?.data}
                    tableRowKey={(row) => `${row.id}`}
                    tableRowColumn={(field, row) => {
                        switch (field) {
                            case 'orderNumber':
                                return (<td key={field}>{formatNumber(row.orderNumber)}</td>);
                            case 'creator':
                                return (<td key={field}><OrderUserValue value={row.creator}/></td>);
                            case 'created':
                                return (<td key={field}>{formatStringDateTime(row.created)}</td>);
                            case 'status':
                                return (
                                    <td key={field}>
                                        <div className="flex flex-row w-full items-center gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-xs"
                                                title="Zmeniť stav"
                                                disabled={orderState?.busy || ([OrderStatus.NEW, OrderStatus.FINISHED, OrderStatus.CANCELLED] as OrderStatus[]).includes(row.status || OrderStatus.NEW)}
                                                onClick={() => {
                                                    setSelected(row);
                                                    setShowOrderStatusDialog(true);
                                                }}
                                            ><span className="icon-[lucide--edit] text-base"></span></button>
                                            <span>{row.status ? getEnumValue(row.status, appState?.orderStatuses ?? []) : ''}</span>
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
                            case 'weight':
                                return (<td key={field}>{formatNumber(row.weight)}</td>);
                            case 'total':
                                return (<td key={field}>{formatNumber(row.total)}</td>);
                            case 'vatTotal':
                                return (
                                    <td key={field}>
                                        <div className="flex flex-row w-full items-center gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-xs"
                                                title="Prepočítať"
                                                disabled={orderState?.busy || ([OrderStatus.NEW, OrderStatus.FINISHED, OrderStatus.CANCELLED] as OrderStatus[]).includes(row.status || OrderStatus.NEW)}
                                                onClick={() => {
                                                    dialogState?.showDialog({
                                                        type: DialogType.YES_NO,
                                                        title: 'Prepočítať objednávku',
                                                        message: 'Naozaj si želáte prepočítať objednávku?',
                                                        callback: (answer: DialogAnswer) => {
                                                            if (answer === DialogAnswer.YES) {
                                                                void orderState?.recountOrder(row.id ?? '');
                                                            }
                                                        }
                                                    });
                                                }}
                                            ><span className="icon-[lucide--dollar-sign] text-base"></span></button>
                                            <span>{row.status ? getEnumValue(row.status, appState?.orderStatuses ?? []) : ''}</span>
                                        </div>
                                    </td>
                                );
                            case 'deliveryDate':
                                return (<td key={field}>{formatStringDate(row.deliveryDate)}</td>);
                            case 'packageType':
                                return (
                                    <td key={field}>{row.packageType ? getEnumValue(row.packageType, appState?.orderPackageTypes ?? []) : ''}</td>
                                );
                            case 'actions':
                                return (
                                    <td key={field}>
                                        <div className="join">
                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-xs join-item"
                                                title="Detail"
                                                disabled={orderState?.busy}
                                                onClick={() => {
                                                    navigate('/manager/orders/' + row.id + '/detail');
                                                }}
                                            ><span className="icon-[lucide--eye] text-base"></span></button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-xs join-item"
                                                title="Upraviť"
                                                disabled={orderState?.busy || ([OrderStatus.IN_PRODUCTION, OrderStatus.READY, OrderStatus.FINISHED, OrderStatus.CANCELLED] as OrderStatus[]).includes(row.status || OrderStatus.NEW)}
                                                onClick={() => {
                                                    navigate('/manager/orders/' + row.id + '/edit');
                                                }}
                                            ><span className="icon-[lucide--edit] text-base"></span></button>
                                        </div>
                                    </td>
                                );
                        }
                    }}
                />
            </PageContent>

            {showOrderStatusDialog && <OrderStatusDialog
                dialogId=""
                showDialog={showOrderStatusDialog}
                okHandler={async (orderStatusData) => {
                    if (selected) {
                        await orderState?.setOrderStatus(selected.id ?? '', orderStatusData);
                        setSelected(undefined);
                    }
                    setShowOrderStatusDialog(false);
                }}
                cancelHandler={() => setShowOrderStatusDialog(false)}
            />}
        </>
    )
}

const ManagerOrderSearchCriteriaForm = ({searchHandler}: {
    searchHandler: (criteria: OrderSearchCriteria) => void
}) => {
    const appState = useContext(AppContext);

    const [statusNew, setStatusNew] = useState(false);
    const [statusSent, setStatusSent] = useState(true);
    const [statusInProduction, setStatusInProduction] = useState(true);
    const [statusReady, setStatusReady] = useState(true);
    const [statusFinished, setStatusFinished] = useState(false);
    const [statusCancelled, setStatusCancelled] = useState(false);
    const [orderUser, setOrderUser] = useState<OrderUser>();
    const [createdFrom, setCreatedFrom] = useState('');
    const [createdTo, setCreatedTo] = useState('');

    const [extended, setExtended] = useState(false);
    const [showSelectOrderUsersDialog, setShowSelectOrderUsersDialog] = useState(false);

    const createCriteria = () => {
        const dateCreatedFrom = parseDate(createdFrom);
        const dateCreatedTo = parseDate(createdTo);

        const criteria: OrderSearchCriteria = {statuses: []};
        if (statusNew) {
            criteria.statuses?.push(OrderStatus.NEW);
        }
        if (statusSent) {
            criteria.statuses?.push(OrderStatus.SENT);
        }
        if (statusInProduction) {
            criteria.statuses?.push(OrderStatus.IN_PRODUCTION);
        }
        if (statusReady) {
            criteria.statuses?.push(OrderStatus.READY);
        }
        if (statusFinished) {
            criteria.statuses?.push(OrderStatus.FINISHED);
        }
        if (statusCancelled) {
            criteria.statuses?.push(OrderStatus.CANCELLED);
        }
        if (orderUser) {
            criteria.userIds = [orderUser.id ?? ''];
        }
        if (createdFrom) {
            criteria.createdFrom = dateCreatedFrom ? dateCreatedFrom.toISOString() : undefined;
        }
        if (createdTo) {
            criteria.createdTo = dateCreatedTo ? dateCreatedTo.toISOString() : undefined;
        }
        return criteria;
    }

    return (
        <div className="flex flex-col w-full gap-2">
            <div className="join join-horizontal w-full">
                <div className="flex flex-row w-full justify-center items-center join-item">
                    <FormCheckBox
                        name="statusNew"
                        value={statusNew}
                        onChange={event => setStatusNew(event.target.checked)}>
                        <span>{getEnumValue(OrderStatus.NEW, appState?.orderStatuses ?? [])}</span>
                    </FormCheckBox>
                    <FormCheckBox
                        name="statusSent"
                        value={statusSent}
                        onChange={event => setStatusSent(event.target.checked)}>
                        <span>{getEnumValue(OrderStatus.SENT, appState?.orderStatuses ?? [])}</span>
                    </FormCheckBox>
                    <FormCheckBox
                        name="statusInProduction"
                        value={statusInProduction}
                        onChange={event => setStatusInProduction(event.target.checked)}>
                        <span>{getEnumValue(OrderStatus.IN_PRODUCTION, appState?.orderStatuses ?? [])}</span>
                    </FormCheckBox>
                    <FormCheckBox
                        name="statusReady"
                        value={statusReady}
                        onChange={event => setStatusReady(event.target.checked)}>
                        <span>{getEnumValue(OrderStatus.READY, appState?.orderStatuses ?? [])}</span>
                    </FormCheckBox>
                    <FormCheckBox
                        name="statusFinished"
                        value={statusFinished}
                        onChange={event => setStatusFinished(event.target.checked)}>
                        <span>{getEnumValue(OrderStatus.FINISHED, appState?.orderStatuses ?? [])}</span>
                    </FormCheckBox>
                    <FormCheckBox
                        name="statusCancelled"
                        value={statusCancelled}
                        onChange={event => setStatusCancelled(event.target.checked)}>
                        <span>{getEnumValue(OrderStatus.CANCELLED, appState?.orderStatuses ?? [])}</span>
                    </FormCheckBox>
                </div>

                <button
                    title="Vyhľadať"
                    className="join-item btn"
                    onClick={() => searchHandler(createCriteria())}
                ><span className="icon-[lucide--search] text-base"></span></button>
                <button
                    title="Rozšírené vyhľadávanie"
                    className="join-item btn"
                    onClick={() => setExtended(!extended)}
                >
                    {extended ?
                        <span className="icon-[lucide--arrow-up] text-base"></span>
                        :
                        <span className="icon-[lucide--arrow-down] text-base"></span>
                    }
                </button>
            </div>

            {extended &&
                <>
                    <div className="grid grid-cols-3 gap-2 w-full">
                        <div className="flex flex-row w-full">
                            <span
                                className="input">{orderUser ? `${orderUser.email} [${orderUser.firstName} ${orderUser.lastName}]` : ''}</span>
                            <div className="flex flex-row justify-center items-center">
                                <div className="join">
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-sm join-item"
                                        title="Vyhľadať používateľa"
                                        onClick={() => setShowSelectOrderUsersDialog(true)}
                                    ><span className="icon-[lucide--user-search] text-base"></span></button>
                                    <button
                                        type="button"
                                        className="btn btn-accent btn-sm join-item"
                                        title="Zrušiť výber"
                                        onClick={() => setOrderUser(undefined)}
                                    ><span className="icon-[lucide--user-x] text-base"></span></button>
                                </div>
                            </div>
                        </div>
                        <FormInput
                            name="createdFrom"
                            type="datetime-local"
                            label="Vytvorená od"
                            value={createdFrom}
                            onChange={event => setCreatedFrom(event.target.value)}
                        />
                        <FormInput
                            name="createdTo"
                            type="datetime-local"
                            label="Vytvorená do"
                            value={createdTo}
                            onChange={event => setCreatedTo(event.target.value)}
                        />
                    </div>

                    {showSelectOrderUsersDialog && <SelectOrderUserDialog
                        dialogId="order-select-user-dialog-001"
                        showDialog={showSelectOrderUsersDialog}
                        setShowDialog={setShowSelectOrderUsersDialog}
                        onSelectUser={(orderUser) => setOrderUser(orderUser)}
                    />}
                </>
            }
        </div>
    )
}

const OrderStatusDialog = ({dialogId, showDialog, okHandler, cancelHandler}: {
    dialogId: string,
    showDialog: boolean,
    okHandler: (orderStatusData: OrderStatusData) => Promise<void>,
    cancelHandler: () => void,
}) => {
    const appState = useContext(AppContext);
    const dialogState = useContext(DialogContext);

    const [notifyUser, setNotifyUser] = useState(false);

    const [newStatus, setNewStatus] = useState<OrderStatus>(OrderStatus.IN_PRODUCTION);
    const [busy, setBusy] = useState(false);

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog id={dialogId} showDialog={showDialog} closeHandler={cancelHandler}>
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">Zmeniť stav objednávky</div>
                </div>

                <div className="flex flex-col justify-center items-center w-full max-w-md">

                    <div className="w-full">
                        <label className="label">
                            <span className="label-text text-xs">Zmeniť stav objednávky</span>
                        </label>
                        <select
                            name="status"
                            value={newStatus}
                            onChange={event => setNewStatus(event.currentTarget.value as OrderStatus)}
                        >
                            <option value={OrderStatus.IN_PRODUCTION}>
                                {getEnumValue(OrderStatus.IN_PRODUCTION, appState?.orderStatuses ?? [])}
                            </option>
                            <option value={OrderStatus.READY}>
                                {getEnumValue(OrderStatus.READY, appState?.orderStatuses ?? [])}
                            </option>
                            <option value={OrderStatus.FINISHED}>
                                {getEnumValue(OrderStatus.FINISHED, appState?.orderStatuses ?? [])}
                            </option>
                            <option value={OrderStatus.CANCELLED}>
                                {getEnumValue(OrderStatus.CANCELLED, appState?.orderStatuses ?? [])}
                            </option>
                        </select>
                    </div>

                    <FormCheckBox
                        name="notifyUser"
                        value={notifyUser}
                        onChange={event => setNotifyUser(event.target.checked)}
                    >
                        <span>Informovať používateľa</span>
                    </FormCheckBox>

                    <div className="join mt-5">
                        <button
                            type="button"
                            className="btn btn-primary join-item"
                            disabled={busy}
                            onClick={async () => {
                                setBusy(true);
                                try {
                                    await okHandler({notifyUser, newStatus});
                                } finally {
                                    setBusy(false);
                                }
                            }}
                        >Potvrdiť
                        </button>
                        <button
                            type="button"
                            className="btn btn-accent join-item"
                            onClick={cancelHandler}
                        >Zrušiť
                        </button>
                    </div>
                </div>
            </div>
        </BaseDialog>
        , dialogState.modalRoot))
}

const SelectOrderUserDialog = (
    {
        dialogId,
        showDialog,
        setShowDialog,
        onSelectUser
    }: {
        dialogId: string,
        showDialog: boolean,
        setShowDialog: (showDialog: boolean) => void,
        onSelectUser: (selected: OrderUser) => void,
    }
) => {
    const orderUserState = useContext(OrderUserContext);
    const dialogState = useContext(DialogContext);

    const [selected, setSelected] = useState<OrderUser>();

    useEffect(() => {
        void orderUserState?.getOrderUsers();
    }, [showDialog]);

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog
            id={dialogId}
            maxWidth={true}
            showDialog={showDialog}
            closeHandler={() => setShowDialog(false)}
        >
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">Vybrať používateľa</div>
                </div>
                <PageContent
                    toolBar={
                        <OrderUserSearchCriteriaForm
                            searchHandler={(criteria) => orderUserState?.setCriteria(criteria)}
                        />
                    }

                    pageNav={
                        <Pageable
                            isPrevious={orderUserState?.previous ?? false}
                            previousHandler={() => orderUserState?.setPage(orderUserState?.page - 1)}
                            page={(orderUserState?.page ?? 0) + 1}
                            totalPages={orderUserState?.totalPages ?? 0}
                            isNext={orderUserState?.next ?? false}
                            nextHandler={() => orderUserState?.setPage(orderUserState?.page + 1)}
                            disabled={orderUserState?.busy}
                        />
                    }
                >
                    <Table
                        fields={['select', 'username', 'firstName', 'lastName']}
                        tableHeaderColumn={(field) => {
                            switch (field) {
                                case 'select':
                                    return (<th key={field}></th>);
                                case 'username':
                                    return (
                                        <th key={field}>Email</th>);
                                case 'firstName':
                                    return (<th key={field}>Meno</th>);
                                case 'lastName':
                                    return (<th key={field}>Priezvisko</th>);
                            }
                        }}
                        rows={orderUserState?.data}
                        tableRowKey={(row) => `${row.id}`}
                        tableRowColumn={(field, row) => {
                            switch (field) {
                                case 'select':
                                    return (
                                        <td key={field}>
                                            <FormRadio
                                                name=""
                                                value={row.id === selected?.id}
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        setSelected(row);
                                                    }
                                                }}/>
                                        </td>
                                    );
                                case 'username':
                                    return (<td key={field}>{row.email}</td>);
                                case 'firstName':
                                    return (<td key={field}>{row.firstName}</td>);
                                case 'lastName':
                                    return (<td key={field}>{row.lastName}</td>);
                            }
                        }}
                        onRowSelected={(row) => setSelected(row)}
                    />
                </PageContent>

                <div className="join">
                    <button
                        type="submit"
                        className="btn btn-primary join-item"
                        disabled={selected === undefined}
                        onClick={() => {
                            if (selected) {
                                onSelectUser(selected);
                                setShowDialog(false);
                            }
                        }}
                    >Potvrdiť
                    </button>
                    <button
                        type="button"
                        className="btn btn-accent join-item"
                        onClick={() => setShowDialog(false)}
                    >Zrušiť
                    </button>
                </div>
            </div>
        </BaseDialog>, dialogState.modalRoot))
}

const OrderUserSearchCriteriaForm = ({searchHandler}: {
    searchHandler: (criteria: OrderUserSearchCriteria) => void
}) => {
    const [searchField, setSearchField] = useState<string>();

    return (
        <div className="join join-horizontal w-full">
            <input
                type="text"
                className="join-item input input-bordered w-full"
                placeholder="Email, meno, stredné meno alebo priezvisko"
                value={searchField}
                onChange={event => setSearchField(event.target.value)}
                onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                        searchHandler({searchField});
                    }
                }}
            />
            <button
                className="join-item btn"
                onClick={() => searchHandler({searchField})}
            ><span className="icon-[lucide--search] text-base"></span></button>
        </div>
    )
}