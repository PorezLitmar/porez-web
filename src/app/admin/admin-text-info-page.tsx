import {NavLink} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import type {ClientResponse} from '../../api/client';
import {type StringValue} from '../../api/model/porez';
import {AuthContext, ErrorContext} from '../../state';
import MarkdownRenderer from '../../component/markdown-renderer';
import MdDialog from '../../component/dialog/md-dialog';
import * as applicationInfoApi from '../../api/client/application-info';

const ADMIN_TEXT_INFO_DIALOG_ID = 'admin-text-info-dialog-001';

const AdminTextInfoPage = () => {

    const [contentIndex, setContentIndex] = useState(0);

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Správca</li>
                    <li><NavLink to="/admin/text-info">Textové informácie</NavLink></li>
                </ul>
            </div>

            <select
                defaultValue="0"
                className="select select-neutral"
                onChange={event => setContentIndex(Number(event.currentTarget.value))}
            >
                <option value="0">Gdpr informácie</option>
                <option value="1">Cookies informácie</option>
                <option value="2">Obchodné podmienky</option>
                <option value="3">Ako vytvoriť objednávku</option>
                <option value="4">Pracovné hodiny</option>
            </select>

            {contentIndex === 0 && <MdEditor
                title="Gdpr informácie"
                loadValue={applicationInfoApi.getGdprInfo}
                saveValue={applicationInfoApi.setGdprInfo}
            />}
            {contentIndex === 1 && <MdEditor
                title="Cookies informácie"
                loadValue={applicationInfoApi.getCookiesInfo}
                saveValue={applicationInfoApi.setCookiesInfo}
            />}
            {contentIndex === 2 && <MdEditor
                title="Obchodné podmienky"
                loadValue={applicationInfoApi.getBusinessConditions}
                saveValue={applicationInfoApi.setBusinessConditions}
            />}
            {contentIndex === 3 && <MdEditor
                title="Ako vytvoriť objednávku"
                loadValue={applicationInfoApi.getOrderInfo}
                saveValue={applicationInfoApi.setOrderInfo}
            />}
            {contentIndex === 4 && <MdEditor
                title="Pracovné hodiny"
                loadValue={applicationInfoApi.getWorkingHours}
                saveValue={applicationInfoApi.setWorkingHours}
            />}
        </>
    );
};

export default AdminTextInfoPage;

const MdEditor = (
    {
        title,
        loadValue,
        saveValue
    }: {
        title: string,
        loadValue: () => Promise<ClientResponse<StringValue>>,
        saveValue: (value: string, token?: string) => Promise<ClientResponse<StringValue>>,
    }
) => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [value, setValue] = useState<string>();
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadAppConfig = async () => {
            if (!isMounted) {
                return;
            }

            const response = await loadValue();
            setValue(response.data?.value ?? '');
            errorState?.addError(response.error);
        };

        void loadAppConfig();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <div className="flex flex-col justify-center items-center w-full">
                <button
                    className="btn btn-secondary"
                    onClick={() => {
                        setShowDialog(true);
                    }}
                ><span className="icon-[lucide--edit] text-base"></span></button>
                <div className="flex grow w-full border border-base-300 rounded min-h-14">
                    <MarkdownRenderer
                        className="prose max-w-none w-full"
                        md={value}
                    />
                </div>
            </div>

            {showDialog && <MdDialog
                dialogId={ADMIN_TEXT_INFO_DIALOG_ID}
                showDialog={showDialog}
                dialogTitle={title}
                initialValue={value ?? ''}
                okHandler={(value) => {
                    (async () => {
                        const response = await saveValue(value ?? '', authState?.accessToken);
                        setValue(response.data?.value ?? '');
                        errorState?.addError(response.error);
                        setShowDialog(false);
                    })();
                }}
                cancelHandler={() => setShowDialog(false)}
            />
            }
        </>
    )
}