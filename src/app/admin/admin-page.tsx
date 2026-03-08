import {Outlet} from 'react-router-dom';
import AuthDefender from '../../component/layout/auth-defender';
import {Authority} from '../../api/model/porez';

const AdminPage = () => {
    return (
        <AuthDefender authority={Authority.P_ADMIN}>
            <Outlet/>
        </AuthDefender>
    )
}

export default AdminPage;