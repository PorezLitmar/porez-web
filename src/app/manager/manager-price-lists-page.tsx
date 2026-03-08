import {NavLink} from 'react-router-dom';
import {type ChangeEvent, type SubmitEvent, type SyntheticEvent, useContext, useEffect, useState} from 'react';
import {AuthContext, DialogContext, ErrorContext} from '../../state';
import type {ApplicationOperationRate, ApplicationPriceEntry} from '../../api/model/porez';
import {ApplicationOperationRateType} from '../../api/model/porez';
import * as apiApplicationPrice from '../../api/client/application-price';
import * as apiApplicationOperationRate from '../../api/client/application-operation-rate';
import PageContent from '../../component/layout/page-content';
import Table from '../../component/table';
import {type FieldErrors, formatNumber, isBlank, parseNumber, validateNumber} from '../../component';
import {createPortal} from 'react-dom';
import BaseDialog from '../../component/dialog/base-dialog';
import FormInput from '../../component/form/form-input';
import {DialogAnswer, DialogType} from '../../state/dialog/model.ts';

const MANAGER_PRICES_DIALOG_ID = 'manager-prices-dialog-001';

const ManagerPriceListPage = () => {

    const [contentIndex, setContentIndex] = useState(0);

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Manažér</li>
                    <li><NavLink to="/manager/price-lists">Cenníky</NavLink></li>
                </ul>
            </div>

            <select
                defaultValue="0"
                className="select select-neutral"
                onChange={event => setContentIndex(Number(event.currentTarget.value))}
            >
                <option value="0">Jednotkové ceny</option>
                <option value="1">Ceny lepenia</option>
                <option value="2">Ceny pílenia</option>
            </select>

            {contentIndex === 0 && <ApplicationPricesEditor/>}
            {contentIndex === 1 && <ApplicationOperationRatesEditor type={ApplicationOperationRateType.GLUING}/>}
            {contentIndex === 2 && <ApplicationOperationRatesEditor type={ApplicationOperationRateType.SAWING}/>}
        </>
    );
};

export default ManagerPriceListPage;

