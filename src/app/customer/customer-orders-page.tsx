import {NavLink, useNavigate} from 'react-router-dom';
import OrderProvider from '../../state/order';
import {OrderStatus, Unit} from '../../api/model/porez';
import {useContext} from 'react';
import {AppContext, AuthContext, OrderContext} from '../../state';
import PageContent from '../../component/layout/page-content';
import Pageable from '../../component/pageable';
import Table from '../../component/table';
import {formatNumber, formatStringDate, formatStringDateTime, getEnumValue} from '../../component';
import InfoIcon from '../../component/info-icon';

const CustomerOrdersPage = () => {
    const authState = useContext(AuthContext);

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li><NavLink to="/customer/orders">Moje objednávky</NavLink></li>
                </ul>
            </div>

            <div className="flex flex-col justify-center w-full">
                <div className="text-xs text-center">
                    <span>Ďakujeme Vám za spoluprácu. V prípade nejasností nás </span>
                    <NavLink
                        className="link"
                        to="/contact-info"
                    >kontaktuje</NavLink>
                    <span> s radosťou Vám poradíme.</span>
                </div>
            </div>

            <OrderProvider
                statuses={[
                    OrderStatus.SENT,
                    OrderStatus.IN_PRODUCTION,
                    OrderStatus.READY,
                    OrderStatus.FINISHED,
                    OrderStatus.CANCELLED
                ]}
                userId={authState?.user?.id}
            >
                <CustomerOrdersPageContent/>
            </OrderProvider>
        </>
    );
};

export default CustomerOrdersPage;

const CustomerOrdersPageContent = () => {
    const navigate = useNavigate();

    const appState = useContext(AppContext);
    const orderState = useContext(OrderContext);

    return (
        <PageContent
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
                fields={['orderNumber', 'name', 'created', 'status', 'total', 'vatTotal', 'deliveryDate', 'packageType', 'actions']}
                tableHeaderColumn={(field) => {
                    switch (field) {
                        case 'orderNumber':
                            return (<th key={field}>Číslo</th>);
                        case 'name':
                            return (<th key={field}>Vlastné označenie objednávky</th>);
                        case 'created':
                            return (<th key={field}>Dátum a čas vytvorenia</th>);
                        case 'status':
                            return (<th key={field}>Stav</th>);
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
                        case 'status':
                            return (
                                <td key={field}>{row.status ? getEnumValue(row.status, appState?.orderStatuses ?? []) : ''}</td>);
                        case 'total':
                            return (<td key={field}>{formatNumber(row.total)}</td>);
                        case 'vatTotal':
                            return (<td key={field}>{formatNumber(row.vatTotal)}</td>);
                        case 'deliveryDate':
                            return (<td key={field}>{formatStringDate(row.deliveryDate)}</td>);
                        case 'packageType':
                            return (
                                <td key={field}>{row.packageType ? getEnumValue(row.packageType, appState?.orderPackageTypes ?? []) : ''}</td>
                            );
                        case 'actions':
                            return (
                                <td key={field}>
                                    <button
                                        type="button"
                                        className="btn btn-ghost btn-xs"
                                        title="Detail objednávky"
                                        disabled={orderState?.busy}
                                        onClick={() => {
                                            navigate('/customer/orders/' + row.id + '/detail');
                                        }}
                                    ><span className="icon-[lucide--eye] text-base"></span></button>
                                </td>
                            );
                    }
                }}
            />
        </PageContent>
    )
}
