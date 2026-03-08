import {ProductDecorOrientation} from '../../../api/model/porez';

const FormBoardOrientation = (
    {
        showDecorOrientation,
        decorOrientation
    }: {
        showDecorOrientation: boolean,
        decorOrientation: ProductDecorOrientation
    }
) => {
    return (
        <>
            {showDecorOrientation &&
                <>
                    {
                        decorOrientation === ProductDecorOrientation.ALONG_LENGTH ?
                            <span className="icon-[lucide--arrow-right] text-base"></span>
                            :
                            <span className="icon-[lucide--arrow-up] text-base"></span>
                    }
                </>
            }
        </>
    )
}

export default FormBoardOrientation;