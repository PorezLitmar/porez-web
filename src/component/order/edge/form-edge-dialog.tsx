import {type Edge, Unit} from '../../../api/model/porez';
import {useContext, useEffect, useState} from 'react';
import {AppContext, DialogContext} from '../../../state';
import {createPortal} from 'react-dom';
import BaseDialog from '../../dialog/base-dialog';
import PageContent from '../../layout/page-content';
import Table from '../../table';
import {formatNumber, getEnumValue} from '../..';
import FormRadio from '../../form/form-radio';
import InfoIcon from '../../info-icon';

const FormEdgeDialog = ({name, edges, data, setData, showDialog, setShowDialog}: {
    name?: string,
    edges?: Edge[],
    data?: Edge,
    setData: (data: Edge) => void,
    showDialog: boolean,
    setShowDialog: (showDialog: boolean) => void
}) => {
    const appState = useContext(AppContext);
    const dialogState = useContext(DialogContext);

    const [title, setTitle] = useState('');

    const [selected, setSelected] = useState<Edge>();

    useEffect(() => {
        (async () => {
            if (name) {
                setTitle(`Zvoľte hranu ${name}`);
            } else {
                setTitle('Zvoľte hranu');
            }
            setSelected(data);
        })();
    }, [data, showDialog]);

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog
            id="form-edge-dialog-001"
            maxWidth={true}
            showDialog={showDialog}
            closeHandler={() => setShowDialog(false)}
        >
            <div className="container p-5 mx-auto">
                <div className="flex flex-col items-center justify-center gap-5">
                    <div className="text-lg font-bold text-center">{title}</div>
                    <PageContent>
                        <Table
                            fields={['select', 'code', 'name', 'width', 'thickness', 'price', 'vatPrice']}
                            tableHeaderColumn={(field) => {
                                switch (field) {
                                    case 'select':
                                        return (<th key={field}></th>);
                                    case 'code':
                                        return (<th key={field}>Kód</th>);
                                    case 'name':
                                        return (<th key={field}>Názov</th>);
                                    case 'width':
                                        return (
                                            <th key={field}>{`Šírka [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}</th>
                                        );
                                    case 'thickness':
                                        return (
                                            <th key={field}>{`Hrúbka [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}</th>
                                        );
                                    case 'price':
                                        return (
                                            <th key={field}>{`Cena [${getEnumValue(Unit.CURRENCY, appState?.units ?? [])}]`}</th>
                                        );
                                    case 'vatPrice':
                                        return (
                                            <th key={field}>{`Cena s DPH [${getEnumValue(Unit.CURRENCY, appState?.units ?? [])}]`}</th>
                                        );
                                }
                            }}
                            rows={edges}
                            tableRowKey={(row) => `${row.id}`}
                            tableRowColumn={(field, row) => {
                                switch (field) {
                                    case 'select':
                                        return (
                                            <td key={field}>
                                                <FormRadio
                                                    name=""
                                                    value={row.id === selected?.id}
                                                    onChange={(event) => {
                                                        if (event.target.checked) {
                                                            setSelected(row);
                                                        }
                                                    }}/>
                                            </td>
                                        );
                                    case 'code':
                                        return (<td key={field}>{row.code}</td>);
                                    case 'name':
                                        return (
                                            <td key={field}>
                                                <div className="flex flex-row w-full justify-center items-center">
                                                    <div className="w-full">
                                                        <span>{row.name}</span>
                                                    </div>
                                                    <InfoIcon info={row.description}/>
                                                </div>
                                            </td>
                                        );
                                    case 'width':
                                        return (<td key={field}>{formatNumber(row.width)}</td>);
                                    case 'thickness':
                                        return (<td key={field}>{formatNumber(row.thickness)}</td>);
                                    case 'price':
                                        return (<td key={field}>{formatNumber(row.price)}</td>);
                                    case 'vatPrice':
                                        return (<td key={field}>{formatNumber(row.vatPrice)}</td>);
                                }
                            }}
                            onRowSelected={(row) => setSelected(row)}
                        />
                    </PageContent>

                    <div className="join mt-5">
                        <button
                            type="button"
                            className="btn btn-primary join-item"
                            disabled={selected === undefined}
                            onClick={() => {
                                if (selected) {
                                    setData(selected);
                                }
                                setShowDialog(false);
                            }}
                        >Potvrdiť
                        </button>
                        <button
                            type="button"
                            className="btn btn-accent join-item"
                            onClick={() => setShowDialog(false)}
                        >Zrušiť
                        </button>
                    </div>

                </div>
            </div>
        </BaseDialog>, dialogState.modalRoot))
}

export default FormEdgeDialog;
