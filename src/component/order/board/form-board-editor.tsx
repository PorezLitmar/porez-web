import SelectBoardDialog from '../../board/select-board-dialog';
import {type Board, ProductDecorOrientation} from '../../../api/model/porez';
import {useContext, useState} from 'react';
import {DialogContext} from '../../../state';
import FormBoardInfo from './form-board-info';
import type {ClientResponse} from '../../../api/client';
import FormBoardOrientation from './form-board-orientation';
import FormBoardImage from './form-board-image';
import {isBlank} from '../..';
import {DialogAnswer, DialogType} from '../../../state/dialog/model';

const FormBoardEditor = (
    {
        disabled = false,
        label,
        showDecorOrientation,
        decorOrientation,
        name,
        boardId,
        setBoardId,
        error,
        getBoard
    }: {
        disabled?: boolean,
        label?: string,
        showDecorOrientation: boolean,
        decorOrientation: ProductDecorOrientation
        name: string,
        boardId: string,
        setBoardId: (data: string) => void,
        error?: string,
        getBoard: (id: string) => Promise<ClientResponse<Board>>
    }
) => {
    const dialogState = useContext(DialogContext);

    const [showBoardDialog, setShowBoardDialog] = useState(false);

    return (
        <>
            <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">{label}</legend>
                <div
                    className="flex flex-row justify-center items-center px-1.5 py-0.5 border border-base-300 rounded w-full">
                    <div className="flex flex-row justify-start items-center w-full">
                        <FormBoardInfo boardId={boardId} getBoard={getBoard}/>
                    </div>

                    <div className="flex flex-row justify-center items-center gap-0.5">
                        <div className="flex justify-center items-center w-6 xl:w-8 h-6 xl:h-8 border"
                             title="Orientácia štruktúry">
                            <FormBoardOrientation
                                showDecorOrientation={showDecorOrientation}
                                decorOrientation={decorOrientation}
                            />
                        </div>

                        <div className="flex justify-center items-center w-14 h-6 border"
                             title="Obrázok dosky">
                            <FormBoardImage boardId={boardId}/>
                        </div>

                        <div className="join join-horizontal flex-none">
                            <button
                                type="button"
                                disabled={disabled}
                                title="Upraviť"
                                className="btn btn-primary btn-sm join-item"
                                onClick={() => setShowBoardDialog(true)}
                            ><span className="icon-[lucide--edit] text-base"></span>
                            </button>

                            <button
                                type="button"
                                disabled={isBlank(boardId) || disabled}
                                title="Zmazať"
                                className="btn btn-accent btn-sm join-item"
                                onClick={() => {
                                    dialogState?.showDialog({
                                        type: DialogType.YES_NO,
                                        title: `Zamazať dosku ${name}`,
                                        message: 'Naozaj si želáte zmazať dosku?',
                                        callback: (answer: DialogAnswer) => {
                                            if (answer === DialogAnswer.YES) {
                                                setBoardId('');
                                            }
                                        }
                                    });
                                }}
                            ><span className="icon-[lucide--trash] text-base"></span>
                            </button>
                        </div>
                    </div>
                </div>
                {error && <p className="label text-error text-xs">{error}</p>}
            </fieldset>

            {showBoardDialog && <SelectBoardDialog
                dialogId="form-board-ditor-dialog-001"
                showDialog={showBoardDialog}
                setShowDialog={setShowBoardDialog}
                onSelectBoard={(board) => setBoardId(board?.id ?? '')}
            />}
        </>
    )
}

export default FormBoardEditor;