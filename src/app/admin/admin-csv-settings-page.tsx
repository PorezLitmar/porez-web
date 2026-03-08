import {NavLink} from 'react-router-dom';
import {type ChangeEvent, useContext, useEffect, useState} from 'react';
import type {CsvPatternEntry, CsvTextEntry, StringEntry} from '../../api/model/porez';
import * as apiConfig from '../../api/client/config';
import StringEntriesEditor from '../../component/string-entries-editor';
import {AuthContext, DialogContext, ErrorContext} from '../../state';
import PageContent from '../../component/layout/page-content.tsx';
import {createPortal} from 'react-dom';
import BaseDialog from '../../component/dialog/base-dialog.tsx';
import FormInput from '../../component/form/form-input.tsx';
import {type FieldErrors, validateRequired} from '../../component';
import Table from '../../component/table.tsx';

const ADMIN_CSV_SETTINGS_DIALOG_ID = 'admin-csv-settings-dialog-001';

const AdminCsvSettingsPage = () => {

    const [contentIndex, setContentIndex] = useState(0);

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Správca</li>
                    <li><NavLink to="/admin/csv-settings">CSV parametre</NavLink></li>
                </ul>
            </div>

            <select
                defaultValue="0"
                className="select select-neutral"
                onChange={event => setContentIndex(Number(event.currentTarget.value))}
            >
                <option value="0">CSV texty</option>
                <option value="1">CSV formáty</option>
                <option value="2">CSV nahradenie textu</option>
            </select>

            {contentIndex === 0 && <StringEntriesEditor<CsvTextEntry>
                dialogId={ADMIN_CSV_SETTINGS_DIALOG_ID}
                getEntries={apiConfig.getCsvTexts}
                setEntry={apiConfig.setCsvText}
            />}

            {contentIndex === 1 && <StringEntriesEditor<CsvPatternEntry>
                dialogId={ADMIN_CSV_SETTINGS_DIALOG_ID}
                getEntries={apiConfig.getCsvPatterns}
                setEntry={apiConfig.setCsvPattern}
            />}

            {contentIndex === 2 && <CsvReplacementEntriesEditor/>}
        </>
    );
};

export default AdminCsvSettingsPage;

const CsvReplacementEntriesEditor = () => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [data, setData] = useState<StringEntry[]>();
    const [showDialog, setShowDialog] = useState(false);
    const [modified, setModified] = useState(false);
    const [busy, setBusy] = useState(false);

    const saveCsvReplacementEntries = async () => {
        try {
            const response = await apiConfig.setCsvReplacements(data ?? [], authState?.accessToken);
            if (response?.data) setData(response.data);
            if (response?.error) errorState?.addError?.(response.error);
        } finally {
            setModified(false);
        }
    }

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (!isMounted) {
                return;
            }

            setBusy(true);
            try {
                if (!isMounted) {
                    return;
                }

                const response = await apiConfig.getCsvReplacements();

                if (response.data) setData(response.data);
                if (response.error) errorState?.addError?.(response.error);
            } finally {
                if (isMounted) {
                    setBusy(false);
                }
            }
        };

        void loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <PageContent
                pageNav={
                    <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={busy || !modified}
                        onClick={() => {
                            if (data) {
                                void saveCsvReplacementEntries();
                            }
                        }}
                    >Potvrdiť</button>
                }
            >
                <Table
                    fields={['code', 'value', 'actions']}
                    tableHeaderColumn={(field) => {
                        switch (field) {
                            case 'code':
                                return (<th key={field}>Kód</th>);
                            case 'value':
                                return (<th key={field}>Hodnota</th>);
                            case 'actions':
                                return (
                                    <th key={field}>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm btn-circle"
                                            disabled={busy}
                                            onClick={() => {
                                                setShowDialog(true);
                                            }}
                                        ><span className="icon-[lucide--file-plus] text-base"></span>
                                        </button>
                                    </th>
                                );
                        }
                    }}
                    rows={data}
                    tableRowKey={(row) => row.key ?? ''}
                    tableRowColumn={(field, row) => {
                        switch (field) {
                            case 'code':
                                return (<td key={field}>{row.key}</td>);
                            case 'value':
                                return (<td key={field}>{row.value}</td>);
                            case 'actions':
                                return (
                                    <td key={field}>
                                        <button
                                            className="btn btn-accent btn-xs"
                                            type="button"
                                            disabled={busy}
                                            onClick={() => {
                                                if (data) {
                                                    const newData = [...data];
                                                    const index = newData.findIndex(item => item.key === row.key);
                                                    if (index !== -1) {
                                                        newData.splice(index, 1);
                                                        setData(newData);
                                                        setModified(true);
                                                    }
                                                }
                                            }}
                                        ><span className="icon-[lucide--trash] text-base"></span></button>
                                    </td>
                                )
                        }
                    }}
                />
            </PageContent>

            {showDialog && <CsvReplacementDialog
                showDialog={showDialog}
                okHandler={(entry) => {
                    if (data) {
                        const newData = [...data];
                        const index = newData.findIndex(item => item.key === entry.key);
                        if (index !== -1) {
                            newData.splice(index, 1);
                        }
                        newData.push(entry);
                        setData(newData);
                        setModified(true);
                    }
                    setShowDialog(false);
                }}
                cancelHandler={() => setShowDialog(false)}
            />}
        </>
    )
}

type FormValues = {
    regex: string;
    replacement: string;
};

const CsvReplacementDialog = ({showDialog, okHandler, cancelHandler}: {
    showDialog: boolean,
    okHandler: (entry: StringEntry) => void,
    cancelHandler: () => void
}) => {
    const dialogState = useContext(DialogContext);

    const [values, setValues] = useState<FormValues>({
        regex: '',
        replacement: ''
    });

    const [errors, setErrors] = useState<FieldErrors<FormValues>>({});

    const validate = (v: FormValues): FieldErrors<FormValues> => {
        return {
            ...validateRequired<FormValues, 'regex'>('regex', v.regex, 'Vyžaduje sa regulárny výraz')
        };
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setValues(prev => ({
            ...prev,
            [name as keyof FormValues]: value,
        }));
    }

    const onSubmit = async () => {
        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length !== 0) return;

        okHandler({
            key: values.regex,
            value: values.replacement
        });
    }

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog
            id={ADMIN_CSV_SETTINGS_DIALOG_ID}
            showDialog={showDialog}
            closeHandler={cancelHandler}
        >
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">CSV nahradenie textu</div>
                </div>

                <div className="flex flex-col justify-center items-center w-full max-w-md">
                    <FormInput
                        name="regex"
                        label="Regulárny výraz"
                        placeholder="Zadajte regulárny výraz"
                        value={values.regex}
                        error={errors.regex}
                        onChange={onChange}
                    />

                    <FormInput
                        name="replacement"
                        label="Nahradenie textu"
                        placeholder="Zadajte nahradenie textu"
                        value={values.replacement}
                        error={errors.replacement}
                        onChange={onChange}
                    />

                    <div className="join mt-5">
                        <button
                            type="button"
                            className="btn btn-primary join-item"
                            onClick={onSubmit}
                        >Potvrdiť
                        </button>
                        <button
                            type="button"
                            className="btn btn-accent join-item"
                            onClick={cancelHandler}
                        >Zrušiť
                        </button>
                    </div>
                </div>
            </div>
        </BaseDialog>
        , dialogState.modalRoot))
}
