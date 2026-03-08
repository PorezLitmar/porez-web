import type {ReactNode} from 'react';
import {useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {AppContext, AuthContext} from '../../state';

const MaintenanceDefender = ({children}: { children?: ReactNode }) => {
    const navigate = useNavigate();
    const authState = useContext(AuthContext);
    const appState = useContext(AppContext);

    useEffect(() => {
        if (appState?.maintenance && !(authState?.adminAuthority || authState?.managerAuthority)) {
            navigate('/maintenance');
        }
    }, [
        navigate,
        appState?.maintenance,
        authState?.adminAuthority,
        authState?.managerAuthority
    ]);

    return (
        <>
            {children}
        </>
    )
}

export default MaintenanceDefender;
