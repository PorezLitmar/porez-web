import {NavLink, useParams} from 'react-router-dom';
import BoardProvider from '../../state/board';
import CategoryProvider from '../../state/category';
import EdgeProvider from '../../state/edge';
import {useContext, useEffect, useState} from 'react';
import {AppContext, BoardContext, DialogContext} from '../../state';
import {type Edge, Unit} from '../../api/model/porez';
import SelectEdgeDialog from '../../component/edge/select-edge-dialog';
import PageContent from '../../component/layout/page-content';
import Table from '../../component/table';
import {formatNumber, getEnumValue} from '../../component';
import InfoIcon from '../../component/info-icon';
import {DialogAnswer, DialogType} from '../../state/dialog/model';
import CodeListProvider from '../../state/code-list';
import CodeListItemProvider from '../../state/code-list-item';

const MANAGER_BOARD_EDGES_DIALOG_ID = 'manager-board-edges-dialog-001';

const ManagerBoardEdgesPage = () => {
    const {id} = useParams();

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Manažér</li>
                    <li><NavLink to="/manager/boards">Dosky</NavLink></li>
                    <li><NavLink to={`/manager/boards/${id}/edges`}>Hrany dosky</NavLink></li>
                </ul>
            </div>

            <BoardProvider>
                <EdgeProvider>
                    <CategoryProvider>
                        <CodeListProvider>
                            <CodeListItemProvider>
                                <ManagerBoardEdgesPageContent boardId={id ?? ''}/>
                            </CodeListItemProvider>
                        </CodeListProvider>
                    </CategoryProvider>
                </EdgeProvider>
            </BoardProvider>
        </>
    );
};

export default ManagerBoardEdgesPage;

const ManagerBoardEdgesPageContent = ({boardId}: { boardId: string }) => {
    const appState = useContext(AppContext);
    const dialogState = useContext(DialogContext);
    const boardState = useContext(BoardContext);

    const [data, setData] = useState<Edge[]>([]);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        (async () => {
            const response = await boardState?.getBoard(boardId);
            setData(response?.data?.edges ?? []);
        })();
    }, [boardId]);

    const okHandler = async (edge: Edge) => {
        if (data) {
            const newData: Edge[] = [edge, ...data];
            const response = await boardState?.setBoardEdges(boardId ?? '', newData.map(item => item.id ?? ''));
            setData(response?.data?.edges ?? []);
        }
    }

    const deleteHandler = async (edge: Edge) => {
        if (data) {
            const newData = [...data]
            const index = newData.findIndex(item => item.id === edge.id);
            if (index !== -1) {
                newData.splice(index, 1);
                const response = await boardState?.setBoardEdges(boardId ?? '', newData.map(item => item.id ?? ''));
                setData(response?.data?.edges ?? []);
            }
        }
    }

    return (
        <>
            <PageContent>
                <Table
                    fields={['rn', 'code', 'name', 'width', 'thickness', 'price', 'vatPrice', 'actions']}
                    tableHeaderColumn={(field) => {
                        switch (field) {
                            case 'rn':
                                return (<th key={field}></th>);
                            case 'code':
                                return (<th key={field}>Kód</th>);
                            case 'name':
                                return (<th key={field}>Názov</th>);
                            case 'width':
                                return (
                                    <th key={field}>{`Šírka [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}</th>);
                            case 'thickness':
                                return (
                                    <th key={field}>{`Hrúbka [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}</th>);
                            case 'price':
                                return (
                                    <th key={field}>{`Cena [${getEnumValue(Unit.CURRENCY, appState?.units ?? [])}]`}</th>);
                            case 'vatPrice':
                                return (
                                    <th key={field}>{`Cena s DPH [${getEnumValue(Unit.CURRENCY, appState?.units ?? [])}]`}</th>);
                            case 'actions':
                                return (
                                    <th key={field}>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm btn-circle"
                                            disabled={boardState?.busy}
                                            onClick={() => {
                                                setShowDialog(true);
                                            }}
                                        ><span className="icon-[lucide--file-plus] text-base"></span>
                                        </button>
                                    </th>
                                );
                        }
                    }}
                    rows={data}
                    tableRowKey={(row) => `${row.id}`}
                    tableRowColumn={(field, row, rowIndex) => {
                        switch (field) {
                            case 'rn':
                                return (<th key={field}>{`${rowIndex + 1}`}</th>);
                            case 'code':
                                return (<td key={field}>{row.code}</td>);
                            case 'name':
                                return (
                                    <td key={field}>
                                        <div className="flex flex-row w-full justify-center items-center">
                                            <div className="w-full">
                                                {row.name}
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
                                                    title: 'Zmazať hranu dosky',
                                                    message: `Naozaj si želáte zmazať hranu dosky? [${row.code} ${row.name}]`,
                                                    callback: (answer: DialogAnswer) => {
                                                        if (answer === DialogAnswer.YES) {
                                                            void deleteHandler(row);
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

            {showDialog && <SelectEdgeDialog
                dialogId={MANAGER_BOARD_EDGES_DIALOG_ID}
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                onSelectEdge={okHandler}
            />}
        </>
    )
}