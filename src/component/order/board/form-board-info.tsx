import {useContext, useEffect, useState} from 'react';
import {AppContext} from '../../../state';
import {formatNumber, getEnumValue, isBlank} from '../..';
import {type Board, Unit} from '../../../api/model/porez';
import type {ClientResponse} from '../../../api/client';

const FormBoardInfo = (
    {
        boardId,
        getBoard,
    }: {
        boardId: string,
        getBoard: (id: string) => Promise<ClientResponse<Board>>
    }
) => {
    const appState = useContext(AppContext);

    const [text, setText] = useState<string>();

    useEffect(() => {
        (async () => {
            if (isBlank(boardId)) {
                setText('');
                return;
            }

            const response = await getBoard(boardId);
            const board = response.data;
            const boardText = board ? `${board.boardCode} ${board.structureCode} ${board.name} ${formatNumber(board.length)}x${formatNumber(board.width)}x${formatNumber(board.thickness)} [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]` : '';
            setText(boardText);
        })();
    }, [boardId]);

    return (
        <span className="text-sm truncate">{text}</span>
    )
}

export default FormBoardInfo;