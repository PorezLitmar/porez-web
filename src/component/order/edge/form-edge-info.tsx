import type {ClientResponse} from '../../../api/client';
import {type Edge, Unit} from '../../../api/model/porez';
import {useContext, useEffect, useState} from 'react';
import {AppContext} from '../../../state';
import {formatNumber, getEnumValue, isBlank} from '../..';

const FormEdgeInfo = (
    {
        edgeId,
        getEdge
    }: {
        edgeId: string,
        getEdge: (id: string) => Promise<ClientResponse<Edge>>
    }
) => {
    const appState = useContext(AppContext);

    const [text, setText] = useState<string>();

    useEffect(() => {
        (async () => {
            if (isBlank(edgeId)) {
                setText('');
                return;
            }

            const response = await getEdge(edgeId);
            const edge = response.data;
            const boardText = edge ? `${edge.name} ${formatNumber(edge.width)}x${formatNumber(edge.thickness)} ${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}` : '';
            setText(boardText);
        })();
    }, [edgeId]);

    return (
        <span className="text-sm truncate">{text}</span>
    )
}

export default FormEdgeInfo;