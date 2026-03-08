import type {ReactNode} from 'react';
import {useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Authority} from '../../api/model/porez';
import {AuthContext} from '../../state';

type Props = {
    children?: ReactNode;
    authority?: Authority;
};

const hasRequiredAuthority = (
    auth: {
        adminAuthority?: boolean;
        managerAuthority?: boolean;
        employeeAuthority?: boolean;
        customerAuthority?: boolean;
    },
    required?: Authority
) => {
    if (!required) return true;
    switch (required) {
        case Authority.P_ADMIN:
            return !!auth.adminAuthority;
        case Authority.P_MANAGER:
            return !!auth.adminAuthority || !!auth.managerAuthority;
        case Authority.P_EMPLOYEE:
            return (
                !!auth.adminAuthority ||
                !!auth.managerAuthority ||
                !!auth.employeeAuthority
            );
        case Authority.P_CUSTOMER:
            return (
                !!auth.adminAuthority ||
                !!auth.managerAuthority ||
                !!auth.employeeAuthority ||
                !!auth.customerAuthority
            );
        default:
            return false;
    }
};

const AuthDefender = ({children, authority}: Props) => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    useEffect(() => {
        if (!auth) return;

        if (auth.busy) return;

        if (auth.timeToAccessExpiration === 0) {
            navigate('/');
            return;
        }

        // Check role
        if (!hasRequiredAuthority(auth, authority)) {
            navigate('/');
        }
    }, [
        navigate,
        authority,
        auth?.busy,
        auth?.timeToAccessExpiration,
        auth?.adminAuthority,
        auth?.managerAuthority,
        auth?.employeeAuthority,
        auth?.customerAuthority,
    ]);

    if (auth?.busy) return null;

    return <>{children}</>;
};

export default AuthDefender;
