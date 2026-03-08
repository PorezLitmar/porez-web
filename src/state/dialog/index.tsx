import type {ReactNode} from 'react';
import {useMemo, useState} from 'react';
import {createPortal} from 'react-dom';

import {DialogContext} from '../';
import BaseDialog from '../../component/dialog/base-dialog';
import type {DialogData} from './model';
import {DialogAnswer, DialogType} from './model';

const DIALOG_ID = "dialog-state-provider-dialog-001";

const DialogProvider = ({children}: { children: ReactNode }) => {
    const [data, setData] = useState<DialogData>();
    const [show, setShow] = useState(false);
    const modalRoot = useMemo(
        () => (typeof document !== "undefined" ? document.getElementById("modal-root") : null),
        []
    );

    const showDialog = (dialogData: DialogData) => {
        setData(dialogData);
        setShow(true);
    };

    const handleCallback = (answer: DialogAnswer) => {
        setShow(false);
        data?.callback?.(answer);
    };

    return (
        <>
            <DialogContext.Provider value={{modalRoot, showDialog}}>
                {children}
            </DialogContext.Provider>

            {modalRoot &&
                createPortal(
                    <BaseDialog id={DIALOG_ID} showDialog={show}>
                        <div className="container p-2 mx-auto">
                            <div className="flex flex-col items-center justify-center">
                                {data?.title && (
                                    <h1 className="text-base font-bold text-center">
                                        {data.title}
                                    </h1>
                                )}

                                {data?.message && (
                                    <p className="text-xs text-center py-2">
                                        {data.message}
                                    </p>
                                )}

                                {/* Single OK */}
                                {data?.type &&
                                    data.type !== DialogType.OK_CANCEL &&
                                    data.type !== DialogType.YES_NO && (
                                        <button
                                            type="button"
                                            className="btn btn-primary mt-5"
                                            onClick={() => handleCallback(DialogAnswer.OK)}
                                        >Potvrdiť</button>
                                    )}

                                {/* OK / Cancel */}
                                {data?.type === DialogType.OK_CANCEL && (
                                    <div className="join mt-5">
                                        <button
                                            type="button"
                                            className="btn btn-primary join-item"
                                            onClick={() => handleCallback(DialogAnswer.OK)}
                                        >Potvrdiť</button>
                                        <button
                                            type="button"
                                            className="btn btn-accent join-item"
                                            onClick={() => handleCallback(DialogAnswer.CANCEL)}
                                        >Zrušiť</button>
                                    </div>
                                )}

                                {/* Yes / No */}
                                {data?.type === DialogType.YES_NO && (
                                    <div className="join mt-5">
                                        <button
                                            type="button"
                                            className="btn btn-primary join-item"
                                            onClick={() => handleCallback(DialogAnswer.YES)}
                                        >Áno</button>
                                        <button
                                            type="button"
                                            className="btn btn-accent join-item"
                                            onClick={() => handleCallback(DialogAnswer.NO)}
                                        >Nie</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </BaseDialog>,
                    modalRoot
                )}
        </>
    );
};

export default DialogProvider;
