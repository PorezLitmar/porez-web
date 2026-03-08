import {NavLink} from 'react-router-dom';
import OrderProvider from '../../state/order';
import {OrderStatus, Unit} from '../../api/model/porez';
import {useContext} from 'react';
import {AppContext, DialogContext, OrderContext} from '../../state';
import PageContent from '../../component/layout/page-content';
import Table from '../../component/table';
import Pageable from '../../component/pageable';
import {formatNumber, formatStringDate, formatStringDateTime, getEnumValue} from '../../component';
import OrderUserValue from '../../component/order/order-user-value';
import InfoIcon from '../../component/info-icon';
import {DialogAnswer, DialogType} from '../../state/dialog/model';

const EmployeeOrdersPage = () => {

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Zamestnanec</li>
                    <li><NavLink to="/employee/orders">Objednávky</NavLink></li>
                </ul>
            </div>

            <OrderProvider statuses={[OrderStatus.IN_PRODUCTION]}>
                <EmployeeOrdersPageContent/>
            </OrderProvider>
        </>
    );
};

export default EmployeeOrdersPage;

const EmployeeOrdersPageContent = () => {
    const appState = useContext(AppContext);
    const dialogState = useContext(DialogContext);
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
                fields={['creator', 'created', 'status', 'orderNumber', 'name', 'weight', 'total', 'vatTotal',
                    'deliveryDate', 'packageType']}
                tableHeaderColumn={(field) => {
                    switch (field) {
                        case 'creator':
                            return (<th key={field}>Vytvoril</th>);
                        case 'created':
                            return (<th key={field}>Vytvorená</th>);
                        case 'status':
                            return (<th key={field}>Stav</th>);
                        case 'orderNumber':
                            return (<th key={field}>Číslo objednávky</th>);
                        case 'name':
                            return (
                                <th key={field}>Vlastné označenie objednávky</th>
                            );
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
                            return (<th key={field}>Balenie</th>);
                    }
                }}
                rows={orderState?.data}
                tableRowKey={(row) => `${row.id}`}
                tableRowColumn={(field, row) => {
                    switch (field) {
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
                                            title="Objednávka pripravená"
                                            disabled={orderState?.busy}
                                            onClick={() => {
                                                dialogState?.showDialog({
                                                    type: DialogType.YES_NO,
                                                    title: 'Objednávka pripravená',
                                                    message: 'Naozaj si želáte zmeniť stav objednávky na pripravená?',
                                                    callback: (answer: DialogAnswer) => {
                                                        if (answer === DialogAnswer.YES) {
                                                            (async () => {
                                                                await orderState?.setOrderStatus(row.id ?? '', {
                                                                    newStatus: OrderStatus.READY, notifyUser: true
                                                                });
                                                                await orderState?.getOrders();
                                                            })();
                                                        }
                                                    }
                                                });
                                            }}
                                        ><span className="icon-[lucide--truck] text-base"></span></button>
                                        <span>{row.status ? getEnumValue(row.status, appState?.orderStatuses ?? []) : ''}</span>
                                    </div>
                                </td>
                            );
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
                        case 'weight':
                            return (<td key={field}>{formatNumber(row.weight)}</td>);
                        case 'total':
                            return (<td key={field}>{formatNumber(row.total)}</td>);
                        case 'vatTotal':
                            return (<td key={field}>{formatNumber(row.vatTotal)}</td>);
                        case 'deliveryDate':
                            return (<td key={field}>{formatStringDate(row.deliveryDate)}</td>);
                        case 'packageType':
                            return (
                                <td key={field}>{row.packageType ? getEnumValue(row.packageType, appState?.orderPackageTypes ?? []) : ''}</td>);
                    }
                }}
            />
        </PageContent>
    );
}
