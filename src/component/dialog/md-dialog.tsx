import {useContext, useState} from 'react';
import {DialogContext} from '../../state';
import {createPortal} from 'react-dom';
import BaseDialog from './base-dialog';
import MarkdownRenderer from '../markdown-renderer';

const MdDialog = (
    {
        dialogId,
        dialogTitle,
        showDialog,
        initialValue,
        okHandler,
        cancelHandler
    }: {
        dialogId: string,
        dialogTitle: string,
        showDialog: boolean,
        initialValue: string,
        okHandler: (value: string) => void,
        cancelHandler: () => void
    }) => {
    const dialogState = useContext(DialogContext);

    const [value, setValue] = useState(initialValue);
    const [tabIndex, setTabIndex] = useState(0);


    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog id={dialogId} showDialog={showDialog} closeHandler={cancelHandler} maxWidth={true}>
            <div className="w-full h-[90vh] flex flex-col justify-center items-center">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">{dialogTitle}</div>
                </div>

                <div role="tablist" className="tabs tabs-lift w-full">
                    <div
                        role="tab"
                        className={`tab ${tabIndex === 0 ? 'tab-active' : ''}`}
                        onClick={() => setTabIndex(0)}
                    >Editor
                    </div>
                    <div
                        role="tab"
                        className={`tab ${tabIndex === 1 ? 'tab-active' : ''}`}
                        onClick={() => setTabIndex(1)}
                    >Náhľad
                    </div>
                </div>

                {tabIndex === 0 &&
                    <textarea
                        className="textarea w-full h-full"
                        value={value}
                        onChange={event => setValue(event.target.value)}
                    />
                }

                {tabIndex === 1 &&
                    <MarkdownRenderer className="prose max-w-none w-full h-full" md={value}/>
                }

                <div className="join mt-5">
                    <button
                        type="button"
                        className="btn btn-ghost join-item"
                        onClick={() => {
                            fetch('/example.md').then(response => {
                                response.text().then(text => {
                                    setValue(text);
                                })
                            });
                        }}
                    >Ukážka
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary join-item"
                        onClick={() => okHandler(value)}
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
        </BaseDialog>
        , dialogState.modalRoot))
}

export default MdDialog;
