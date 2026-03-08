import type {ChangeEvent} from 'react';
import {useContext, useEffect, useState} from 'react';
import {AppContext, AuthContext, ErrorContext} from '../../state';
import {App} from '../../api/model/porez';
import * as configApi from '../../api/client/config';
import {NavLink} from 'react-router-dom';

const Header = () => {
    const appState = useContext(AppContext);
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [title, setTitle] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadTitle = async () => {
            if (!isMounted) {
                return;
            }

            const response = await configApi.getApps();
            setTitle(response.data?.find(e => e.key === App.TITLE)?.value ?? '');
            errorState?.addError?.(response.error);
        };

        void loadTitle();

        return () => {
            isMounted = false;
        };
    }, [errorState]);

    const handleMaintenanceToggle = (event: ChangeEvent<HTMLInputElement>) => {
        if (!appState) return;
        appState.setMaintenance(event.currentTarget.checked, authState?.accessToken).then();
    };

    return (
        <nav className="navbar bg-base-300 relative z-50">
            <div className="flex-1">
                <div className="flex flex-col lg:flex-row gap-2">
                    <NavLink className="btn btn-ghost text-xl" to="/">{title}</NavLink>
                    {(authState?.adminAuthority || authState?.managerAuthority) &&
                        <label className="label">
                            <input
                                type="checkbox"
                                className="toggle toggle-warning"
                                checked={Boolean(appState?.maintenance)}
                                onChange={handleMaintenanceToggle}
                            />
                            <span>Režim údržby</span>
                        </label>
                    }
                </div>
            </div>

            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    {authState?.adminAuthority &&
                        <li className="dropdown dropdown-end">
                            <div tabIndex={0} className="btn btn-ghost">
                                <span className="icon-[eos-icons--admin-outlined] text-base"></span>
                                <span>Správca</span>
                            </div>
                            <ul tabIndex={0}
                                className="dropdown-content menu bg-base-100 rounded-box p-2 text-xs shadow z-[999] w-40">
                                <li><NavLink to="/admin/users">Používatelia</NavLink></li>
                                <li><NavLink to="/admin/free-days">Voľné dni</NavLink></li>
                                <li><NavLink to="/admin/application-files">Súbory na stiahnutie</NavLink></li>
                                <li><NavLink to="/admin/application-images">Aplikačné obrázky</NavLink></li>
                                <li><NavLink to="/admin/application-settings">Nastavenia aplikácie</NavLink></li>
                                <li><NavLink to="/admin/company-info">Informácie o spoločnosti</NavLink></li>
                                <li><NavLink to="/admin/mail-formats">Emailové správy</NavLink></li>
                                <li><NavLink to="/admin/text-info">Textové informácie</NavLink></li>
                                <li><NavLink to="/admin/csv-settings">CSV parametre</NavLink></li>
                                <li><NavLink to="/admin/html-settings">HTML parametre</NavLink></li>
                                <li><NavLink to="/admin/numeric-settings">Číselné parametre</NavLink></li>
                                <li><NavLink to="/admin/string-settings">Textové parametre</NavLink></li>
                            </ul>
                        </li>
                    }

                    {authState?.managerAuthority &&
                        <li className="dropdown dropdown-end">
                            <div tabIndex={0} className="btn btn-ghost">
                                <span className="icon-[lucide--user-star] text-base"></span>
                                <span>Manažér</span>
                            </div>
                            <ul tabIndex={0}
                                className="dropdown-content menu bg-base-100 rounded-box p-2 text-xs shadow z-[999] w-40">
                                <li><NavLink to="/manager/orders">Objednávky</NavLink></li>
                                <li><NavLink to="/manager/boards">Dosky</NavLink></li>
                                <li><NavLink to="/manager/edges">Hrany</NavLink></li>
                                <li><NavLink to="/manager/categories">Kategórie</NavLink></li>
                                <li><NavLink to="/manager/price-lists">Cenníky</NavLink></li>
                            </ul>
                        </li>
                    }

                    {!appState?.maintenance && authState?.employeeAuthority &&
                        <li>
                            <NavLink className="btn btn-ghost" to="/employee/orders">
                                <span className="icon-[lucide--user-cog] text-base"></span>
                                <span>Zamestnanec</span>
                            </NavLink>
                        </li>
                    }

                    {!appState?.maintenance && authState?.customerAuthority &&
                        <>
                            <li>
                                <NavLink className="btn btn-ghost" to="/customer/orders">
                                    <span className="icon-[lucide--package-check] text-base"></span>
                                    <span>Moje objednávky</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className="btn btn-ghost" to="/customer/order">
                                    <span className="icon-[lucide--shopping-basket] text-base"></span>
                                    <span>Objednávka</span>
                                </NavLink>
                            </li>
                        </>
                    }

                    <li className="dropdown dropdown-end">
                        <div tabIndex={0} className="btn btn-ghost">
                            <span className="icon-[lucide--user-round] text-base"></span>
                            <span>Používateľ</span>
                        </div>
                        <ul tabIndex={0}
                            className="dropdown-content menu bg-base-100 rounded-box p-2 text-xs shadow z-[999] w-40">
                            {!appState?.maintenance && (authState?.adminAuthority || authState?.managerAuthority || authState?.employeeAuthority || authState?.customerAuthority) &&
                                <>
                                    <li><NavLink to="/auth/change-profile">Detaily účtu</NavLink></li>
                                    <li><NavLink to="/auth/change-password">Zmeniť heslo</NavLink></li>
                                    <li><NavLink to="/auth/change-email">Zmeniť email</NavLink></li>
                                </>
                            }
                            {authState?.user != undefined &&
                                <li>
                                    <button onClick={() => authState?.signOut()}>Odhlásiť</button>
                                </li>
                            }
                            {authState?.user == undefined &&
                                <li><NavLink to="/auth/sign-in">Prihlásiť</NavLink></li>
                            }
                            {!appState?.maintenance && authState?.user == undefined &&
                                <>
                                    <li><NavLink to="/auth/sign-up">Zaregistrovať</NavLink></li>
                                    <li><NavLink to="/auth/reset-password">Obnovenie hesla</NavLink></li>
                                </>
                            }
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Header;
