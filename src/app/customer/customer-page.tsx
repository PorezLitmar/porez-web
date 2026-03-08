import {Outlet} from 'react-router-dom';
import AuthDefender from '../../component/layout/auth-defender';
import {Authority} from '../../api/model/porez';

const CustomerPage = () => {
    return (
        <AuthDefender authority={Authority.P_CUSTOMER}>
            <Outlet/>
        </AuthDefender>
    )
}

export default CustomerPage;