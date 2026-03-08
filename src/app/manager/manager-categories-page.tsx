import {NavLink, useNavigate} from 'react-router-dom';
import CodeListProvider from '../../state/code-list';
import PageContent from '../../component/layout/page-content';
import {useContext, useEffect, useState} from 'react';
import {CategoryContext, CodeListContext, DialogContext} from '../../state';
import type {Category} from '../../api/model/porez';
import CategoryDialog from '../../component/category/category-dialog';
import Pageable from '../../component/pageable.tsx';
import Table from '../../component/table.tsx';
import {DialogAnswer, DialogType} from '../../state/dialog/model.ts';
import CategoryProvider from '../../state/category';
import FormCheckBox from '../../component/form/form-check-box.tsx';
import FormRadio from '../../component/form/form-radio.tsx';

const MANAGER_CATEGORY_DIALOG_ID = 'manager-category-dialog-001';

const ManagerCategoriesPage = () => {

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Manažér</li>
                    <li><NavLink to="/manager/categories">Kategórie</NavLink></li>
                </ul>
            </div>

            <CategoryProvider>
                <CodeListProvider>
                    <ManagerCategoriesPageContent/>
                </CodeListProvider>
            </CategoryProvider>
        </>
    );
};

export default ManagerCategoriesPage;

const ManagerCategoriesPageContent = () => {
    const navigate = useNavigate();

    const categoryState = useContext(CategoryContext);
    const codeListState = useContext(CodeListContext);
    const dialogState = useContext(DialogContext);

    const [selected, setSelected] = useState<Category>();

    const [searchField, setSearchField] = useState('');

    const [showDialog, setShowDialog] = useState(false);

    const fetchData = () => {
        codeListState?.setCriteria({searchField});
    }

    useEffect(() => {
        fetchData();
    }, []);

    const toggleEdgeCategory = (codeList: Category) => {
        if (categoryState?.isEdgeCategory(codeList)) {
            categoryState?.deleteEdgeCategory(codeList);
        } else {
            categoryState?.addEdgeCategory(codeList);
        }
    }

    const toggleBoardCategory = (codeList: Category) => {
        if (categoryState?.isBoardCategory(codeList)) {
            categoryState?.deleteBoardCategory(codeList);
        } else {
            categoryState?.addBoardCategory(codeList);
        }
    }

    return (
        <>
            <PageContent
                toolBar={
                    <div className="join join-horizontal w-full">
                        <input
                            type="text"
                            className="join-item input input-bordered w-full"
                            placeholder="Názov alebo kód"
                            value={searchField}
                            onChange={event => setSearchField(event.target.value)}
                            onKeyUp={(event) => {
                                if (event.key === 'Enter') {
                                    fetchData();
                                }
                            }}
                        />
                        <button
                            className="join-item btn"
                            onClick={fetchData}
                        ><span className="icon-[lucide--search] text-base"></span></button>
                    </div>
                }

                pageNav={
                    <Pageable
                        isPrevious={codeListState?.previous ?? false}
                        previousHandler={() => codeListState?.setPage(codeListState?.page - 1)}
                        page={(codeListState?.page ?? 0) + 1}
                        totalPages={codeListState?.totalPages ?? 0}
                        isNext={codeListState?.next ?? false}
                        nextHandler={() => codeListState?.setPage(codeListState?.page + 1)}
                        disabled={codeListState?.busy}
                    />
                }
            >
                <Table
                    fields={['rn', 'category', 'items', 'edge', 'board', 'material', 'actions']}
                    tableHeaderColumn={(field) => {
                        switch (field) {
                            case 'rn':
                                return (<th key={field}></th>);
                            case 'category':
                                return (<th key={field}>Kategória</th>);
                            case 'items':
                                return (<th key={field}>Položky</th>);
                            case 'edge':
                                return (<th key={field}>Hrana</th>);
                            case 'board':
                                return (<th key={field}>Doska</th>);
                            case 'material':
                                return (<th key={field}>Materiál</th>);
                            case 'actions':
                                return (
                                    <th key={field}>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm btn-circle"
                                            disabled={codeListState?.busy}
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
                    rows={codeListState?.data}
                    tableRowKey={(row) => `${row.id}`}
                    tableRowColumn={(field, row, rowIndex) => {
                        switch (field) {
                            case 'rn':
                                return (<th key={field}>{`${rowIndex + 1}`}</th>);
                            case 'category':
                                return (
                                    <td key={field}>
                                        <div className="flex flex-row w-full items-center gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-xs"
                                                disabled={codeListState?.busy}
                                                onClick={() => {
                                                    setSelected(row);
                                                    setShowDialog(true);
                                                }}
                                            ><span className="icon-[lucide--edit] text-base"></span></button>
                                            <span>{row.code}:{row.name}</span>
                                        </div>
                                    </td>
                                );
                            case 'items':
                                return (
                                    <td key={field}>
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-xs"
                                            disabled={codeListState?.busy}
                                            onClick={() => {
                                                navigate('/manager/categories/' + row.id + '/items');
                                            }}
                                        ><span className="icon-[lucide--list] text-base"></span></button>
                                    </td>
                                );
                            case 'edge':
                                return (
                                    <td key={field}>
                                        <FormCheckBox
                                            name="board"
                                            disabled={categoryState?.busy}
                                            value={categoryState?.isEdgeCategory(row)}
                                            onChange={() => toggleEdgeCategory(row)}
                                        />
                                    </td>
                                );
                            case 'board':
                                return (
                                    <td key={field}>
                                        <FormCheckBox
                                            name="board"
                                            disabled={categoryState?.busy}
                                            value={categoryState?.isBoardCategory(row)}
                                            onChange={() => toggleBoardCategory(row)}
                                        />
                                    </td>
                                );
                            case 'material':
                                return (
                                    <td key={field}>
                                        <FormRadio
                                            name="board"
                                            disabled={categoryState?.busy}
                                            value={categoryState?.isMaterialCategory(row)}
                                            onChange={() => categoryState?.setMaterialCategory(row)}
                                        />
                                    </td>
                                );
                            case 'actions':
                                return (
                                    <td key={field}>
                                        <button
                                            className="btn btn-accent btn-xs"
                                            type="button"
                                            disabled={codeListState?.busy}
                                            onClick={() => {
                                                dialogState?.showDialog({
                                                    type: DialogType.YES_NO,
                                                    title: 'Zmazať kategóriu',
                                                    message: `Naozaj si želáte zmazať kategóriu? [${row.code}:${row.name}]`,
                                                    callback: (answer: DialogAnswer) => {
                                                        if (answer === DialogAnswer.YES) {
                                                            (async () => {
                                                                await codeListState?.deleteCodeList(row.id ?? '');
                                                                await categoryState?.reload();
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

            {showDialog &&
                <CategoryDialog
                    dialogId={MANAGER_CATEGORY_DIALOG_ID}
                    showDialog={showDialog}
                    codeList={selected}
                    okHandler={async (data) => {
                        if (selected) {
                            codeListState?.setCodeList(selected.id ?? '', data).then();
                        } else {
                            codeListState?.addCodeList(data).then();
                        }
                        setShowDialog(false);
                    }}
                    cancelHandler={() => setShowDialog(false)}
                />
            }
        </>
    )
}
