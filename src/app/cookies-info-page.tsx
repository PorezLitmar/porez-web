import MaintenanceDefender from '../component/layout/maintenance-defender';
import {NavLink} from 'react-router-dom';
import {getCookiesInfo} from '../api/client/application-info';
import MdPage from '../component/layout/md-page';

const CookiesInfoPage = () => {

    return (
        <MaintenanceDefender>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li><NavLink to="/cookies-info">Cookies Informácie</NavLink></li>
                </ul>
            </div>

            <MdPage getData={getCookiesInfo}/>

        </MaintenanceDefender>
    );
};

export default CookiesInfoPage;
