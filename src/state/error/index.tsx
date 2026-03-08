import type {ReactNode} from 'react';
import {useState} from 'react';
import {ErrorContext} from '../';
import type {ErrorMessage} from '../../api/model/porez';

const ErrorProvider = ({children}: { children: ReactNode }) => {
    const [data, setData] = useState<ErrorMessage[]>([]);

    const addError = (error?: ErrorMessage) => {
        if (error) {
            // functional update to avoid stale state
            setData((prev) => [...prev, error]);
        }
    };

    const removeError = (index: number) => {
        setData((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <ErrorContext.Provider value={{data, addError, removeError}}>
            {children}
        </ErrorContext.Provider>
    );
};

export default ErrorProvider;
