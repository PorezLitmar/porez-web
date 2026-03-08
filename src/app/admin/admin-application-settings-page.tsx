import {NavLink} from 'react-router-dom';
import {type SubmitEvent, useContext, useEffect, useState} from 'react';
import PageContent from '../../component/layout/page-content';
import {AuthContext, ErrorContext} from '../../state';
import * as applicationInfoApi from '../../api/client/application-info';
import FormFileInput from '../../component/form/form-file-input';
import MarkdownRenderer from '../../component/markdown-renderer';
import MdDialog from '../../component/dialog/md-dialog';
import StringEntriesEditor from '../../component/string-entries-editor';
import type {AppEntry} from '../../api/model/porez';
import * as apiConfig from '../../api/client/config';

const ADMIN_APPLICATION_SETTINGS_DIALOG_ID = 'admin-application-settings-dialog-001';

const AdminApplicationSettingsPage = () => {

    const [contentIndex, setContentIndex] = useState(0);

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Správca</li>
                    <li><NavLink to="/admin/application-settings">Nastavenia aplikácie</NavLink></li>
                </ul>
            </div>

            <select
                defaultValue="0"
                className="select select-neutral"
                onChange={event => setContentIndex(Number(event.currentTarget.value))}
            >
                <option value="0">Logo</option>
                <option value="1">Domovská stránka</option>
                <option value="2">Parametre aplikácie</option>
            </select>

            {contentIndex === 0 && <LogoEditor/>}
            {contentIndex === 1 && <HomePageEditor/>}
            {contentIndex === 2 && <StringEntriesEditor<AppEntry>
                dialogId={ADMIN_APPLICATION_SETTINGS_DIALOG_ID}
                getEntries={apiConfig.getApps}
                setEntry={apiConfig.setApp}
            />}
        </>
    );
};

export default AdminApplicationSettingsPage;

const LogoEditor = () => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [file, setFile] = useState<File>();
    const [fileError, setFileError] = useState<string>();
    const [busy, setBusy] = useState(false);

    const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        setBusy(true);

        try {
            e.preventDefault();

            setFileError(undefined);

            if (!file) {
                setFileError('Vyžaduje sa logo');
                return;
            }

            const response = await applicationInfoApi.setLogo(file, authState?.accessToken);
            errorState?.addError?.(response.error);
        } finally {
            setBusy(false);
        }
    }

    return (
        <PageContent>
            <form
                className="flex flex-col justify-center items-center w-full"
                onSubmit={onSubmit}
                noValidate
            >
                {!busy &&
                    <div className="flex flex-col justify-center items-center">
                        <img
                            className="object-scale-down object-center w-32 h-32"
                            src={applicationInfoApi.getLogoPath()}
                            alt="Logo"
                        />
                    </div>
                }

                <FormFileInput
                    legend="Vyberte súbor loga"
                    label="Maximálna veľkosť 10MB"
                    error={fileError}
                    onFileSelected={f => setFile(f)}
                />

                <button
                    type="submit"
                    className="btn btn-primary mt-5"
                    disabled={busy}
                >Potvrdiť
                </button>
            </form>
        </PageContent>
    )
}

const HomePageEditor = () => {
    return (
        <PageContent
            toolBar={
                <WelcomeTextEditor/>
            }
        >
            <ApplicationInfoEditor/>
        </PageContent>
    )
}

