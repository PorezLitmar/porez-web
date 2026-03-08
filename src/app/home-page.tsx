import {useContext, useEffect, useState} from 'react';
import MarkdownRenderer from '../component/markdown-renderer';
import {ErrorContext} from '../state';
import * as apiApplicationInfo from "../api/client/application-info";
import MaintenanceDefender from '../component/layout/maintenance-defender';

const HomePage = () => {
    const errorState = useContext(ErrorContext);

    const [welcomeText, setWelcomeText] = useState<string>();
    const [applicationInfo, setApplicationInfo] = useState<string[]>();

    useEffect(() => {
        const loadWelcomeText = async () => {
            const response = await apiApplicationInfo.getWelcomeText();
            if (response?.data) setWelcomeText(response.data?.value);
            if (response?.error) errorState?.addError?.(response.error);
        };

        const loadApplicationInfo = async () => {
            const response = await apiApplicationInfo.getApplicationInfo();
            if (response?.data) setApplicationInfo(response.data);
            if (response?.error) errorState?.addError?.(response.error);
        };

        loadWelcomeText().then();
        loadApplicationInfo().then();
    }, [errorState]);

    return (
        <MaintenanceDefender>
            <div className="flex flex-col justify-center items-start px-2 w-full">
                <MarkdownRenderer
                    className="prose max-w-none w-full"
                    md={welcomeText}
                />

                <div className="grid grid-cols-3 gap-5 w-full">
                    {applicationInfo?.map((item, index) =>
                        <MarkdownRenderer
                            key={index}
                            className="prose prose-sm"
                            md={item}/>
                    )}
                </div>
            </div>
        </MaintenanceDefender>
    )
}

export default HomePage;
