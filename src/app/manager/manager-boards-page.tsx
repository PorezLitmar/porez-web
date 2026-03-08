import {NavLink, useNavigate} from 'react-router-dom';
import BoardProvider from '../../state/board';
import PageContent from '../../component/layout/page-content';
import CategoryProvider from '../../state/category';
import {useContext, useEffect, useState} from 'react';
import {AppContext, BoardContext, DialogContext} from '../../state';
import {type Board, Unit} from '../../api/model/porez';
import BoardDialog from '../../component/board/board-dialog';
import BoardSearchCriteriaForm from '../../component/board/board-search-criteria-form';
import Pageable from '../../component/pageable';
import Table from '../../component/table';
import {formatBoolean, formatNumber, getEnumValue} from '../../component';
import InfoIcon from '../../component/info-icon';
import {getBoardImagePath} from '../../api/client/board';
import {DialogAnswer, DialogType} from '../../state/dialog/model';
import CodeListProvider from '../../state/code-list';
import CodeListItemProvider from '../../state/code-list-item';

const MANAGER_BOARD_DIALOG_ID = 'manager-board-dialog-001';

const ManagerBoardsPage = () => {

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Manažér</li>
                    <li><NavLink to="/manager/boards">Dosky</NavLink></li>
                </ul>
            </div>

            <BoardProvider>
                <CategoryProvider>
                    <CodeListProvider>
                        <CodeListItemProvider>
                            <ManagerBoardsPageContent/>
                        </CodeListItemProvider>
                    </CodeListProvider>
                </CategoryProvider>
            </BoardProvider>
        </>
    );
};

export default ManagerBoardsPage;

const ManagerBoardsPageContent = () => {
    const navigate = useNavigate();

    const appState = useContext(AppContext);
    const dialogState = useContext(DialogContext);
    const boardState = useContext(BoardContext);

    const [selected, setSelected] = useState<Board>();
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        boardState?.getBoards();
    }, []);

    return (
        <>
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
                <Table
                    fields={['rn', 'code', 'name', 'boardCode', 'structureCode', 'orientation', 'weight',
                        'length', 'width', 'thickness', 'price', 'vatPrice', 'categories', 'edges', 'image', 'actions']}
                    tableHeaderColumn={(field) => {
                        switch (field) {
                            case 'rn':
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
                            case 'weight':
                                return (
                                    <th key={field}>{`Hmotnosť [${getEnumValue(Unit.KILOGRAM, appState?.units ?? [])}]`}</th>
                                );
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
                            case 'price':
                                return (
                                    <th key={field}>{`Cena [${getEnumValue(Unit.CURRENCY, appState?.units ?? [])}]`}</th>
                                );
                            case 'vatPrice':
                                return (
                                    <th key={field}>{`Cena s DPH [${getEnumValue(Unit.CURRENCY, appState?.units ?? [])}]`}</th>
                                );
                            case 'categories':
                                return (<th key={field}>Kategórie</th>);
                            case 'edges':
                                return (<th key={field}>Hrany</th>);
                            case 'image':
                                return (<th key={field}>Obrázok</th>);
                            case 'actions':
                                return (
                                    <th key={field}>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm btn-circle"
                                            disabled={boardState?.busy}
                                            onClick={() => {
                                                setSelected(undefined);
                                                setShowDialog(true);
                                            }}
                                        ><span className="icon-[lucide--file-plus] text-base"></span>
                                        </button>
                                    </th>
                                );
                        }
                    }}
                    rows={boardState?.data}
                    tableRowKey={(row) => `${row.id}`}
                    tableRowColumn={(field, row, rowIndex) => {
                        switch (field) {
                            case 'rn':
                                return (<th key={field}>{`${rowIndex + 1}`}</th>);
                            case 'code':
                                return (
                                    <td key={field}>
                                        <div className="flex flex-row w-full items-center gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-xs"
                                                disabled={boardState?.busy}
                                                onClick={() => {
                                                    setSelected(row);
                                                    setShowDialog(true);
                                                }}
                                            ><span className="icon-[lucide--edit] text-base"></span></button>
                                            <span>{row.code}</span>
                                        </div>
                                    </td>
                                );
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
                                return (<td key={field}>{row.structureCode}</td>);
                            case 'orientation':
                                return (<td key={field}>{formatBoolean(row.orientation)}</td>);
                            case 'weight':
                                return (<td key={field}>{formatNumber(row.weight)}</td>);
                            case 'length':
                                return (<td key={field}>{formatNumber(row.length)}</td>);
                            case 'width':
                                return (<td key={field}>{formatNumber(row.width)}</td>);
                            case 'thickness':
                                return (<td key={field}>{formatNumber(row.thickness)}</td>);
                            case 'price':
                                return (<td key={field}>{formatNumber(row.price)}</td>);
                            case 'vatPrice':
                                return (<td key={field}>{formatNumber(row.vatPrice)}</td>);
                            case 'categories':
                                return (
                                    <td key={field}>
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-xs"
                                            disabled={boardState?.busy}
                                            onClick={() => {
                                                navigate('/manager/boards/' + row.id + '/categories');
                                            }}
                                        ><span className="icon-[lucide--list] text-base"></span></button>
                                    </td>
                                );
                            case 'edges':
                                return (
                                    <td key={field}>
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-xs"
                                            disabled={boardState?.busy}
                                            onClick={() => {
                                                navigate('/manager/boards/' + row.id + '/edges');
                                            }}
                                        ><span className="icon-[lucide--list] text-base"></span></button>
                                    </td>
                                );
                            case 'image':
                                return (
                                    <td key={field}>
                                        <div className="flex flex-row w-full items-center gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-xs"
                                                disabled={boardState?.busy}
                                                onClick={() => {
                                                    navigate('/manager/boards/' + row.id + '/image');
                                                }}
                                            ><span className="icon-[lucide--image] text-base"></span></button>
                                            <img
                                                className="object-center object-scale-down w-8 h-8"
                                                src={getBoardImagePath(row.id ?? '')}
                                                alt="Board image"
                                            />
                                        </div>
                                    </td>
                                );
                            case 'actions':
                                return (
                                    <td key={field}>
                                        <button
                                            className="btn btn-accent btn-xs"
                                            type="button"
                                            disabled={boardState?.busy}
                                            onClick={() => {
                                                dialogState?.showDialog({
                                                    type: DialogType.YES_NO,
                                                    title: 'Zmazať dosku',
                                                    message: `Naozaj si želáte zmazať dosku? [${row.code} ${row.name}]`,
                                                    callback: (answer: DialogAnswer) => {
                                                        if (answer === DialogAnswer.YES) {
                                                            (async () => {
                                                                await boardState?.deleteBoard(row.id ?? '');
                                                            })();
                                                        }
                                                    }
                                                });
                                            }}
                                        ><span className="icon-[lucide--trash] text-base"></span></button>
                                    </td>
                                );
                        }
                    }}
                />
            </PageContent>

            {showDialog && <BoardDialog
                dialogId={MANAGER_BOARD_DIALOG_ID}
                showDialog={showDialog}
                board={selected}
                okHandler={async (data) => {
                    if (selected) {
                        await boardState?.setBoard(selected.id ?? '', data);
                    } else {
                        await boardState?.addBoard(data);
                    }
                    setShowDialog(false);
                }}
                cancelHandler={() => setShowDialog(false)}
            />}
        </>
    )
}