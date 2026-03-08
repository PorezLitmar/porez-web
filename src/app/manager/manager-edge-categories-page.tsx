import {NavLink, useParams} from 'react-router-dom';
import CodeListProvider from '../../state/code-list';
import CodeListItemProvider from '../../state/code-list-item';
import CategoryProvider from '../../state/category';
import EdgeProvider from '../../state/edge';
import {useContext, useEffect, useState} from 'react';
import {CategoryContext, DialogContext, EdgeContext} from '../../state';
import type {CategoryItem, CategoryItemData, CodeListItem} from '../../api/model/porez';
import SelectCategoryItemDialog from '../../component/category/select-category-item-dialog';
import PageContent from '../../component/layout/page-content';
import Table from '../../component/table';
import {DialogAnswer, DialogType} from '../../state/dialog/model';

const MANAGER_EDGE_CATEGORIES_DIALOG_ID = 'manager-edge-categories-dialog-001';

const ManagerEdgeCategoriesPage = () => {
    const {id} = useParams();

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Manažér</li>
                    <li><NavLink to="/manager/edges">Hrany</NavLink></li>
                    <li><NavLink to={`/manager/edges/${id}/categories`}>Kategórie hrany</NavLink></li>
                </ul>
            </div>
            <CodeListProvider>
                <CodeListItemProvider>
                    <CategoryProvider>
                        <EdgeProvider>
                            <ManagerEdgeCategoriesPageContent edgeId={id ?? ''}/>
                        </EdgeProvider>
                    </CategoryProvider>
                </CodeListItemProvider>
            </CodeListProvider>
        </>
    );
};

export default ManagerEdgeCategoriesPage;

const ManagerEdgeCategoriesPageContent = ({edgeId}: { edgeId: string }) => {
    const categoryState = useContext(CategoryContext);
    const dialogState = useContext(DialogContext);
    const edgeState = useContext(EdgeContext);

    const [data, setData] = useState<CategoryItem[]>();
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        (async () => {
            const response = await edgeState?.getEdge(edgeId);
            setData(response?.data?.categoryItems ?? []);
        })();
    }, [edgeId]);

    const okHandler = async (codeListItem: CodeListItem) => {
        if (data) {
            const newData: CategoryItemData[] = data.map(item => {
                return {categoryId: item.category?.id ?? '', itemId: item.id ?? ''};
            });
            newData.push({categoryId: codeListItem.codeListId ?? '', itemId: codeListItem.id ?? ''});
            const response = await edgeState?.setEdgeCategoryItems(edgeId ?? '', newData);
            setData(response?.data?.categoryItems ?? []);
            setShowDialog(false);
        }
    }

    const deleteHandler = async (categoryItem: CategoryItem) => {
        if (data) {
            const newData = [...data]
            const index = newData.findIndex(item => item.id === categoryItem.id);
            if (index !== -1) {
                newData.splice(index, 1);
                const response = await edgeState?.setEdgeCategoryItems(edgeId ?? '', newData.map(item => {
                    return {categoryId: item.category?.id ?? '', itemId: item.id ?? ''};
                }));
                setData(response?.data?.categoryItems ?? []);
            }
        }
    }

    return (
        <>
            <PageContent
                toolBar={<div>hello</div>}
            >
                <Table
                    fields={['rn', 'code', 'name', 'category', 'actions']}
                    tableHeaderColumn={(field) => {
                        switch (field) {
                            case 'rn':
                                return (<th key={field}></th>);
                            case 'code':
                                return (<th key={field}>Kód</th>);
                            case 'name':
                                return (<th key={field}>Hodnota</th>);
                            case 'category':
                                return (<th key={field}>Kategória</th>);
                            case 'actions':
                                return (
                                    <th key={field}>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm btn-circle"
                                            disabled={edgeState?.busy}
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
                                return (<td key={field}>{row.name}</td>);
                            case 'category':
                                return (<td key={field}>{`${row.category?.code}:${row.category?.name}`}</td>);
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
                                                    title: 'Zmazať kategóriu hrany',
                                                    message: `Naozaj si želáte zmazať kategóriu hrany? [${row.code} ${row.name}]`,
                                                    callback: (answer: DialogAnswer) => {
                                                        if (answer === DialogAnswer.YES) {
                                                            (async () => {
                                                                await deleteHandler(row);
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

            {showDialog && <SelectCategoryItemDialog
                dialogId={MANAGER_EDGE_CATEGORIES_DIALOG_ID}
                categories={categoryState?.edgeCategories ?? []}
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                onSelectCodeListItem={okHandler}
            />}
        </>
    )
}