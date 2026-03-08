import MaintenanceDefender from '../component/layout/maintenance-defender';
import {NavLink} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import {ErrorContext} from '../state';
import type {CompanyInfo} from '../api/model/porez';
import * as applicationInfoApi from '../api/client/application-info';
import MarkdownRenderer from '../component/markdown-renderer.tsx';

const ContactInfoPage = () => {

    return (
        <MaintenanceDefender>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li><NavLink to="/contact-info">Kontaktné Informácie</NavLink></li>
                </ul>
            </div>

            <ContactInfoPageContent/>
        </MaintenanceDefender>
    );
};

export default ContactInfoPage;

const ContactInfoPageContent = () => {
    const errorState = useContext(ErrorContext);

    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>();
    const [workingHours, setWorkingHours] = useState<string>();

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (!isMounted) {
                return;
            }

            {
                const response = await applicationInfoApi.getCompanyInfo();
                if (response?.data) setCompanyInfo(response.data);
                if (response?.error) errorState?.addError?.(response.error);
            }

            {
                const response = await applicationInfoApi.getWorkingHours();
                if (response?.data) setWorkingHours(response.data?.value);
                if (response?.error) errorState?.addError?.(response.error);
            }
        };

        void loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <div className="grid grid-cols-2 gap-2 w-full">
                <div>
                    {(companyInfo?.mapUrl ?? '').length > 0 ?
                        <div className="border border-base-300 rounded flex flex-row h-full p-2 ">
                            <div className="flex flex-col w-full">
                                <iframe
                                    title="contact-info-frame"
                                    width="100%"
                                    height="380px"
                                    src={companyInfo?.mapUrl}
                                    className="border-0">
                                </iframe>
                            </div>
                        </div>
                        : <></>}
                </div>
                <div className="border border-base-300 rounded flex flex-row h-full p-2 ">
                    <div className="flex flex-col w-full">
                        <MarkdownRenderer className="prose prose-sm" md={workingHours}/>
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-full">
                <div className="border border-base-300 rounded">
                    <div
                        className="flex flex-col w-full justify-center text-center text-xs h-full p-2 ">
                        <p>{companyInfo?.commercialRegisterInfo ?? ''}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full">
                <div className="border border-base-300 rounded flex flex-row h-full w-full p-2 ">
                    {(companyInfo?.businessId ?? '').length > 0 ?
                        <p>
                            <span className="text-xs">IČO:</span>
                            <span> </span>
                            <span className="text-xs">{companyInfo?.businessId}</span>
                        </p>
                        : <></>}
                </div>
                <div className="border border-base-300 rounded flex flex-row h-full w-full p-2 ">
                    {(companyInfo?.taxId ?? '').length > 0 ?
                        <p>
                            <span className="text-xs">DIČ:</span>
                            <span> </span>
                            <span className="text-xs">{companyInfo?.taxId}</span>
                        </p>
                        : <></>}
                </div>
                <div className="border border-base-300 rounded flex flex-row h-full w-full p-2 ">
                    {(companyInfo?.vatRegNo ?? '').length > 0 ?
                        <p>
                            <span className="text-xs">IČ DPH:</span>
                            <span> </span>
                            <span className="text-xs">{companyInfo?.vatRegNo}</span>
                        </p>
                        : <></>}
                </div>
            </div>
        </>
    )
}
