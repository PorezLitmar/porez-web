import {NavLink, useNavigate, useParams} from 'react-router-dom';
import OrderEditProvider from '../../state/order-edit';
import {useContext, useEffect, useState} from 'react';
import {AppContext, DialogContext, OrderEditContext} from '../../state';
import {Authority, type Order, ProductPosition, Unit} from '../../api/model/porez';
import {formatNumber, getEnumValue} from '../../component';
import PageContent from '../../component/layout/page-content.tsx';
import Table from '../../component/table.tsx';
import InfoIcon from '../../component/info-icon.tsx';
import OrderItemDimensionValue from '../../component/order/order-item-dimension-value.tsx';
import OrderItemBoardValue from '../../component/order/order-item-board-value.tsx';
import OrderItemEdgeValue from '../../component/order/order-item-edge-value.tsx';
import {DialogAnswer, DialogType} from '../../state/dialog/model.ts';

const ManagerOrderEditPage = () => {
    const {id} = useParams();

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Manažér</li>
                    <li><NavLink to="/manager/orders">Objednávky</NavLink></li>
                    <li><NavLink to={`/manager/orders/${id}/edit`}>Upraviť objednávku</NavLink></li>
                </ul>
            </div>

            <OrderEditProvider>
                <ManagerOrderEditPageContent id={id ?? ''}/>
            </OrderEditProvider>
        </>
    );
};

export default ManagerOrderEditPage;

const ManagerOrderEditPageContent = ({id}: { id: string }) => {
    const navigate = useNavigate();

    const appState = useContext(AppContext);
    const orderEditState = useContext(OrderEditContext);
    const dialogState = useContext(DialogContext);

    const [order, setOrder] = useState<Order>();

    useEffect(() => {
        (async () => {
            const response = await orderEditState?.getOrder(id);
            if (response?.data) {
                setOrder(response?.data);
            }
        })();
    }, [id]);

    useEffect(() => {
        if (order !== undefined) {
            if (!orderEditState?.editEnabled(Authority.P_MANAGER, order)) {
                navigate('/manager/orders/' + order.id + '/detail')
            }
        }
    }, [order]);

    return (
        <>
            {order === undefined &&
                <div className="flex flex-col justify-center items-center w-full">
                    <span className="loading loading-xl loading-spinner text-primary"></span>
                    <span className="text-xs">Upraviť objednávku...</span>
                </div>
            }
            {order !== undefined &&
                <>
                    <span
                        className="text-base font-bold text-center">Objednávka č.{formatNumber(order?.orderNumber)}</span>

                    <PageContent
                        toolBar={
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-primary mt-5"
                                    title="Pridať"
                                    disabled={orderEditState?.busy}
                                    onClick={async () => {
                                        navigate('/manager/orders/' + order.id + '/edit-item');
                                    }}
                                >
                                    <span className="icon-[lucide--file-plus] text-base"></span>
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
                                                            navigate('/manager/orders/' + order.id + '/edit-item/' + row.id);
                                                        }}
                                                    ><span className="icon-[lucide--edit] text-base"></span></button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-ghost btn-xs join-item"
                                                        title="Kopírovať"
                                                        disabled={orderEditState?.busy}
                                                        onClick={() => {
                                                            navigate({
                                                                pathname: '/manager/orders/' + order.id + '/edit-item/' + row.id,
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
        </>
    )
}
