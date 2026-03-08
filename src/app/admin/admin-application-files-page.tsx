import {NavLink} from 'react-router-dom';
import {type SubmitEvent, useContext, useEffect, useState} from 'react';
import {ApplicationFileContext, DialogContext} from '../../state';
import type {ApplicationFileInfo} from '../../api/model/porez';
import PageContent from '../../component/layout/page-content';
import Table from '../../component/table';
import Pageable from '../../component/pageable';
import BaseDialog from '../../component/dialog/base-dialog';
import FormInput from '../../component/form/form-input';
import {createPortal} from 'react-dom';
import FormFileInput from '../../component/form/form-file-input';
import {isBlank} from '../../component';
import {DialogAnswer, DialogType} from '../../state/dialog/model';
import ApplicationFileProvider from '../../state/application-file';

const ADMIN_APPLICATION_FILES_DIALOG_ID = 'admin-application-files-dialog-001';

const AdminApplicationFilesPage = () => {

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Správca</li>
                    <li><NavLink to="/admin/application-files">Súbory na stiahnutie</NavLink></li>
                </ul>
            </div>

            <ApplicationFileProvider>
                <AdminApplicationFilesPageContent/>
            </ApplicationFileProvider>
        </>
    );
};

export default AdminApplicationFilesPage;

