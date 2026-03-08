import {type Category, type CodeListData} from '../../api/model/porez';
import {type ChangeEvent, useContext, useState} from 'react';
import {DialogContext} from '../../state';
import {createPortal} from 'react-dom';
import BaseDialog from '../dialog/base-dialog';
import FormInput from '../form/form-input';
import {type FieldErrors, validateRequired} from '..';

const CategoryDialog = ({dialogId, showDialog, codeList, okHandler, cancelHandler}: {
    dialogId: string,
    showDialog: boolean,
    codeList?: Category,
    okHandler: (codeListData: CodeListData) => Promise<void>,
    cancelHandler: () => void,
}) => {
    const dialogState = useContext(DialogContext);

    const [values, setValues] = useState<CodeListData>({
        code: codeList?.code ?? '',
        name: codeList?.name ?? ''
    });
    const [errors, setErrors] = useState<FieldErrors<CodeListData>>({});
    const [busy, setBusy] = useState(false);

    const validate = (v: CodeListData): FieldErrors<CodeListData> => {
        return {
            ...validateRequired<CodeListData, 'code'>('code', v.code, 'Vyžaduje sa kód'),
            ...validateRequired<CodeListData, 'name'>('name', v.name, 'Vyžaduje sa názov')
        };
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setValues(prev => ({
            ...prev,
            [name as keyof CodeListData]: value,
        }));
    }

    const onSubmit = async () => {
        setBusy(true);
        try {
            const validationErrors = validate(values);
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length !== 0) return;

            await okHandler(values);
        } finally {
            setBusy(false);
        }
    }

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog id={dialogId} showDialog={showDialog} closeHandler={cancelHandler}>
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">Kategória</div>
                </div>

                <div className="flex flex-col justify-center items-center w-full max-w-md">
                    <FormInput
                        name="code"
                        label="Kód"
                        placeholder="Zadajte kód"
                        value={values.code}
                        error={errors.code}
                        onChange={onChange}
                    />

                    <FormInput
                        name="name"
                        label="Názov"
                        placeholder="Zadajte názov"
                        value={values.name}
                        error={errors.name}
                        onChange={onChange}
                    />

                    <div className="join mt-5">
                        <button
                            type="button"
                            className="btn btn-primary join-item"
                            disabled={busy}
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

export default CategoryDialog;
