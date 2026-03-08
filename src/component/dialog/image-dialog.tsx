import {useContext, useState} from 'react';
import {DialogContext} from '../../state';
import {createPortal} from 'react-dom';
import BaseDialog from './base-dialog';
import FormFileInput from '../form/form-file-input';

const ImageDialog = ({dialogId, showDialog, okHandler, cancelHandler}: {
    dialogId: string,
    showDialog: boolean,
    okHandler: (file: File) => void,
    cancelHandler: () => void
}) => {
    const dialogState = useContext(DialogContext);

    const [file, setFile] = useState<File>();
    const [fileError, setFileError] = useState<string>();

    const [preview, setPreview] = useState<string>()

    const onSubmit = async () => {
        setFileError(undefined);

        if (!file) {
            setFileError('Vyžaduje sa obrázok');
            return;
        }

        okHandler(file);
    }

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog id={dialogId} showDialog={showDialog} closeHandler={cancelHandler}>
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">Obrázok</div>
                </div>

                <div className="flex flex-col justify-center items-center w-full max-w-md">
                    <FormFileInput
                        legend="Vyberte súbor obrázka"
                        label="Maximálna veľkosť 10MB"
                        error={fileError}
                        onFileSelected={f => {
                            setFile(f);
                            setPreview(undefined);
                            if (f) {
                                setPreview(URL.createObjectURL(f));
                            }
                        }}
                    />

                    <img
                        className="flex-none w-48 h-48 object-scale-down object-center"
                        src={preview}
                        alt="Zvolený obrázok"
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

export default ImageDialog;