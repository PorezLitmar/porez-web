import {NavLink} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import type {DecimalPropertyEntry, IntegerPropertyEntry} from '../../api/model/porez';
import PageContent from '../../component/layout/page-content';
import Table from '../../component/table';
import {AuthContext, DialogContext, ErrorContext} from '../../state';
import * as apiConfig from '../../api/client/config';
import {formatNumber, isBlank, parseNumber} from '../../component';
import {createPortal} from 'react-dom';
import BaseDialog from '../../component/dialog/base-dialog';
import FormInput from '../../component/form/form-input';

const ADMIN_NUMERIC_SETTINGS_DIALOG_ID = 'admin-numeric-settings-dialog-001';

const AdminNumericSettingsPage = () => {

    const [contentIndex, setContentIndex] = useState(0);

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Správca</li>
                    <li><NavLink to="/admin/numeric-settings">Číselné parametre</NavLink></li>
                </ul>
            </div>

            <select
                defaultValue="0"
                className="select select-neutral"
                onChange={event => setContentIndex(Number(event.currentTarget.value))}
            >
                <option value="0">Celočiselné parametre</option>
                <option value="1">Desatinné parametre</option>
            </select>

            {contentIndex === 0 && <IntegerPropertyEntriesEditor/>}
            {contentIndex === 1 && <DecimalPropertyEntriesEditor/>}
        </>
    );
};

export default AdminNumericSettingsPage;

const IntegerPropertyEntriesEditor = () => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [data, setData] = useState<IntegerPropertyEntry[]>([]);
    const [selected, setSelected] = useState<IntegerPropertyEntry>();
    const [showDialog, setShowDialog] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadEntries = async () => {
            setBusy(true);
            try {
                if (!isMounted) {
                    return;
                }

                const response = await apiConfig.getIntegerProperties();
                setData(response.data ?? []);
                errorState?.addError?.(response.error);
            } finally {
                if (isMounted) {
                    setBusy(false);
                }
            }
        };

        void loadEntries();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <PageContent>
                <Table
                    fields={['code', 'value', 'actions']}
                    tableHeaderColumn={(field) => {
                        switch (field) {
                            case 'code':
                                return <th key={field}>Kód</th>;
                            case 'value':
                                return <th key={field}>Hodnota</th>;
                            case 'actions':
                                return <th key={field}></th>;
                        }
                    }}
                    rows={data}
                    tableRowKey={(row) => row.key ?? ''}
                    tableRowColumn={(field, row) => {
                        switch (field) {
                            case 'code':
                                return (<td key={field}>{row.key}</td>);
                            case 'value':
                                return (<td key={field}>{formatNumber(row.value)}</td>);
                            case 'actions':
                                return (
                                    <td key={field}>
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-xs join-item"
                                            disabled={busy}
                                            onClick={() => {
                                                setSelected(row);
                                                setShowDialog(true);
                                            }}
                                        ><span className="icon-[lucide--edit] text-base"></span>
                                        </button>
                                    </td>
                                );
                        }
                    }}
                />
            </PageContent>

            {showDialog && selected &&
                <IntegerEntryDialog
                    dialogId={ADMIN_NUMERIC_SETTINGS_DIALOG_ID}
                    showDialog={showDialog}
                    entry={selected}
                    okHandler={async (value) => {
                        setBusy(true);
                        try {
                            const response = await apiConfig.setIntegerProperty({
                                ...selected,
                                value
                            }, authState?.accessToken);
                            const newData = [...data];
                            const index = newData.findIndex((item) => item.key === selected.key);
                            if (index !== -1 && response.data) {
                                newData[index] = response.data;
                            }
                            setData(newData);
                            errorState?.addError?.(response.error);
                        } finally {
                            setBusy(false);
                            setShowDialog(false);
                        }
                    }}
                    cancelHandler={() => setShowDialog(false)}
                />
            }
        </>
    )
}

