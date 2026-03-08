import type {FormProductCorner} from '..';
import {useContext, useEffect, useState} from 'react';
import {AppContext} from '../../../state';
import {ProductCornerType, Unit} from '../../../api/model/porez';
import {formatNumber, getEnumValue, parseNumber} from '../..';

const FormCornerInfo = (
    {
        corner
    }: {
        corner?: FormProductCorner,
    }
) => {
    const appState = useContext(AppContext);

    const [text, setText] = useState<string>();

    useEffect(() => {
        (async () => {
            setText('');
            if (corner) {
                if (corner.type === ProductCornerType.ROUNDED) {
                    setText(`r ${formatNumber(parseNumber(corner.length))} [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`);
                } else {
                    setText(`${formatNumber(parseNumber(corner.length))}x${formatNumber(parseNumber(corner.width))} [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`);
                }
            }
        })();
    }, [corner]);

    return (
        <span className="text-sm truncate">{text}</span>
    )
}

export default FormCornerInfo;