import type {OrderCommentData} from '../../api/model/porez';
import {useContext, useState} from 'react';
import {DialogContext} from '../../state';
import {createPortal} from 'react-dom';
import BaseDialog from '../dialog/base-dialog';
import {type FieldErrors, validateRequired} from '..';
import FormTextArea from '../form/form-text-area';

const OrderCommentDialog = (
    {
        dialogId,
        showDialog,
        setShowDialog,
        okHandler
    }: {
        dialogId: string,
        showDialog: boolean,
        setShowDialog: (showDialog: boolean) => void,
        okHandler: (comment: OrderCommentData) => Promise<void>
    }
) => {
    const dialogState = useContext(DialogContext);

    const [values, setValues] = useState<OrderCommentData>({
        comment: ''
    });
    const [errors, setErrors] = useState<FieldErrors<OrderCommentData>>({});
    const [busy, setBusy] = useState(false);

    const validate = (v: OrderCommentData): FieldErrors<OrderCommentData> => {
        return {
            ...validateRequired<OrderCommentData, 'comment'>('comment', v.comment, 'Vyžaduje sa komentár'),
        }
    }

    const onSubmit = async () => {
        setBusy(true);
        try {
            const validationErrors = validate(values);
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length !== 0) return;

            await okHandler(values);
            setShowDialog(false);
        } finally {
            setBusy(false);
        }
    }

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog id={dialogId} showDialog={showDialog} closeHandler={() => setShowDialog(false)}>
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">Komentár objednávky</div>
                </div>

                <div className="flex flex-col justify-center items-center w-full max-w-md">
                    <FormTextArea
                        name="comment"
                        label="Komentár"
                        placeholder="Zadajte komentár"
                        value={values.comment}
                        error={errors.comment}
                        onChange={value => setValues({...values, comment: value})}
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
                            onClick={() => setShowDialog(false)}
                        >Zrušiť
                        </button>
                    </div>
                </div>
            </div>
        </BaseDialog>
        , dialogState.modalRoot))
}

export default OrderCommentDialog;