const WelcomeTextEditor = () => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [welcomeText, setWelcomeText] = useState('');
    const [showEditor, setShowEditor] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadWelcomeText = async () => {
            if (!isMounted) {
                return;
            }

            const response = await applicationInfoApi.getWelcomeText();

            setWelcomeText(response.data?.value ?? '');
            errorState?.addError(response.error);
        };

        void loadWelcomeText();

        return () => {
            isMounted = false;
        };
    }, [errorState]);

    return (
        <>
            <div className="flex flex-row justify-center items-center w-full">
                <div className="flex grow w-full border border-base-300 rounded min-h-14">
                    <MarkdownRenderer
                        className="prose max-w-none w-full"
                        md={welcomeText}
                    />
                </div>
                <button
                    className="btn btn-secondary"
                    onClick={() => {
                        setShowEditor(true);
                    }}
                ><span className="icon-[lucide--edit] text-base"></span></button>
            </div>

            {showEditor && <MdDialog
                dialogId={ADMIN_APPLICATION_SETTINGS_DIALOG_ID}
                showDialog={showEditor}
                dialogTitle="Uvítací text"
                initialValue={welcomeText}
                okHandler={(value) => {
                    (async () => {
                        const response = await applicationInfoApi.setWelcomeText(value, authState?.accessToken);
                        setWelcomeText(response.data?.value ?? '');
                        errorState?.addError(response.error);
                        setShowEditor(false);
                    })();
                }}
                cancelHandler={() => setShowEditor(false)}
            />
            }
        </>
    )
}

const ApplicationInfoEditor = () => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [data, setData] = useState<string[]>();

    const [currentIndex, setCurrentIndex] = useState<number>();
    const [currentItem, setCurrentItem] = useState('');
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadApplicationInfo = async () => {
            if (!isMounted) {
                return;
            }

            const response = await applicationInfoApi.getApplicationInfo();

            if (response?.data) setData(response.data);
            if (response?.error) errorState?.addError?.(response.error);
        };

        void loadApplicationInfo();

        return () => {
            isMounted = false;
        };
    }, [errorState]);

    const setItemHandler = (item: string, index?: number) => {
        if (data) {
            const _data = [...data];
            if (index !== undefined) {
                _data[index] = item;
            } else {
                _data.push(item);
            }
            saveData(_data).then();
            setShowDialog(false);
        }
    }

    const deleteItemHandler = (index: number) => {
        if (data) {
            const _data = [...data];
            _data.splice(index, 1);
            saveData(_data).then();
        }
    }

    const saveData = async (data: string[]) => {
        const response = await applicationInfoApi.setApplicationInfo(data, authState?.accessToken);
        if (response?.data) setData(response.data);
        if (response?.error) errorState?.addError?.(response.error);
    }

    return (
        <>
            <div className="flex flex-row justify-center items-center w-full">
                <div className="flex grow w-full border border-base-300 rounded min-h-14">
                    <div className="grid grid-cols-3 gap-2 ">
                        {data?.map((item, index) =>
                            <div key={index} className="flex flex-col border border-solid p-2 w-full">
                                <div className="flex flex-row justify-end w-full">
                                    <div className="join">
                                        <button
                                            type="button"
                                            className="btn btn-secondary join-item"
                                            onClick={() => {
                                                setCurrentIndex(index);
                                                setCurrentItem(item);
                                                setShowDialog(true);
                                            }}
                                        ><span className="icon-[lucide--edit] text-base"></span></button>
                                        <button
                                            type="button"
                                            className="btn btn-accent join-item"
                                            onClick={() => {
                                                deleteItemHandler(index);
                                            }}
                                        ><span className="icon-[lucide--trash] text-base"></span></button>
                                    </div>
                                </div>
                                <MarkdownRenderer
                                    className="prose prose-sm"
                                    md={item}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <button
                    className="btn btn-primary btn-sm btn-circle"
                    onClick={() => {
                        setCurrentIndex(undefined);
                        setCurrentItem('');
                        setShowDialog(true);
                    }}
                ><span className="icon-[lucide--file-plus] text-base"></span></button>
            </div>

            {showDialog && <MdDialog
                dialogId={ADMIN_APPLICATION_SETTINGS_DIALOG_ID}
                showDialog={showDialog}
                dialogTitle="Položka aplikačných informácií"
                initialValue={currentItem}
                okHandler={(value) => {
                    setItemHandler(value, currentIndex);
                }}
                cancelHandler={() => setShowDialog(false)}
            />
            }
        </>
    )
}
