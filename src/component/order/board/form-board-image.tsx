import {getBoardImagePath} from '../../../api/client/board';
import {isBlank} from '../../index.ts';

const FormBoardImage = (
    {
        boardId
    }: {
        boardId: string
    }
) => {
    return (
        <>
            {!isBlank(boardId) &&
                <img
                    className="flex-none object-scale-down object-center w-14 h-6"
                    src={getBoardImagePath(boardId)}
                    alt="Board image"
                />
            }
        </>
    )
}

export default FormBoardImage;