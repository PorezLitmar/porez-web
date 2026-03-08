import {NavLink, useParams} from 'react-router-dom';
import {AppContext, AuthContext, OrderEditContext} from '../../state';
import {useContext, useEffect, useState} from 'react';
import OrderEditProvider from '../../state/order-edit';
import {type Order, Unit} from '../../api/model/porez';
import {formatNumber, formatStringDate, formatStringDateTime, getEnumValue, parseStringArray} from '../../component';
import Tabs from '../../component/tabs';
import OrderCommentDialog from '../../component/order/order-comment-dialog';
import OrderUserValue from '../../component/order/order-user-value';

const CustomerOrderDetailPage = () => {
    const {id} = useParams();

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li><NavLink to="/customer/orders">Moje objednávky</NavLink></li>
                    <li><NavLink to={`/customer/orders/${id}/detail`}>Detail objednávky</NavLink></li>
                </ul>
            </div>

            <OrderEditProvider>
                <OrderDetailPageContent id={id ?? ''}/>
            </OrderEditProvider>
        </>
    );
};

export default CustomerOrderDetailPage;

const OrderDetailPageContent = ({id}: { id: string }) => {
    const appState = useContext(AppContext);
    const authState = useContext(AuthContext);
    const orderEditState = useContext(OrderEditContext);

    const [order, setOrder] = useState<Order>();

    const [detail, setDetail] = useState('');
    const [csv, setCsv] = useState<string>('');
    const [csvUrl, setCsvUrl] = useState<string>();

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
                                <th>Číslo objednávky</th>
                                <th>Dátum a čas vytvorenia</th>
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
                                <td>{formatNumber(order?.orderNumber)}</td>
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
                                node: <div className="w-full overflow-auto flex flex-col min-h-0">
                                    <iframe
                                        title="Order detail"
                                        className="w-full grow min-h-96"
                                        sandbox=""
                                        srcDoc={detail}>
                                    </iframe>
                                </div>
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
