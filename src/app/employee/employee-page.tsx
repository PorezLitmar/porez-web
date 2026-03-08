import {Outlet} from 'react-router-dom';
import AuthDefender from '../../component/layout/auth-defender';
import {Authority} from '../../api/model/porez';

const EmployeePage = () => {
    return (
        <AuthDefender authority={Authority.P_EMPLOYEE}>
            <Outlet/>
        </AuthDefender>
    )
}

export default EmployeePage;