const IntegerEntryDialog = ({dialogId, showDialog, entry, okHandler, cancelHandler}: {
    dialogId: string,
    showDialog: boolean,
    entry: IntegerPropertyEntry,
    okHandler: (value: number) => void,
    cancelHandler: () => void
}) => {
    const dialogState = useContext(DialogContext);

    const [value, setValue] = useState(formatNumber(entry.value));
    const [error, setError] = useState<string>();

    const onSubmit = () => {
        setError(undefined);

        if (isBlank(value)) {
            setError('Vyžaduje sa hodnota');
            return;
        }

        const result = parseNumber(value);

        if (result === undefined) {
            setError('Neplatný formát hodnoty');
            return;
        }

        if (!Number.isInteger(result)) {
            setError('Vyžaduje sa celé číslo');
            return;
        }

        okHandler(result);
    }

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog id={dialogId} showDialog={showDialog} closeHandler={cancelHandler}>
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">{entry.key}</div>
                </div>

                <div className="flex flex-col justify-center items-center w-full max-w-md">
                    <FormInput
                        name="value"
                        label="Hodnota"
                        placeholder="Zadajte hodnotu"
                        value={value}
                        error={error}
                        onChange={event => setValue(event.target.value)}
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

const DecimalPropertyEntriesEditor = () => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [data, setData] = useState<DecimalPropertyEntry[]>([]);
    const [selected, setSelected] = useState<DecimalPropertyEntry>();
    const [showDialog, setShowDialog] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadEntries = async () => {
            setBusy(true);
            try {
                if (!isMounted) {
                    return;
                }

                const response = await apiConfig.getDecimalProperties();
                setData(response.data ?? []);
                errorState?.addError?.(response.error);
            } finally {
                if (isMounted) {
                    setBusy(false);
                }
            }
        };

        void loadEntries();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <PageContent>
                <Table
                    fields={['code', 'value', 'actions']}
                    tableHeaderColumn={(field) => {
                        switch (field) {
                            case 'code':
                                return <th key={field}>Kód</th>;
                            case 'value':
                                return <th key={field}>Hodnota</th>;
                            case 'actions':
                                return <th key={field}></th>;
                        }
                    }}
                    rows={data}
                    tableRowKey={(row) => row.key ?? ''}
                    tableRowColumn={(field, row) => {
                        switch (field) {
                            case 'code':
                                return (<td key={field}>{row.key}</td>);
                            case 'value':
                                return (<td key={field}>{formatNumber(row.value)}</td>);
                            case 'actions':
                                return (
                                    <td key={field}>
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-xs join-item"
                                            disabled={busy}
                                            onClick={() => {
                                                setSelected(row);
                                                setShowDialog(true);
                                            }}
                                        ><span className="icon-[lucide--edit] text-base"></span>
                                        </button>
                                    </td>
                                );
                        }
                    }}
                />
            </PageContent>

            {showDialog && selected &&
                <DecimalEntryDialog
                    dialogId={ADMIN_NUMERIC_SETTINGS_DIALOG_ID}
                    showDialog={showDialog}
                    entry={selected}
                    okHandler={async (value) => {
                        setBusy(true);
                        try {
                            const response = await apiConfig.setDecimalProperty({
                                ...selected,
                                value
                            }, authState?.accessToken);
                            const newData = [...data];
                            const index = newData.findIndex((item) => item.key === selected.key);
                            if (index !== -1 && response.data) {
                                newData[index] = response.data;
                            }
                            setData(newData);
                            errorState?.addError?.(response.error);
                        } finally {
                            setBusy(false);
                            setShowDialog(false);
                        }
                    }}
                    cancelHandler={() => setShowDialog(false)}
                />
            }
        </>
    )
}

const DecimalEntryDialog = ({dialogId, showDialog, entry, okHandler, cancelHandler}: {
    dialogId: string,
    showDialog: boolean,
    entry: DecimalPropertyEntry,
    okHandler: (value: number) => void,
    cancelHandler: () => void
}) => {
    const dialogState = useContext(DialogContext);

    const [value, setValue] = useState(formatNumber(entry.value));
    const [error, setError] = useState<string>();

    const onSubmit = () => {
        setError(undefined);

        if (isBlank(value)) {
            setError('Vyžaduje sa hodnota');
            return;
        }

        const result = parseNumber(value);

        if (result === undefined) {
            setError('Neplatný formát hodnoty');
            return;
        }

        okHandler(result);
    }

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog id={dialogId} showDialog={showDialog} closeHandler={cancelHandler}>
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">{entry.key}</div>
                </div>

                <div className="flex flex-col justify-center items-center w-full max-w-md">
                    <FormInput
                        name="value"
                        label="Hodnota"
                        placeholder="Zadajte hodnotu"
                        value={value}
                        error={error}
                        onChange={event => setValue(event.target.value)}
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
