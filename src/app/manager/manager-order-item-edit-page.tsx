import {NavLink, useLocation, useNavigate, useParams} from 'react-router-dom';
import {useMemo, useState} from 'react';
import CodeListProvider from '../../state/code-list';
import CodeListItemProvider from '../../state/code-list-item';
import CategoryProvider from '../../state/category';
import BoardProvider from '../../state/board';
import EdgeProvider from '../../state/edge';
import OrderItemEditor from '../../component/order/order-item-editor';

function useQuery() {
    const {search} = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

const ManagerOrderItemEditPage = () => {
    const navigate = useNavigate();

    const {id} = useParams();
    const {itemId} = useParams();
    const query = useQuery();

    const [initInProgress, setInitInProgress] = useState(true);
    const [submitInProgress, setSubmitInProgress] = useState(false);

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Manažér</li>
                    <li><NavLink to="/manager/orders">Objednávky</NavLink></li>
                    <li><NavLink to={`/manager/orders/${id}/edit`}>Upraviť objednávku</NavLink></li>
                    <li><NavLink to={
                        query.get('mode') === 'copy' ?
                            {
                                pathname: '/manager/orders/' + id + '/edit-item' + (itemId !== undefined ? '/' + itemId : ''),
                                search: '?mode=copy'
                            }
                            :
                            '/manager/orders/' + id + '/edit-item' + (itemId !== undefined ? '/' + itemId : '')
                    }
                    >Upraviť položku objednávky</NavLink></li>
                </ul>
            </div>

            {initInProgress &&
                <div className=" flex flex-col justify-center items-center text-center">
                    <span className="loading loading-xl loading-spinner text-primary"></span>
                    <span>Inicializácia položky...</span>
                </div>
            }

            {submitInProgress &&
                <div className=" flex flex-col justify-center items-center text-center">
                    <span className="loading loading-xl loading-spinner text-primary"></span>
                    <span>Odosielanie položky...</span>
                </div>
            }

            <CodeListProvider>
                <CodeListItemProvider>
                    <CategoryProvider>
                        <BoardProvider>
                            <EdgeProvider>
                                <OrderItemEditor
                                    orderId={id ?? ''}
                                    itemId={itemId}
                                    copy={query.get('mode') === 'copy'}
                                    setInitInProgress={setInitInProgress}
                                    setSubmitInProgress={setSubmitInProgress}
                                    afterSubmitNavigationHandler={() => navigate('/manager/orders/' + id + '/edit')}
                                />
                            </EdgeProvider>
                        </BoardProvider>
                    </CategoryProvider>
                </CodeListItemProvider>
            </CodeListProvider>
        </>
    );
};

export default ManagerOrderItemEditPage;
