import {useContext} from 'react';
import {NavLink} from 'react-router-dom';

import {AppContext} from '../../state';

const CookiesConsent = () => {
    const appState = useContext(AppContext);

    return (appState !== null && appState?.cookiesEnabled ? null :
            <div className="alert alert-info alert-soft">
                <span>Používame cookies, aby sme optimalizovali funkčnosť stránky.</span>
                <NavLink
                    className="link"
                    to="/cookies-info"
                >Dozvedieť sa viac.</NavLink>
                <button
                    className="btn btn-sm"
                    onClick={() => {
                        appState?.enableCookies();
                    }}
                >Povoliť cookies
                </button>
            </div>
    )
}

export default CookiesConsent;
