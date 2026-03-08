import type {Edge} from '../../api/model/porez';
import {Unit} from '../../api/model/porez';
import {useContext, useEffect, useState} from 'react';
import {AppContext, DialogContext, EdgeContext} from '../../state';
import {createPortal} from 'react-dom';
import BaseDialog from '../dialog/base-dialog';
import PageContent from '../layout/page-content';
import Table from '../table';
import EdgeSearchCriteriaForm from './edge-search-criteria-form';
import Pageable from '../pageable';
import {formatNumber, getEnumValue} from '..';
import InfoIcon from '../info-icon';
import FormRadio from '../form/form-radio';

const SelectEdgeDialog = (
    {
        dialogId,
        showDialog,
        setShowDialog,
        onSelectEdge
    }: {
        dialogId: string,
        showDialog: boolean,
        setShowDialog: (showDialog: boolean) => void,
        onSelectEdge: (selected: Edge) => void,
    }
) => {
    const appState = useContext(AppContext);
    const edgeState = useContext(EdgeContext);
    const dialogState = useContext(DialogContext);

    const [selected, setSelected] = useState<Edge>();

    useEffect(() => {
        void edgeState?.getEdges();
    }, [showDialog]);

    useEffect(() => {
        if (selected) {
            if (edgeState?.data?.find(item => item.id === selected.id) === undefined) {
                (async () => setSelected(undefined))();
            }
        }
    }, [edgeState?.data]);

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog
            id={dialogId}
            maxWidth={true}
            showDialog={showDialog}
            closeHandler={() => setShowDialog(false)}
        >
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">Vybrať hranu</div>
                </div>
                <PageContent
                    toolBar={
                        <EdgeSearchCriteriaForm
                            searchHandler={(criteria) => edgeState?.setCriteria(criteria)}/>
                    }

                    pageNav={
                        <Pageable
                            isPrevious={edgeState?.previous ?? false}
                            previousHandler={() => edgeState?.setPage(edgeState?.page - 1)}
                            page={(edgeState?.page ?? 0) + 1}
                            totalPages={edgeState?.totalPages ?? 0}
                            isNext={edgeState?.next ?? false}
                            nextHandler={() => edgeState?.setPage(edgeState?.page + 1)}
                            disabled={edgeState?.busy}
                        />
                    }
                >
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
                        rows={edgeState?.data}
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

                <div className="flex flex-row w-full items-center justify-center mt-5">
                    <div className="join">
                        <button
                            type="button"
                            className="btn btn-primary join-item"
                            disabled={selected === undefined}
                            onClick={() => {
                                if (selected) {
                                    onSelectEdge(selected);
                                    setShowDialog(false);
                                }
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

export default SelectEdgeDialog;
