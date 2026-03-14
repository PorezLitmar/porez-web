import type {Edge} from '../../../api/model/porez';
import type {ClientResponse} from '../../../api/client';
import {useContext, useEffect, useState} from 'react';
import {DialogContext, ErrorContext} from '../../../state';
import FormEdgeDialog from './form-edge-dialog';
import SelectEdgeDialog from '../../edge/select-edge-dialog';
import {isBlank} from '../..';
import {DialogAnswer, DialogType} from '../../../state/dialog/model';
import FormEdgeInfo from './form-edge-info';

const FormEdgeEditor = (
    {
        disabled = false,
        label,
        name,
        allEdgesEnabled,
        edges,
        edgeId,
        setEdgeId,
        error,
        getEdge
    }: {
        disabled?: boolean,
        label?: string,
        name: string,
        allEdgesEnabled: boolean,
        edges: Edge[],
        edgeId: string,
        setEdgeId: (data: string) => void,
        error?: string,
        getEdge: (id: string) => Promise<ClientResponse<Edge>>
    }
) => {
    const dialogState = useContext(DialogContext);
    const errorState = useContext(ErrorContext);

    const [showDialog, setShowDialog] = useState(false);

    const [edge, setEdge] = useState<Edge>();

    useEffect(() => {
        (async () => {
            if (isBlank(edgeId)) {
                setEdge(undefined);
                return;
            }
            const response = await getEdge(edgeId);
            const edge = response.data;
            setEdge(edge);
            errorState?.addError(response.error);
        })();
    }, [edgeId])

    return (
        <>
            <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">{label}</legend>
                <div
                    className="flex flex-row justify-center items-center px-1.5 py-0.5 border border-base-300 rounded w-full">
                    <div className="flex flex-row justify-start items-center w-full">
                        <FormEdgeInfo edgeId={edgeId} getEdge={getEdge}/>
                    </div>

                    <div className="join join-horizontal flex-none">
                        <button
                            type="button"
                            disabled={disabled || edges.length === 0}
                            title="Upraviť"
                            className="btn btn-primary btn-sm join-item"
                            onClick={() => setShowDialog(true)}
                        ><span className="icon-[lucide--edit] text-base"></span>
                        </button>

                        <button
                            type="button"
                            disabled={isBlank(edgeId) || disabled}
                            title="Zmazať"
                            className="btn btn-accent btn-sm join-item"
                            onClick={() => {
                                dialogState?.showDialog({
                                    type: DialogType.YES_NO,
                                    title: `Zamazať hranu ${name}`,
                                    message: 'Naozaj si želáte zmazať hranu?',
                                    callback: (answer: DialogAnswer) => {
                                        if (answer === DialogAnswer.YES) {
                                            setEdgeId('');
                                        }
                                    }
                                });
                            }}
                        ><span className="icon-[lucide--trash] text-base"></span>
                        </button>
                    </div>
                </div>
                {error && <p className="label text-error text-xs">{error}</p>}
            </fieldset>

            {showDialog && !allEdgesEnabled && <FormEdgeDialog
                name={name}
                data={edge}
                setData={(edge) => setEdgeId(edge?.id ?? '')}
                edges={edges}
                showDialog={showDialog && !allEdgesEnabled}
                setShowDialog={setShowDialog}
            />}

            {showDialog && allEdgesEnabled && <SelectEdgeDialog
                dialogId={'Part-editor-select=all-edge-dialog-001'}
                showDialog={showDialog && allEdgesEnabled}
                setShowDialog={setShowDialog}
                onSelectEdge={(edge) => setEdgeId(edge?.id ?? '')}
            />}
        </>
    )
}

export default FormEdgeEditor;
