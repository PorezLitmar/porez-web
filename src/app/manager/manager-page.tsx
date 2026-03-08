import {Outlet} from 'react-router-dom';
import AuthDefender from '../../component/layout/auth-defender';
import {Authority} from '../../api/model/porez';

const ManagerPage = () => {
    return (
        <AuthDefender authority={Authority.P_MANAGER}>
            <Outlet/>
        </AuthDefender>
    )
}

export default ManagerPage;