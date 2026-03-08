import {useContext, useEffect, useState} from 'react';
import * as applicationInfoApi from '../../api/client/application-info';
import * as configApi from '../../api/client/config';
import {AppContext, ErrorContext} from '../../state';
import type {CompanyInfo} from '../../api/model/porez';
import {App} from '../../api/model/porez';
import {NavLink} from 'react-router-dom';

const Footer = () => {
    const appState = useContext(AppContext);
    const errorState = useContext(ErrorContext);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>();

    useEffect(() => {
        let isMounted = true;

        const loadTitle = async () => {
            if (!isMounted) {
                return;
            }

            const response = await configApi.getApps();
            setTitle(response.data?.find(e => e.key === App.TITLE)?.value ?? '');
            setDescription(response.data?.find(e => e.key === App.DESCRIPTION)?.value ?? '');
            errorState?.addError?.(response.error);
        }

        const loadCompanyInfo = async () => {
            if (!isMounted) {
                return;
            }

            const response = await applicationInfoApi.getCompanyInfo();
            if (response?.data) setCompanyInfo(response.data);
            errorState?.addError?.(response.error);
        }

        void loadTitle();
        void loadCompanyInfo();

        return () => {
            isMounted = false;
        };
    }, [errorState]);

    return (
        <>
            <footer className="footer footer-horizontal p-2 bg-base-300">
                <aside className="flex flex-col justify-center items-center p-2">
                    <img
                        className="object-center w-31 h-12"
                        src={applicationInfoApi.getLogoPath()}
                        alt="Logo"
                    />
                    <div className="flex flex-col justify-center items-center w-full p-1">
                        <span className="text-center font-bold w-full">{title}</span>
                        <span className="text-center text-xs w-full">{description}</span>
                    </div>
                </aside>
                <nav>
                    <header className="footer-title">Užitočné odkazy</header>
                    <div className="grid grid-cols-1">
                        <NavLink className="link text-xs" to="/contact-info">Kontaktné Informácie</NavLink>
                        <NavLink className="link text-xs" to="/order-info">Ako vytvoriť objednávku</NavLink>
                        {!appState?.maintenance &&
                            <NavLink className="link text-xs" to="/application-files">Súbory na
                                stiahnutie</NavLink>
                        }
                    </div>
                </nav>
                <nav>
                    <header className="footer-title">Právne informácie</header>
                    <div className="grid grid-cols-1">
                        <NavLink className="link text-xs" to="/cookies-info">Cookies Informácie</NavLink>
                        <NavLink className="link text-xs" to="/gdpr-info">Gdpr Informácie</NavLink>
                        <NavLink className="link text-xs" to="/business-conditions">Obchodné
                            Podmienky</NavLink>
                    </div>
                </nav>
            </footer>
            <div className="flex flex-row justify-center items-center bg-base-300 text-gray-500 text-xs p-1 gap-1">
                <span className="icon-[lucide--globe] text-base"></span>
                <span>{companyInfo?.name},</span>
                <span>{companyInfo?.street},</span>
                <span>{companyInfo?.zipCode},</span>
                <span>{companyInfo?.city},</span>
                <span>{companyInfo?.state}</span>
                <span className="icon-[lucide--mail] text-base pl-1"></span>
                <span>{companyInfo?.mail}</span>
                <span className="icon-[lucide--phone] text-base pl-1"></span>
                <span>{companyInfo?.phone}</span>
            </div>
            <div className="py-2 bg-base-100 text-xs">
                <div className="container px-5 m-auto">
                    <div className="flex gap-1 justify-center">
                        <span>© 2026 Copyright:</span>
                        <a className="link" href="https://github.com/janobono">
                            <div className="flex items-center">
                                <span>janobono</span>
                                <span className="icon-[lucide--external-link] text-base"></span></div>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer;