const AdminApplicationFilesPageContent = () => {
    const applicationFileState = useContext(ApplicationFileContext);
    const dialogState = useContext(DialogContext);

    const [selected, setSelected] = useState<ApplicationFileInfo>();
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showLabelDialog, setShowLabelDialog] = useState(false);
    const [showDataDialog, setShowDataDialog] = useState(false);

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

    return (
        <>
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
                <Table
                    fields={['rn', 'label', 'fileName', 'actions']}
                    tableHeaderColumn={(field) => {
                        switch (field) {
                            case 'rn':
                                return (<th key={field}></th>);
                            case 'label':
                                return (<th key={field}>Popiska</th>);
                            case 'fileName':
                                return (<th key={field}>Súbor</th>);
                            case 'actions':
                                return (
                                    <th key={field}>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm btn-circle"
                                            disabled={applicationFileState?.busy}
                                            onClick={() => {
                                                setSelected(undefined);
                                                setShowAddDialog(true);
                                            }}
                                        ><span className="icon-[lucide--file-plus] text-base"></span>
                                        </button>
                                    </th>
                                );
                        }
                    }}
                    rows={applicationFileState?.data ?? []}
                    tableRowKey={(row) => `${row.id}`}
                    tableRowColumn={
                        (field, row, rowIndex) => {
                            switch (field) {
                                case 'rn':
                                    return (<th key={field}>{`${rowIndex + 1}`}</th>);
                                case 'label':
                                    return (
                                        <td key={field}>
                                            <div className="flex flex-row w-full items-center gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-xs"
                                                    disabled={applicationFileState?.busy}
                                                    onClick={() => {
                                                        setSelected(row);
                                                        setShowLabelDialog(true);
                                                    }}
                                                ><span className="icon-[lucide--edit] text-base"></span></button>
                                                <span>{row.label}</span>
                                            </div>
                                        </td>
                                    );
                                case 'fileName':
                                    return (
                                        <td key={field}>
                                            <div className="flex flex-row w-full items-center gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-xs"
                                                    disabled={applicationFileState?.busy}
                                                    onClick={() => {
                                                        setSelected(row);
                                                        setShowDataDialog(true);
                                                    }}
                                                ><span className="icon-[lucide--edit] text-base"></span></button>
                                                <span>{row.fileName}</span>
                                            </div>
                                        </td>
                                    );
                                case 'actions':
                                    return (
                                        <td key={field}>
                                            <button
                                                className="btn btn-accent btn-xs"
                                                type="button"
                                                disabled={applicationFileState?.busy}
                                                onClick={() => {
                                                    dialogState?.showDialog({
                                                        type: DialogType.YES_NO,
                                                        title: 'Zmazať súbor na stiahnutie',
                                                        message: `Naozaj si želáte zmazať súbor na stiahnutie? [${row.label}]`,
                                                        callback: (answer: DialogAnswer) => {
                                                            if (answer === DialogAnswer.YES) {
                                                                void applicationFileState?.deleteApplicationFile(row.id ?? '');
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

            {showAddDialog && <ApplicationFileAddDialog
                showDialog={showAddDialog}
                okHandler={(label, file) => {
                    applicationFileState?.addApplicationFile(label, file);
                    setShowAddDialog(false);
                }}
                cancelHandler={() => setShowAddDialog(false)}
            />
            }

            {showLabelDialog && selected && <ApplicationFileLabelDialog
                selected={selected}
                showDialog={showLabelDialog}
                okHandler={(id, label) => {
                    applicationFileState?.setApplicationFileLabel(id, label);
                    setShowLabelDialog(false);
                }}
                cancelHandler={() => setShowLabelDialog(false)}
            />
            }

            {showDataDialog && selected && <ApplicationFileDataDialog
                selected={selected}
                showDialog={showDataDialog}
                okHandler={(id, file) => {
                    applicationFileState?.setApplicationFileData(id, file);
                    setShowDataDialog(false);
                }}
                cancelHandler={() => setShowDataDialog(false)}
            />
            }

        </>
    )
}

const ApplicationFileAddDialog = ({showDialog, okHandler, cancelHandler}: {
    showDialog: boolean,
    okHandler: (label: string, file: File) => void,
    cancelHandler: () => void
}) => {
    const dialogState = useContext(DialogContext);

    const [label, setLabel] = useState('');
    const [labelError, setLabelError] = useState<string>();

    const [file, setFile] = useState<File>();
    const [fileError, setFileError] = useState<string>();

    const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLabelError(undefined);
        setFileError(undefined);

        if (isBlank(label)) {
            setLabelError('Vyžaduje sa popiska');
        }

        if (!file) {
            setFileError('Vyžaduje sa súbor');
        }

        if (isBlank(label) || !file) return;

        okHandler(label, file);
    }

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog id={ADMIN_APPLICATION_FILES_DIALOG_ID} showDialog={showDialog} closeHandler={cancelHandler}>
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">Súbor na stiahnutie</div>
                </div>

                <form
                    className="flex flex-col justify-center items-center w-full max-w-md"
                    onSubmit={onSubmit}
                    noValidate
                >
                    <FormInput
                        name="label"
                        label="Popiska"
                        placeholder="Zadajte popisku"
                        value={label}
                        error={labelError}
                        onChange={event => setLabel(event.target.value)}
                    />

                    <FormFileInput
                        legend="Vyberte súbor"
                        label="Maximálna veľkosť 10MB"
                        error={fileError}
                        onFileSelected={f => setFile(f)}
                    />

                    <div className="join mt-5">
                        <button
                            type="submit"
                            className="btn btn-primary join-item"
                        >Potvrdiť
                        </button>
                        <button
                            type="button"
                            className="btn btn-accent join-item"
                            onClick={cancelHandler}
                        >Zrušiť
                        </button>
                    </div>
                </form>
            </div>
        </BaseDialog>
        , dialogState.modalRoot))
}

const ApplicationFileLabelDialog = ({selected, showDialog, okHandler, cancelHandler}: {
    selected: ApplicationFileInfo,
    showDialog: boolean,
    okHandler: (id: string, label: string) => void,
    cancelHandler: () => void
}) => {
    const dialogState = useContext(DialogContext);

    const [label, setLabel] = useState(selected.label ?? '');
    const [labelError, setLabelError] = useState<string>();

    const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLabelError(undefined);

        if (isBlank(label)) {
            setLabelError('Vyžaduje sa popiska');
            return;
        }

        okHandler(selected?.id ?? '', label);
    }

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog id={ADMIN_APPLICATION_FILES_DIALOG_ID} showDialog={showDialog} closeHandler={cancelHandler}>
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">Popiska</div>
                </div>

                <form
                    className="flex flex-col justify-center items-center w-full max-w-md"
                    onSubmit={onSubmit}
                    noValidate
                >
                    <FormInput
                        name="label"
                        label="Popiska"
                        placeholder="Zadajte popisku"
                        value={label}
                        error={labelError}
                        onChange={event => setLabel(event.target.value)}
                    />

                    <div className="join mt-5">
                        <button
                            type="submit"
                            className="btn btn-primary join-item"
                        >Potvrdiť
                        </button>
                        <button
                            type="button"
                            className="btn btn-accent join-item"
                            onClick={cancelHandler}
                        >Zrušiť
                        </button>
                    </div>
                </form>
            </div>
        </BaseDialog>
        , dialogState.modalRoot))
}

const ApplicationFileDataDialog = ({selected, showDialog, okHandler, cancelHandler}: {
    selected: ApplicationFileInfo,
    showDialog: boolean,
    okHandler: (id: string, file: File) => void,
    cancelHandler: () => void
}) => {
    const dialogState = useContext(DialogContext);

    const [file, setFile] = useState<File>();
    const [fileError, setFileError] = useState<string>();

    const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFileError(undefined);

        if (!file) {
            setFileError('Vyžaduje sa súbor');
            return;
        }

        okHandler(selected.id ?? '', file);
    }

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog id={ADMIN_APPLICATION_FILES_DIALOG_ID} showDialog={showDialog} closeHandler={cancelHandler}>
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">Súbor {selected.label ?? ''}</div>
                </div>

                <form
                    className="flex flex-col justify-center items-center w-full max-w-md"
                    onSubmit={onSubmit}
                    noValidate
                >
                    <FormFileInput
                        legend="Vyberte súbor"
                        label="Maximálna veľkosť 10MB"
                        error={fileError}
                        onFileSelected={f => setFile(f)}
                    />

                    <div className="join mt-5">
                        <button
                            type="submit"
                            className="btn btn-primary join-item"
                        >Potvrdiť
                        </button>
                        <button
                            type="button"
                            className="btn btn-accent join-item"
                            onClick={cancelHandler}
                        >Zrušiť
                        </button>
                    </div>
                </form>
            </div>
        </BaseDialog>
        , dialogState.modalRoot))
}
