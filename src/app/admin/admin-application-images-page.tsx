import {NavLink} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import {ApplicationImageContext, DialogContext} from '../../state';
import type {ApplicationImageInfo} from '../../api/model/porez';
import PageContent from '../../component/layout/page-content';
import Pageable from '../../component/pageable';
import Table from '../../component/table';
import {DialogAnswer, DialogType} from '../../state/dialog/model';
import ApplicationImageProvider from '../../state/application-image';
import ImageDialog from '../../component/dialog/image-dialog';

const ADMIN_APPLICATION_IMAGES_DIALOG_ID = 'admin-application-images-dialog-001';

const AdminApplicationImagesPage = () => {

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Správca</li>
                    <li><NavLink to="/admin/application-images">Aplikačné obrázky</NavLink></li>
                </ul>
            </div>

            <ApplicationImageProvider>
                <AdminApplicationImagesPageContent/>
            </ApplicationImageProvider>
        </>
    );
};

export default AdminApplicationImagesPage;

const AdminApplicationImagesPageContent = () => {
    const applicationImageState = useContext(ApplicationImageContext);
    const dialogState = useContext(DialogContext);

    const [selected, setSelected] = useState<ApplicationImageInfo>();
    const [showItemDialog, setShowItemDialog] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadImages = async () => {
            if (!applicationImageState || !isMounted) {
                return;
            }

            await applicationImageState.getApplicationInfoImages();
        };

        void loadImages();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <PageContent
                pageNav={
                    <Pageable
                        isPrevious={applicationImageState?.previous ?? false}
                        previousHandler={() => applicationImageState?.setPage(applicationImageState?.page - 1)}
                        page={(applicationImageState?.page ?? 0) + 1}
                        totalPages={applicationImageState?.totalPages ?? 0}
                        isNext={applicationImageState?.next ?? false}
                        nextHandler={() => applicationImageState?.setPage(applicationImageState?.page + 1)}
                        disabled={applicationImageState?.busy}
                    />
                }
            >
                <Table
                    fields={['rn', 'fileName', 'thumbnail', 'actions']}
                    tableHeaderColumn={(field) => {
                        switch (field) {
                            case 'rn':
                                return (<th key={field}></th>);
                            case 'fileName':
                                return (<th key={field}>Názov</th>);
                            case 'thumbnail':
                                return (<th key={field}>Náhľad</th>);
                            case 'actions':
                                return (
                                    <th key={field}>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm btn-circle"
                                            disabled={applicationImageState?.busy}
                                            onClick={() => {
                                                setSelected(undefined);
                                                setShowItemDialog(true);
                                            }}
                                        ><span className="icon-[lucide--file-plus] text-base"></span>
                                        </button>
                                    </th>
                                );
                        }
                    }}
                    rows={applicationImageState?.data ?? []}
                    tableRowKey={(row) => `${row.id}`}
                    tableRowColumn={
                        (field, row, rowIndex) => {
                            switch (field) {
                                case 'rn':
                                    return (<th key={field}>{`${rowIndex + 1}`}</th>);
                                case 'fileName':
                                    return (
                                        <td key={field}>
                                            <div className="flex flex-row w-full items-center gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-xs"
                                                    disabled={applicationImageState?.busy}
                                                    onClick={() => {
                                                        setSelected(row);
                                                        setShowItemDialog(true);
                                                    }}
                                                ><span className="icon-[lucide--edit] text-base"></span></button>
                                                <span>{row.fileName}</span>
                                            </div>
                                        </td>
                                    );
                                case 'thumbnail':
                                    return (
                                        <td key={field}>
                                            <div className="flex flex-row w-full items-center gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-xs"
                                                    disabled={applicationImageState?.busy}
                                                    onClick={() => navigator.clipboard.writeText(
                                                        window.location.href.replace('admin', 'api') + '/' + row.id)}
                                                ><span className="icon-[lucide--link] text-base"></span></button>
                                                <img
                                                    className="object-center w-12 h-12"
                                                    src={row.thumbnail}
                                                    alt={row.fileName}
                                                />
                                            </div>
                                        </td>
                                    );
                                case 'actions':
                                    return (
                                        <td key={field}>
                                            <button
                                                className="btn btn-accent btn-xs"
                                                type="button"
                                                disabled={applicationImageState?.busy}
                                                onClick={() => {
                                                    dialogState?.showDialog({
                                                        type: DialogType.YES_NO,
                                                        title: 'Zmazať obrázok',
                                                        message: `Naozaj si želáte zmazať obrázok? [${row.fileName}]`,
                                                        callback: (answer: DialogAnswer) => {
                                                            if (answer === DialogAnswer.YES) {
                                                                void applicationImageState?.deleteApplicationImage(row.id ?? '');
                                                            }
                                                        }
                                                    });
                                                }}
                                            ><span className="icon-[lucide--trash] text-base"></span></button>
                                        </td>
                                    )
                            }
                        }
                    }
                />
            </PageContent>

            {showItemDialog && <ImageDialog
                dialogId={ADMIN_APPLICATION_IMAGES_DIALOG_ID}
                showDialog={showItemDialog}
                okHandler={(file) => {
                    if (!selected) {
                        applicationImageState?.addApplicationImage(file);
                    } else {
                        applicationImageState?.setApplicationImage(selected?.id ?? '', file);
                    }
                    setShowItemDialog(false);
                }}
                cancelHandler={() => setShowItemDialog(false)}
            />
            }
        </>
    )
}
