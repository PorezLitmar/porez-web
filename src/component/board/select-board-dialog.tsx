import type {Board} from '../../api/model/porez';
import {Unit} from '../../api/model/porez';
import {useContext, useEffect, useState} from 'react';
import {AppContext, BoardContext, DialogContext} from '../../state';
import {createPortal} from 'react-dom';
import BaseDialog from '../dialog/base-dialog';
import PageContent from '../layout/page-content';
import BoardSearchCriteriaForm from './board-search-criteria-form';
import Pageable from '../pageable';
import Table from '../table';
import {formatBoolean, formatNumber, getEnumValue} from '..';
import InfoIcon from '../info-icon';
import {getBoardImagePath} from '../../api/client/board';
import FormRadio from '../form/form-radio';

const SelectBoardDialog = (
    {
        dialogId,
        showDialog,
        setShowDialog,
        onSelectBoard
    }: {
        dialogId: string,
        showDialog: boolean,
        setShowDialog: (showDialog: boolean) => void,
        onSelectBoard: (selected: Board) => void,
    }
) => {
    const appState = useContext(AppContext);
    const boardState = useContext(BoardContext);
    const dialogState = useContext(DialogContext);

    const [selected, setSelected] = useState<Board>();

    useEffect(() => {
        boardState?.getBoards().then();
    }, [showDialog]);

    useEffect(() => {
        if (selected) {
            if (boardState?.data?.find(item => item.id === selected.id) === undefined) {
                (async () => setSelected(undefined))();
            }
        }
    }, [boardState?.data]);

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog
            id={dialogId}
            maxWidth={true}
            showDialog={showDialog}
            closeHandler={() => setShowDialog(false)}
        >
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">Vybrať dosku</div>
                </div>

                <PageContent
                    toolBar={
                        <BoardSearchCriteriaForm
                            searchHandler={(criteria) => boardState?.setCriteria(criteria)}/>
                    }

                    pageNav={
                        <Pageable
                            isPrevious={boardState?.previous ?? false}
                            previousHandler={() => boardState?.setPage(boardState?.page - 1)}
                            page={(boardState?.page ?? 0) + 1}
                            totalPages={boardState?.totalPages ?? 0}
                            isNext={boardState?.next ?? false}
                            nextHandler={() => boardState?.setPage(boardState?.page + 1)}
                            disabled={boardState?.busy}
                        />
                    }
                >
                    <Table fields={['select', 'code', 'name', 'boardCode', 'structureCode', 'orientation',
                        'length', 'width', 'thickness', 'vatPrice', 'image']}
                           tableHeaderColumn={(field) => {
                               switch (field) {
                                   case 'select':
                                       return (<th key={field}></th>);
                                   case 'code':
                                       return (<th key={field}>Kód</th>);
                                   case 'name':
                                       return (<th key={field}>Názov</th>);
                                   case 'boardCode':
                                       return (<th key={field}>Kód dosky</th>);
                                   case 'structureCode':
                                       return (<th key={field}>Kód štruktúry</th>);
                                   case 'orientation':
                                       return (<th key={field}>Orientácia</th>);
                                   case 'length':
                                       return (
                                           <th key={field}>{`Dĺžka [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}</th>
                                       );
                                   case 'width':
                                       return (
                                           <th key={field}>{`Šírka [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}</th>
                                       );
                                   case 'thickness':
                                       return (
                                           <th key={field}>{`Hrúbka [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}</th>
                                       );
                                   case 'vatPrice':
                                       return (
                                           <th key={field}>{`Cena s DPH [${getEnumValue(Unit.CURRENCY, appState?.units ?? [])}]`}</th>
                                       );
                                   case 'image':
                                       return (<th key={field}>Obrázok</th>);
                               }
                           }}
                           rows={boardState?.data}
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
                                   case 'boardCode':
                                       return (<td key={field}>{row.boardCode}</td>);
                                   case 'structureCode':
                                       return (
                                           <td key={field}>{row.structureCode}</td>);
                                   case 'orientation':
                                       return (<td key={field}>{formatBoolean(row.orientation)}</td>);
                                   case 'length':
                                       return (<td key={field}>{formatNumber(row.length)}</td>);
                                   case 'width':
                                       return (<td key={field}>{formatNumber(row.width)}</td>);
                                   case 'thickness':
                                       return (<td key={field}>{formatNumber(row.thickness)}</td>);
                                   case 'vatPrice':
                                       return (<td key={field}>{formatNumber(row.vatPrice)}</td>);
                                   case 'image':
                                       return (
                                           <td key={field}>
                                               <img
                                                   className="object-center w-12 h-12"
                                                   src={getBoardImagePath(row.id ?? '')}
                                                   alt={row.name}
                                               />
                                           </td>
                                       );
                               }
                           }}
                           onRowSelected={(row) => setSelected(row)}
                    />
                </PageContent>

                <div className="flex flex-row w-full items-center justify-center mt-5">
                    <div className="join mt-5">
                        <button
                            type="button"
                            className="btn btn-primary join-item"
                            disabled={selected === undefined}
                            onClick={() => {
                                if (selected) {
                                    onSelectBoard(selected);
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

export default SelectBoardDialog;
