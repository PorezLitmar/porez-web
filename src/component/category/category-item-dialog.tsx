import {type CodeListData, type CodeListItem, type CodeListItemData} from '../../api/model/porez';
import {type ChangeEvent, useContext, useState} from 'react';
import {DialogContext} from '../../state';
import {createPortal} from 'react-dom';
import BaseDialog from '../dialog/base-dialog';
import FormInput from '../form/form-input';
import {type FieldErrors, validateRequired} from '..';

type FormValues = {
    code: string;
    value: string;
}

const CategoryItemDialog = ({dialogId, showDialog, categoryId, parentId, codeListItem, okHandler, cancelHandler}: {
    dialogId: string,
    showDialog: boolean,
    categoryId: string,
    parentId?: string,
    codeListItem?: CodeListItem,
    okHandler: (codeListItemData: CodeListItemData) => Promise<void>,
    cancelHandler: () => void,
}) => {
    const dialogState = useContext(DialogContext);

    const [values, setValues] = useState<FormValues>({
        code: codeListItem?.code ?? '',
        value: codeListItem?.value ?? ''
    });
    const [errors, setErrors] = useState<FieldErrors<FormValues>>({});
    const [busy, setBusy] = useState(false);

    const validate = (v: FormValues): FieldErrors<FormValues> => {
        return {
            ...validateRequired<FormValues, 'code'>('code', v.code, 'Vyžaduje sa kód'),
            ...validateRequired<FormValues, 'value'>('value', v.value, 'Vyžaduje sa hodnota')
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

            await okHandler({
                codeListId: categoryId,
                parentId,
                ...values
            });
        } finally {
            setBusy(false);
        }
    }

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog id={dialogId} showDialog={showDialog} closeHandler={cancelHandler}>
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">Položka kategórie</div>
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
                        name="value"
                        label="Hodnota"
                        placeholder="Zadajte hodnotu"
                        value={values.value}
                        error={errors.value}
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

export default CategoryItemDialog;
