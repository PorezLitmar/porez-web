import {NavLink} from 'react-router-dom';
import {type ChangeEvent, useContext, useEffect, useState} from 'react';
import {AuthContext, DialogContext, ErrorContext} from '../../state';
import {type FreeDay} from '../../api/model/porez';
import PageContent from '../../component/layout/page-content.tsx';
import Table from '../../component/table.tsx';
import * as apiApplicationInfo from "../../api/client/application-info";
import {createPortal} from 'react-dom';
import BaseDialog from '../../component/dialog/base-dialog.tsx';
import {type FieldErrors, formatDate, isBlank, parseDate, validateRequired} from '../../component';
import FormInput from '../../component/form/form-input.tsx';

const ADMIN_FREE_DAYS_DIALOG_ID = 'admin-free-days-dialog-001';

const AdminFreeDaysPage = () => {

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Správca</li>
                    <li><NavLink to="/admin/free-days">Voľné dni</NavLink></li>
                </ul>
            </div>

            <AdminFreeDaysPageContent/>
        </>
    );
};

export default AdminFreeDaysPage;

const AdminFreeDaysPageContent = () => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [data, setData] = useState<FreeDay[]>();
    const [busy, setBusy] = useState(false);
    const [selected, setSelected] = useState<FreeDay>();
    const [showDialog, setShowDialog] = useState(false);
    const [modified, setModified] = useState(false);

    const saveData = async () => {
        setBusy(true);
        try {
            const response = await apiApplicationInfo.setFreeDays(data ?? [], authState?.accessToken);
            if (response.data) setData(response.data);
            if (response.error) errorState?.addError?.(response.error);
        } finally {
            setBusy(false);
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

                const response = await apiApplicationInfo.getFreeDays();

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
                        onClick={async () => {
                            if (data) {
                                await saveData();
                            }
                        }}
                    >Potvrdiť</button>
                }
            >
                <Table
                    fields={['rn', 'name', 'day', 'month', 'actions']}
                    tableHeaderColumn={(field) => {
                        switch (field) {
                            case 'rn':
                                return (<th key={field}></th>);
                            case 'name':
                                return (<th key={field}>Názov</th>);
                            case 'day':
                                return (<th key={field}>Deň</th>);
                            case 'month':
                                return (<th key={field}>Mesiac</th>);
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
                    tableRowKey={(row) => row.name}
                    tableRowColumn={
                        (field, row, rowIndex) => {
                            switch (field) {
                                case 'rn':
                                    return (<th key={field}>{`${rowIndex + 1}`}</th>);
                                case 'name':
                                    return (<td key={field}>{row.name}</td>);
                                case 'day':
                                    return (<td key={field}>{row.day}</td>);
                                case 'month':
                                    return (<td key={field}>{row.month}</td>);
                                case 'actions':
                                    return (
                                        <td key={field}>
                                            <div className="join">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-xs join-item"
                                                    disabled={busy}
                                                    onClick={() => {
                                                        setSelected(row);
                                                        setShowDialog(true);
                                                    }}
                                                ><span className="icon-[lucide--edit] text-base"></span></button>
                                                <button
                                                    className="btn btn-accent btn-xs join-item"
                                                    type="button"
                                                    disabled={busy}
                                                    onClick={() => {
                                                        if (data) {
                                                            const newData = [...data];
                                                            const index = newData.findIndex(item => item.day === row.day && item.month === row.month);
                                                            if (index !== -1) {
                                                                newData.splice(index, 1);
                                                                setData(newData);
                                                                setModified(true);
                                                            }
                                                        }
                                                    }}
                                                ><span className="icon-[lucide--trash] text-base"></span></button>
                                            </div>
                                        </td>
                                    )
                            }
                        }
                    }
                />
            </PageContent>

            {showDialog && <FreeDayDialog
                showDialog={showDialog}
                freeDay={selected}
                okHandler={(entry) => {
                    if (data) {
                        const newData = [...data];
                        const index = newData.findIndex(item => item.day === entry.day && item.month === entry.month);
                        if (index !== -1) {
                            newData[index] = entry;
                        } else {
                            newData.unshift(entry);
                        }
                        setData(newData);
                        setModified(true);
                        setShowDialog(false);
                    }
                }}
                cancelHandler={() => setShowDialog(false)}
            />
            }
        </>
    )
}

type FormValues = {
    name: string;
    date: string;
};

const FreeDayDialog = ({showDialog, freeDay, okHandler, cancelHandler}: {
    showDialog: boolean,
    freeDay?: FreeDay,
    okHandler: (freeDay: FreeDay) => void,
    cancelHandler: () => void
}) => {
    const dialogState = useContext(DialogContext);

    const formatFreeDay = (fd?: FreeDay) => {
        if (fd) {
            const freeDayDate = new Date(2000, fd.month - 1, fd.day);
            return formatDate(freeDayDate);
        }
        return "";
    }

    const [values, setValues] = useState<FormValues>({
        name: freeDay?.name ?? "",
        date: formatFreeDay(freeDay),
    });

    const [errors, setErrors] = useState<FieldErrors<FormValues>>({});

    const validate = (v: FormValues): FieldErrors<FormValues> => {
        const e: FieldErrors<FormValues> = {
            ...validateRequired<FormValues, 'name'>('name', v.name, 'Vyžaduje sa názov'),
            ...validateRequired<FormValues, 'date'>('date', v.date, 'Vyžaduje sa dátum')
        };

        if (isBlank(e.date) && parseDate(v.date) === undefined) {
            e.date = 'Neplatný formát dátumu';
        }

        return e;
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

        const value = parseDate(values.date);
        if (value) {
            okHandler({
                name: values.name,
                day: value.getDate(),
                month: value.getMonth() + 1
            });
        }
    }

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog id={ADMIN_FREE_DAYS_DIALOG_ID} showDialog={showDialog} closeHandler={cancelHandler}>
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">Voľný deň</div>
                </div>

                <div className="flex flex-col justify-center items-center w-full max-w-md">
                    <FormInput
                        name="name"
                        label="Názov"
                        placeholder="Zadajte názov"
                        value={values.name}
                        error={errors.name}
                        onChange={onChange}
                    />

                    <FormInput
                        type="date"
                        name="date"
                        label="Dátum"
                        placeholder="Zadajte dátum"
                        value={values.date}
                        error={errors.date}
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
