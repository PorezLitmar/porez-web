import {useContext, useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {AuthContext, DialogContext, ErrorContext} from '../state';
import {isBlank} from './index';
import BaseDialog from './dialog/base-dialog';
import FormInput from './form/form-input';
import PageContent from './layout/page-content';
import Table from './table';
import type {ClientResponse} from '../api/client';

type Entry = {
    key: string;
    value: string;
};

const StringEntriesEditor = <T extends Entry>({dialogId, getEntries, setEntry}: {
    dialogId: string,
    getEntries: () => Promise<ClientResponse<T[]>>,
    setEntry: (entry: T, accessToken?: string) => Promise<ClientResponse<T>>
}) => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [data, setData] = useState<T[]>([]);
    const [selected, setSelected] = useState<T>();
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

                const response = await getEntries();
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
                                return (<td key={field}>{row.value}</td>);
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
                <StringEntryDialog
                    dialogId={dialogId}
                    showDialog={showDialog}
                    entry={selected}
                    okHandler={async (value) => {
                        setBusy(true);
                        try {
                            const response = await setEntry({...selected, value} as T, authState?.accessToken);
                            const newData = [...data];
                            const index = newData.findIndex((item) => item.key === selected.key);
                            if (index !== -1) {
                                newData[index] = response.data as T;
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

export default StringEntriesEditor;

const StringEntryDialog = ({dialogId, showDialog, entry, okHandler, cancelHandler}: {
    dialogId: string,
    showDialog: boolean,
    entry: Entry,
    okHandler: (value: string) => void,
    cancelHandler: () => void
}) => {
    const dialogState = useContext(DialogContext);

    const [value, setValue] = useState(entry.value);
    const [error, setError] = useState<string>();

    const onSubmit = () => {
        setError(undefined);

        if (isBlank(value)) {
            setError('Vyžaduje sa hodnota');
            return;
        }

        okHandler(value);
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
