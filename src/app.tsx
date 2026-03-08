import {useContext, useEffect} from 'react';
import {AppContext} from './state';
import * as apiConfig from '././api/client/config';
import {App as AppEntry} from './api/model/porez';
import {BrowserRouter} from 'react-router-dom';
import ErrorInfo from './component/layout/error-info';
import CookiesConsent from './component/layout/cookies-consent';
import MaintenanceInfo from './component/layout/maintenance-info';
import AppPage from './app/app-page';
import Header from './component/layout/header';
import Footer from './component/layout/footer';

function App() {
    const appState = useContext(AppContext);

    useEffect(() => {
        let isMounted = true;

        const loadAppConfig = async () => {
            if (!isMounted) {
                return;
            }

            try {
                const response = await apiConfig.getApps();
                document.title = response.data?.find(e => e.key === AppEntry.TITLE)?.value ?? '';

                const el = document.querySelector('meta[name="description"]');
                el?.setAttribute('content', response.data?.find(e => e.key === AppEntry.DESCRIPTION)?.value ?? '');
            } catch (err) {
                console.error('Failed to load application properties:', err);
            }
        };

        void loadAppConfig();

        return () => {
            isMounted = false;
        };
    }, []);


    return (
        <div className="min-h-screen flex flex-col text-sm">
            {appState?.up ? (
                <BrowserRouter>
                    <ErrorInfo/>
                    <CookiesConsent/>
                    <MaintenanceInfo/>
                    <Header/>
                    <main className="flex flex-col items-center justify-start w-full grow min-h-0 gap-5 p-5">
                        <AppPage/>
                    </main>
                    <Footer/>
                </BrowserRouter>
            ) : (
                <div className=" flex grow items-center justify-center">
                    <div className=" flex flex-col justify-center items-center text-center">
                        <span className="loading loading-xl loading-spinner text-primary"></span>
                        <span>Kontrola spojenia...</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default App
