import {NavLink, useNavigate} from 'react-router-dom';
import EdgeProvider from '../../state/edge';
import {useContext, useEffect, useState} from 'react';
import {AppContext, DialogContext, EdgeContext} from '../../state';
import {type Edge, Unit} from '../../api/model/porez';
import EdgeDialog from '../../component/edge/edge-dialog.tsx';
import PageContent from '../../component/layout/page-content.tsx';
import EdgeSearchCriteriaForm from '../../component/edge/edge-search-criteria-form.tsx';
import CategoryProvider from '../../state/category';
import CodeListItemProvider from '../../state/code-list-item';
import CodeListProvider from '../../state/code-list';
import Pageable from '../../component/pageable.tsx';
import Table from '../../component/table.tsx';
import {formatNumber, getEnumValue} from '../../component';
import InfoIcon from '../../component/info-icon.tsx';
import {DialogAnswer, DialogType} from '../../state/dialog/model.ts';

const MANAGER_EDGE_DIALOG_ID = 'manager-edge-dialog-001';

const ManagerEdgesPage = () => {

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Manažér</li>
                    <li><NavLink to="/manager/edges">Hrany</NavLink></li>
                </ul>
            </div>

            <CodeListProvider>
                <CodeListItemProvider>
                    <CategoryProvider>
                        <EdgeProvider>
                            <ManagerEdgesPageContent/>
                        </EdgeProvider>
                    </CategoryProvider>
                </CodeListItemProvider>
            </CodeListProvider>
        </>
    );
};

export default ManagerEdgesPage;

const ManagerEdgesPageContent = () => {
    const navigate = useNavigate();

    const appState = useContext(AppContext);
    const dialogState = useContext(DialogContext);
    const edgeState = useContext(EdgeContext);

    const [selected, setSelected] = useState<Edge>();

    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        void edgeState?.getEdges();
    }, []);

    return (
        <>
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
                    fields={['rn', 'code', 'name', 'weight', 'width', 'thickness', 'price', 'vatPrice', 'categories', 'actions']}
                    tableHeaderColumn={(field) => {
                        switch (field) {
                            case 'rn':
                                return (<th key={field}></th>);
                            case 'code':
                                return (<th key={field}>Kód</th>);
                            case 'name':
                                return (<th key={field}>Názov</th>);
                            case 'weight':
                                return (
                                    <th key={field}>{`Hmotnosť [${getEnumValue(Unit.KILOGRAM, appState?.units ?? [])}]`}</th>
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
                            case 'actions':
                                return (
                                    <th key={field}>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm btn-circle"
                                            disabled={edgeState?.busy}
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
                    rows={edgeState?.data}
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
                                                disabled={edgeState?.busy}
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
                            case 'weight':
                                return (<td key={field}>{formatNumber(row.weight)}</td>);
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
                                            disabled={edgeState?.busy}
                                            onClick={() => {
                                                navigate('/manager/edges/' + row.id + '/categories');
                                            }}
                                        ><span className="icon-[lucide--list] text-base"></span></button>
                                    </td>
                                );
                            case 'actions':
                                return (
                                    <td key={field}>
                                        <button
                                            className="btn btn-accent btn-xs"
                                            type="button"
                                            disabled={edgeState?.busy}
                                            onClick={() => {
                                                dialogState?.showDialog({
                                                    type: DialogType.YES_NO,
                                                    title: 'Zmazať hranu',
                                                    message: `Naozaj si želáte zmazať hranu? [${row.code} ${row.name}]`,
                                                    callback: (answer: DialogAnswer) => {
                                                        if (answer === DialogAnswer.YES) {
                                                            (async () => {
                                                                await edgeState?.deleteEdge(row.id ?? '');
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

            {showDialog && <EdgeDialog
                dialogId={MANAGER_EDGE_DIALOG_ID}
                showDialog={showDialog}
                edge={selected}
                okHandler={async (data) => {
                    if (selected !== undefined) {
                        await edgeState?.setEdge(selected.id ?? '', data);
                    } else {
                        await edgeState?.addEdge(data);
                    }
                    setShowDialog(false);
                }}
                cancelHandler={() => setShowDialog(false)}
            />}
        </>
    )
}