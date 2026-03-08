import MaintenanceDefender from '../component/layout/maintenance-defender';
import {NavLink} from 'react-router-dom';
import MdPage from '../component/layout/md-page';
import {getBusinessConditions} from '../api/client/application-info';

const BusinessConditionsPage = () => {

    return (
        <MaintenanceDefender>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li><NavLink to="/business-conditions">Obchodné Podmienky</NavLink></li>
                </ul>
            </div>

            <MdPage getData={getBusinessConditions}/>

        </MaintenanceDefender>
    );
};

export default BusinessConditionsPage;
