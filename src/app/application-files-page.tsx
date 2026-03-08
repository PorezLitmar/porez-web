import MaintenanceDefender from '../component/layout/maintenance-defender';
import {NavLink} from 'react-router-dom';
import {useContext, useEffect} from 'react';
import {ApplicationFileContext} from '../state';
import type {ApplicationFileInfo} from '../api/model/porez';
import PageContent from '../component/layout/page-content';
import Pageable from '../component/pageable';
import AuthDefender from '../component/layout/auth-defender';
import ApplicationFileProvider from '../state/application-file';

const ApplicationFilesPage = () => {

    return (
        <MaintenanceDefender>
            <AuthDefender>
                <div className="breadcrumbs text-sm w-full">
                    <ul>
                        <li><NavLink to="/">Domovská stránka</NavLink></li>
                        <li><NavLink to="/application-files">Súbory na stiahnutie</NavLink></li>
                    </ul>
                </div>

                <ApplicationFileProvider>
                    <ApplicationFilesPageContent/>
                </ApplicationFileProvider>
            </AuthDefender>
        </MaintenanceDefender>
    );
};

export default ApplicationFilesPage;

const ApplicationFilesPageContent = () => {
    const applicationFileState = useContext(ApplicationFileContext);

    useEffect(() => {
        let isMounted = true;

        const loadFiles = async () => {
            if (!applicationFileState || !isMounted) {
                return;
            }

            await applicationFileState.getApplicationInfoFiles();
        };

        void loadFiles();

        return () => {
            isMounted = false;
        };
    }, []);

    const downloadItem = async (item: ApplicationFileInfo) => {
        if (!item.id) return;
        const data = await applicationFileState?.getApplicationFile(item.id ?? '');
        if (data) {
            const fallbackName = item.fileName ?? item.label ?? 'download';
            const blobUrl = URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fallbackName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
        }
    }

    return (
        <PageContent
            pageNav={
                <Pageable
                    isPrevious={applicationFileState?.previous ?? false}
                    previousHandler={() => applicationFileState?.setPage(applicationFileState?.page - 1)}
                    page={(applicationFileState?.page ?? 0) + 1}
                    totalPages={applicationFileState?.totalPages ?? 0}
                    isNext={applicationFileState?.next ?? false}
                    nextHandler={() => applicationFileState?.setPage(applicationFileState?.page + 1)}
                    disabled={applicationFileState?.busy}
                />
            }
        >
            {applicationFileState?.data?.length === 0 && !applicationFileState?.busy ? (
                <div className="w-full flex flex-col items-center justify-center py-10 text-base-content/60">
                    <span className="icon-[lucide--inbox] text-3xl"></span>
                    <div className="mt-2">Žiadne súbory na stiahnutie</div>
                </div>
            ) : (
                <ul className="w-full flex flex-col gap-3">
                    {applicationFileState?.data?.map(item => (
                        <li
                            key={item.id}
                            className="w-full flex flex-row items-center justify-between gap-3 p-3 rounded-lg border border-base-300"
                        >
                            <div className="flex flex-row items-start gap-3">
                                <span className="icon-[lucide--file] text-lg text-base-content/70"></span>
                                <div className="flex flex-col">
                                    <span className="font-medium">{item.label ?? item.fileName ?? 'Súbor'}</span>
                                    <div className="text-sm text-base-content/70">
                                        {item.fileName ?? '-'}
                                    </div>
                                    {item.fileType && (
                                        <div className="text-xs text-base-content/60">{item.fileType}</div>
                                    )}
                                </div>
                            </div>
                            <button
                                className="btn btn-primary mt-5"
                                type="button"
                                disabled={applicationFileState?.busy}
                                onClick={() => void downloadItem(item)}
                            ><span className="icon-[lucide--file-down] text-xl"></span>Stiahnuť
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </PageContent>
    )
}
