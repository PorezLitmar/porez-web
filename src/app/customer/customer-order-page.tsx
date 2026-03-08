import {NavLink, useNavigate} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import {AppContext, AuthContext, DialogContext, OrderContext} from '../../state';
import OrderProvider from '../../state/order';
import {OrderStatus, Unit} from '../../api/model/porez';
import PageContent from '../../component/layout/page-content';
import Table from '../../component/table';
import Pageable from '../../component/pageable';
import {formatNumber, formatStringDateTime, getEnumValue} from '../../component';
import InfoIcon from '../../component/info-icon';
import {DialogAnswer, DialogType} from '../../state/dialog/model';

const CustomerOrderPage = () => {
    const authState = useContext(AuthContext);

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li><NavLink to="/customer/order">Objednávka</NavLink></li>
                </ul>
            </div>
            <div className="flex flex-col justify-center w-full">
                <div className="text-xs text-center">
                    <span>Ak netušíte ako ďalej pozrite si našu </span>
                    <NavLink
                        className="link"
                        to="/order-info"
                    >príručku</NavLink>
                    <span> alebo nás </span>
                    <NavLink
                        className="link"
                        to="/contact-info"
                    >kontaktujte</NavLink>
                    <span> s radosťou Vám poradíme.</span>
                </div>
            </div>

            <OrderProvider
                statuses={[OrderStatus.NEW]}
                userId={authState?.user?.id}
            >
                <CustomerOrderPageContent/>
            </OrderProvider>
        </>
    );
};

export default CustomerOrderPage;

const CustomerOrderPageContent = () => {
    const navigate = useNavigate();

    const appState = useContext(AppContext);
    const dialogState = useContext(DialogContext);
    const orderState = useContext(OrderContext);

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        orderState?.getOrders();
    }, []);

    return (
        <PageContent
            toolBar={
                <div>
                    {processing ?
                        <div className=" flex flex-col justify-center items-center text-center">
                            <span className="loading loading-xl loading-spinner text-primary"></span>
                            <span>Vytváranie objednávky...</span>
                        </div>
                        :
                        <button
                            type="button"
                            className="btn btn-primary mt-5"
                            title="Vytvoriť novú objednávku"
                            disabled={orderState?.busy || processing}
                            onClick={async () => {
                                setProcessing(true);
                                try {
                                    const response = await orderState?.addOrder();
                                    if (response?.data) {
                                        navigate('/customer/orders/' + response.data.id + '/edit');
                                    }
                                } finally {
                                    setProcessing(false);
                                }
                            }}
                        >
                            <span className="icon-[lucide--file-plus] text-base"></span>
                            <span>Vytvoriť novú objednávku</span>
                        </button>
                    }
                </div>
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
                fields={['orderNumber', 'name', 'created', 'weight', 'total', 'vatTotal', 'actions']}
                tableHeaderColumn={(field) => {
                    switch (field) {
                        case 'orderNumber':
                            return (<th key={field}>Číslo</th>);
                        case 'name':
                            return (<th key={field}>Vlastné označenie objednávky</th>);
                        case 'created':
                            return (<th key={field}>Dátum a čas vytvorenia</th>);
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
                        case 'created':
                            return (<td key={field}>{formatStringDateTime(row.created)}</td>);
                        case 'weight':
                            return (<td key={field}>{formatNumber(row.weight)}</td>);
                        case 'total':
                            return (<td key={field}>{formatNumber(row.total)}</td>);
                        case 'vatTotal':
                            return (<td key={field}>{formatNumber(row.vatTotal)}</td>);
                        case 'actions':
                            return (
                                <td key={field}>
                                    <div className="join">
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-xs join-item"
                                            title="Upraviť"
                                            disabled={orderState?.busy}
                                            onClick={() => {
                                                navigate('/customer/orders/' + row.id + '/edit');
                                            }}
                                        ><span className="icon-[lucide--edit] text-base"></span></button>
                                        <button
                                            type="button"
                                            className="btn btn-accent btn-xs join-item"
                                            title="Zmazať"
                                            disabled={orderState?.busy}
                                            onClick={() => {
                                                dialogState?.showDialog({
                                                    type: DialogType.YES_NO,
                                                    title: 'Zmazať objednávku',
                                                    message: 'Naozaj si želáte zmazať objednávku?',
                                                    callback: (answer: DialogAnswer) => {
                                                        if (answer === DialogAnswer.YES) {
                                                            orderState?.deleteOrder(row.id ?? '');
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
    )
}