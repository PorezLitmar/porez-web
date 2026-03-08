import MaintenanceDefender from '../component/layout/maintenance-defender';
import {NavLink} from 'react-router-dom';
import {getOrderInfo} from '../api/client/application-info';
import MdPage from '../component/layout/md-page';

const OrderInfoPage = () => {

    return (
        <MaintenanceDefender>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li><NavLink to="/order-info">Ako vytvoriť objednávku</NavLink></li>
                </ul>
            </div>

            <MdPage getData={getOrderInfo}/>

        </MaintenanceDefender>
    );
};

export default OrderInfoPage;
