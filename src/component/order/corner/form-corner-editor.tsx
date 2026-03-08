import type {FormProductCorner} from '..';
import {useContext, useState} from 'react';
import {DialogContext} from '../../../state';
import FormCornerDialog from './form-corner-dialog';
import {DialogAnswer, DialogType} from '../../../state/dialog/model';
import FormCornerInfo from './form-corner-info';

const FormCornerEditor = (
    {
        label,
        disabled = false,
        name,
        corner,
        setCorner,
        error
    }: {
        label?: string,
        disabled?: boolean,
        name?: string,
        corner?: FormProductCorner,
        setCorner: (corner?: FormProductCorner) => void,
        error?: string
    }
) => {
    const dialogState = useContext(DialogContext);

    const [showDialog, setShowDialog] = useState(false);

    return (
        <>
            <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">{label}</legend>
                <div
                    className="flex flex-row justify-center items-center px-1.5 py-0.5 border border-base-300 rounded w-full">
                    <div className="flex flex-row justify-start items-center w-full">
                        <FormCornerInfo corner={corner}/>
                    </div>

                    <div className="join join-horizontal flex-none">
                        <button
                            type="button"
                            disabled={disabled}
                            title="Upraviť"
                            className="btn btn-primary btn-sm join-item"
                            onClick={() => setShowDialog(true)}
                        ><span className="icon-[lucide--edit] text-base"></span>
                        </button>

                        <button
                            type="button"
                            disabled={corner === undefined || disabled}
                            title="Zmazať"
                            className="btn btn-accent btn-sm join-item"
                            onClick={() => {
                                dialogState?.showDialog({
                                    type: DialogType.YES_NO,
                                    title: `Zamazať roh ${name}`,
                                    message: 'Naozaj si želáte zmazať roh?',
                                    callback: (answer: DialogAnswer) => {
                                        if (answer === DialogAnswer.YES) {
                                            setCorner(undefined);
                                        }
                                    }
                                });
                            }}
                        ><span className="icon-[lucide--trash] text-base"></span>
                        </button>
                    </div>
                </div>
                {error && <p className="label text-error text-xs">{error}</p>}
            </fieldset>

            {showDialog && <FormCornerDialog
                name={name}
                corner={corner}
                setCorner={(data) => setCorner(data)}
                showDialog={showDialog}
                setShowDialog={setShowDialog}
            />}
        </>
    )
}

export default FormCornerEditor;
