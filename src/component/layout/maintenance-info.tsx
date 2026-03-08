import {useContext} from 'react';

import {AppContext} from '../../state';

const MaintenanceInfo = () => {
    const appState = useContext(AppContext);

    return (
        appState?.maintenance &&
        <div className="alert alert-warning alert-soft">
            <span>Ľutujeme. Prebieha údržba. Skúste neskor prosím.</span>
        </div>
    )
}

export default MaintenanceInfo;
