import MaintenanceDefender from '../component/layout/maintenance-defender';
import {NavLink} from 'react-router-dom';
import {getGdprInfo} from '../api/client/application-info';
import MdPage from '../component/layout/md-page';

const GdprInfoPage = () => {

    return (
        <MaintenanceDefender>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li><NavLink to="/gdpr-info">Gdpr Informácie</NavLink></li>
                </ul>
            </div>

            <MdPage getData={getGdprInfo}/>

        </MaintenanceDefender>
    );
};

export default GdprInfoPage;
