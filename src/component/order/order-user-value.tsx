import type {OrderUser} from '../../api/model/porez';
import {useEffect, useState} from 'react';

const OrderUserValue = ({value}: { value?: OrderUser }) => {

    const [data, setData] = useState('');

    const isBlank = (s?: string) => {
        if (s === undefined) {
            return true;
        }
        if (s === null) {
            return true;
        }
        return s.trim().length === 0;
    }

    useEffect(() => {
        (async () => {
            if (value) {
                let result = '';

                if (!isBlank(value.title)) {
                    result += value.title + ' ';
                }

                result += value.firstName + ' ';

                result += value.lastName;

                setData(result);
            } else {
                setData('');
            }
        })();
    }, [value]);

    return (
        <>
            {data}
        </>
    )
}

export default OrderUserValue;