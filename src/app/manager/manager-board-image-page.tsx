import {NavLink, useParams} from 'react-router-dom';
import BoardProvider from '../../state/board';
import {useContext, useEffect, useState} from 'react';
import {BoardContext, DialogContext} from '../../state';
import {getBoardImagePath} from '../../api/client/board';
import ImageDialog from '../../component/dialog/image-dialog.tsx';
import {DialogAnswer, DialogType} from '../../state/dialog/model.ts';

const MANAGER_BOARD_IMAGE_DIALOG_ID = 'manager-board-image-dialog-001';

const ManagerBoardImagePage = () => {
    const {id} = useParams();

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Manažér</li>
                    <li><NavLink to="/manager/boards">Dosky</NavLink></li>
                    <li><NavLink to={`/manager/boards/${id}/image`}>Obrázok dosky</NavLink></li>
                </ul>
            </div>

            <BoardProvider>
                <ManagerBoardImagePageContent boardId={id ?? ''}/>
            </BoardProvider>
        </>
    );
};

export default ManagerBoardImagePage;

const ManagerBoardImagePageContent = ({boardId}: { boardId: string }) => {
    const dialogState = useContext(DialogContext);
    const boardState = useContext(BoardContext);

    const [data, setData] = useState<string>();
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        (async () => {
            if (boardId !== undefined) {
                setData(getBoardImagePath(boardId));
            } else {
                setData(undefined);
            }
        })();
    }, [boardId, data]);

    return (
        <>
            <div className="join">
                <button
                    type="button"
                    className="btn btn-secondary btn-sm join-item"
                    disabled={boardState?.busy}
                    onClick={() => {
                        setShowDialog(true);
                    }}
                ><span className="icon-[lucide--edit] text-base"></span>
                </button>
                <button
                    className="btn btn-accent btn-sm join-item"
                    type="button"
                    disabled={boardState?.busy}
                    onClick={() => {
                        dialogState?.showDialog({
                            type: DialogType.YES_NO,
                            title: 'Zmazať obrázok dosky',
                            message: 'Naozaj si želáte zmazať obrázok dosky?',
                            callback: (answer: DialogAnswer) => {
                                if (answer === DialogAnswer.YES) {
                                    (async () => {
                                        await boardState?.deleteBoardImage(boardId ?? '');
                                        setData(undefined);
                                    })();
                                }
                            }
                        });
                    }}
                ><span className="icon-[lucide--trash] text-base"></span></button>
            </div>

            <div className="flex flex-row w-full items-center justify-center">
                <img
                    className="flex-none w-48 h-48 object-scale-down object-center"
                    src={data}
                    alt="Obrázok dosky"
                />
            </div>

            {showDialog && <ImageDialog
                dialogId={MANAGER_BOARD_IMAGE_DIALOG_ID}
                showDialog={showDialog}
                okHandler={async (file) => {
                    await boardState?.setBoardImage(boardId ?? '', file);
                    setData(undefined);
                    setShowDialog(false);
                }}
                cancelHandler={() => setShowDialog(false)}
            />}
        </>
    )
};