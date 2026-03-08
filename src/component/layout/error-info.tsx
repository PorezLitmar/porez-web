import {useContext} from 'react';
import type {ErrorMessage} from '../../api/model/porez';

import {ErrorContext} from '../../state';

const ErrorInfo = () => {
    const errorState = useContext(ErrorContext);

    return (
        <>
            {errorState?.data.map((item, index) =>
                <ApplicationErrorPanel key={index} index={index} applicationError={item}/>
            )}
        </>
    )
}

export default ErrorInfo;

const ApplicationErrorPanel = ({index, applicationError}: { index: number, applicationError: ErrorMessage }) => {
    const errorState = useContext(ErrorContext);

    return (
        <div className="alert alert-error text-xs">
            <span>Ospravedlňujeme sa. Nastala chyba.</span>
            <span>{`${applicationError.code}: ${applicationError.message} [${applicationError.timestamp}]`}</span>
            <button
                className="btn btn-sm normal-case text-xs"
                onClick={() => errorState?.removeError(index)}
            >Zavrieť
            </button>
        </div>
    )
}