const ApplicationPricesEditor = () => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [data, setData] = useState<ApplicationPriceEntry[]>([]);
    const [selected, setSelected] = useState<ApplicationPriceEntry>();
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

                const response = await apiApplicationPrice.getApplicationPrices(authState?.accessToken);
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
                <ApplicationPriceDialog
                    dialogId={MANAGER_PRICES_DIALOG_ID}
                    showDialog={showDialog}
                    entry={selected}
                    okHandler={async (value) => {
                        setBusy(true);
                        try {
                            const response = await apiApplicationPrice.setApplicationPrice({
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

const ApplicationPriceDialog = ({dialogId, showDialog, entry, okHandler, cancelHandler}: {
    dialogId: string,
    showDialog: boolean,
    entry: ApplicationPriceEntry,
    okHandler: (value: number) => void,
    cancelHandler: () => void
}) => {
    const dialogState = useContext(DialogContext);

    const [value, setValue] = useState(formatNumber(entry.value));
    const [error, setError] = useState<string>();

    const onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
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

                <form
                    className="flex flex-col justify-center items-center w-full max-w-md"
                    onSubmit={onSubmit}
                    noValidate
                >
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

const ApplicationOperationRatesEditor = ({type}: { type: ApplicationOperationRateType }) => {
    const authState = useContext(AuthContext);
    const dialogState = useContext(DialogContext);
    const errorState = useContext(ErrorContext);

    const [data, setData] = useState<ApplicationOperationRate[]>([]);
    const [selected, setSelected] = useState<ApplicationOperationRate>();
    const [showDialog, setShowDialog] = useState(false);
    const [busy, setBusy] = useState(false);
    const [modified, setModified] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadEntries = async () => {
            setBusy(true);
            try {
                if (!isMounted) {
                    return;
                }

                const response = await apiApplicationOperationRate.getApplicationOperationRates(type, authState?.accessToken);
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

    const okHandler = async (applicationOperationRate: ApplicationOperationRate) => {
        setBusy(true);
        try {
            const nextParameter = applicationOperationRate.parameter ?? 0;
            const nextData = data
                .filter((item) => item.parameter !== nextParameter)
                .concat(applicationOperationRate)
                .sort((a, b) => (a.parameter ?? 0) - (b.parameter ?? 0));

            setData(nextData);
            setModified(true);
            setShowDialog(false);
        } finally {
            setBusy(false);
        }
    }

    const deleteHandler = async (applicationOperationRate: ApplicationOperationRate) => {
        setBusy(true);
        try {
            const nextParameter = applicationOperationRate.parameter ?? 0;
            const nextData = data.filter((item) => item.parameter !== nextParameter);

            setData(nextData);
            setModified(true);
        } finally {
            setBusy(false);
        }
    }

    const saveHandler = async () => {
        setBusy(true);
        try {
            const response = await apiApplicationOperationRate.setApplicationOperationRates(type, data?.map(
                rate => ({
                    parameter: rate.parameter ?? 0,
                    value: rate.value ?? 0
                })
            ), authState?.accessToken);
            setData(response.data ?? []);
            errorState?.addError?.(response.error);
            errorState?.addError?.(response.error);
        } finally {
            setBusy(false);
            setModified(false);
        }
    }

    return (
        <>
            <PageContent
                pageNav={
                    <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={busy || !modified}
                        onClick={async () => {
                            if (data) {
                                await saveHandler();
                            }
                        }}
                    >Potvrdiť</button>
                }
            >
                <Table
                    fields={['rn', 'parameter', 'value', 'actions']}
                    tableHeaderColumn={(field) => {
                        switch (field) {
                            case 'rn':
                                return (<th key={field}></th>);
                            case 'parameter':
                                return <th key={field}>Parameter</th>;
                            case 'value':
                                return <th key={field}>Hodnota</th>;
                            case 'actions':
                                return (
                                    <th key={field}>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm btn-circle"
                                            disabled={busy}
                                            onClick={() => {
                                                setSelected(undefined);
                                                setShowDialog(true);
                                            }}
                                        ><span className="icon-[lucide--file-plus] text-base"></span>
                                        </button>
                                    </th>
                                );
                        }
                    }}
                    rows={data}
                    tableRowKey={(row) => `${row.parameter}`}
                    tableRowColumn={(field, row, rowIndex) => {
                        switch (field) {
                            case 'rn':
                                return (<th key={field}>{`${rowIndex + 1}`}</th>);
                            case 'parameter':
                                return (<td key={field}>{formatNumber(row.parameter)}</td>);
                            case 'value':
                                return (
                                    <td key={field}>
                                        <div className="flex flex-row w-full items-center gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-xs"
                                                disabled={busy}
                                                onClick={() => {
                                                    setSelected(row);
                                                    setShowDialog(true);
                                                }}
                                            ><span className="icon-[lucide--edit] text-base"></span></button>
                                            <span>{formatNumber(row.value)}</span>
                                        </div>
                                    </td>
                                );
                            case 'actions':
                                return (
                                    <td key={field}>
                                        <button
                                            className="btn btn-accent btn-xs"
                                            type="button"
                                            disabled={busy}
                                            onClick={() => {
                                                dialogState?.showDialog({
                                                    type: DialogType.YES_NO,
                                                    title: 'Zmazať položku',
                                                    message: `Naozaj si želáte zmazať položku? [${formatNumber(row.parameter)} ${formatNumber(row.value)}]`,
                                                    callback: (answer: DialogAnswer) => {
                                                        if (answer === DialogAnswer.YES) {
                                                            (async () => {
                                                                await deleteHandler(row);
                                                            })();
                                                        }
                                                    }
                                                });
                                            }}
                                        ><span className="icon-[lucide--trash] text-base"></span></button>
                                    </td>
                                );
                        }
                    }}
                />
            </PageContent>

            {showDialog &&
                <ApplicationOperationRateDialog
                    dialogId={MANAGER_PRICES_DIALOG_ID}
                    showDialog={showDialog}
                    type={type}
                    entry={selected}
                    okHandler={okHandler}
                    cancelHandler={() => setShowDialog(false)}
                />
            }
        </>
    )
}

type FormValues = {
    parameter: string;
    value: string;
}

const ApplicationOperationRateDialog = ({dialogId, showDialog, type, entry, okHandler, cancelHandler}: {
    dialogId: string,
    showDialog: boolean,
    type: ApplicationOperationRateType,
    entry?: ApplicationOperationRate,
    okHandler: (applicationOperationRate: ApplicationOperationRate) => void,
    cancelHandler: () => void
}) => {
    const dialogState = useContext(DialogContext);

    const [values, setValues] = useState<FormValues>({
        parameter: formatNumber(entry?.parameter),
        value: formatNumber(entry?.value)
    });
    const [errors, setErrors] = useState<FieldErrors<FormValues>>({});

    const validate = (v: FormValues): FieldErrors<FormValues> => {
        return {
            ...validateNumber<FormValues, 'parameter'>('parameter', v.parameter, {
                message: 'Neplatný formát parametra',
                allowBlank: false,
                requiredMessage: 'Vyžaduje sa parameter'
            }),
            ...validateNumber<FormValues, 'value'>('value', v.value, {
                message: 'Neplatný formát hodnoty',
                allowBlank: false,
                requiredMessage: 'Vyžaduje sa hodnota'
            }),
        };
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, type, value, checked} = e.target;
        const nextValue = type === 'checkbox' ? checked : value;

        setValues(prev => ({
            ...prev,
            [name as keyof FormValues]: nextValue as FormValues[keyof FormValues],
        }));
    }

    const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length !== 0) return;

        void okHandler({
            type,
            parameter: parseNumber(values.parameter) ?? 0,
            value: parseNumber(values.value) ?? 0
        });
    }

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog id={dialogId} showDialog={showDialog} closeHandler={cancelHandler}>
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">Sadzba</div>
                </div>

                <form
                    className="flex flex-col justify-center items-center w-full max-w-md"
                    onSubmit={onSubmit}
                    noValidate
                >

                    <FormInput
                        name="parameter"
                        label="Parameter"
                        placeholder="Zadajte parameter"
                        value={values.parameter}
                        error={errors.parameter}
                        onChange={onChange}
                    />

                    <FormInput
                        name="value"
                        label="Hodnota"
                        placeholder="Zadajte hodnotu"
                        value={values.value}
                        error={errors.value}
                        onChange={onChange}
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
