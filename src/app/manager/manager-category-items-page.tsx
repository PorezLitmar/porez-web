import {NavLink, useParams} from 'react-router-dom';
import CodeListProvider from '../../state/code-list';
import CodeListItemProvider from '../../state/code-list-item';
import PageContent from '../../component/layout/page-content';
import SelectCategoryItem from '../../component/category/select-category-item';
import {useContext, useEffect, useState} from 'react';
import {CodeListItemContext, DialogContext} from '../../state';
import type {CodeListItem} from '../../api/model/porez';
import Pageable from '../../component/pageable';
import CategoryItemDialog from '../../component/category/category-item-dialog';
import {formatBoolean, formatNumber} from '../../component';
import Table from '../../component/table';
import {DialogAnswer, DialogType} from '../../state/dialog/model';

const MANAGER_CATEGORY_ITEM_DIALOG_ID = 'manager-category-item-dialog-001';

const ManagerCategoryItemsPage = () => {
    const {id} = useParams();

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Manažér</li>
                    <li><NavLink to="/manager/categories">Kategórie</NavLink></li>
                    <li><NavLink to={`/manager/categories/${id}/items`}>Položky kategórie</NavLink></li>
                </ul>
            </div>

            <CodeListProvider>
                <CodeListItemProvider>
                    <ManagerCategoryItemsContent categoryId={id ?? ''}/>
                </CodeListItemProvider>
            </CodeListProvider>
        </>
    );
};

export default ManagerCategoryItemsPage;

const ManagerCategoryItemsContent = ({categoryId}: { categoryId: string }) => {
    const codeListItemState = useContext(CodeListItemContext);
    const dialogState = useContext(DialogContext);

    const [selected, setSelected] = useState<CodeListItem>();

    const [parentItem, setParentItem] = useState<CodeListItem>();

    const [showDialog, setShowDialog] = useState(false);

    const fetchData = async () => {
        codeListItemState?.setCriteria({
            codeListId: categoryId ?? '',
            root: !parentItem,
            parentId: parentItem?.id,
        });
    }

    useEffect(() => {
        void fetchData();
    }, [categoryId, parentItem]);

    return (
        <>
            <PageContent
                toolBar={
                    <SelectCategoryItem size={10} categoryId={categoryId} itemSelectedHandler={setParentItem}/>
                }

                pageNav={
                    <Pageable
                        isPrevious={codeListItemState?.previous ?? false}
                        previousHandler={() => codeListItemState?.setPage(codeListItemState?.page - 1)}
                        page={(codeListItemState?.page ?? 0) + 1}
                        totalPages={codeListItemState?.totalPages ?? 0}
                        isNext={codeListItemState?.next ?? false}
                        nextHandler={() => codeListItemState?.setPage(codeListItemState?.page + 1)}
                        disabled={codeListItemState?.busy}
                    />
                }
            >
                <Table
                    fields={['sortNum', 'item', 'leafNode', 'actions']}
                    tableHeaderColumn={(field) => {
                        switch (field) {
                            case 'sortNum':
                                return (<th key={field}>Poradové číslo</th>);
                            case 'item':
                                return (<th key={field}>Položka kategórie</th>);
                            case 'leafNode':
                                return (<th key={field}>Koncový uzol</th>);
                            case 'actions':
                                return (
                                    <th key={field}>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm btn-circle"
                                            disabled={codeListItemState?.busy}
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
                    rows={codeListItemState?.data}
                    tableRowKey={(row) => `${row.id}`}
                    tableRowColumn={(field, row) => {
                        switch (field) {
                            case 'sortNum':
                                return (
                                    <td key={field}>
                                        <div className="flex flex-row justify-start items-center gap-2 w-full">
                                            <div className="join">
                                                <button
                                                    className="btn btn-ghost join-item"
                                                    disabled={codeListItemState?.busy}
                                                    onClick={async () => {
                                                        await codeListItemState?.moveCodeListItemUp(row.id ?? '');
                                                        await codeListItemState?.getCodeListItems();
                                                    }}
                                                ><span className="icon-[lucide--arrow-up] text-base"></span>
                                                </button>
                                                <button
                                                    className="btn btn-ghost join-item"
                                                    disabled={codeListItemState?.busy}
                                                    onClick={async () => {
                                                        await codeListItemState?.moveCodeListItemDown(row.id ?? '');
                                                        await codeListItemState?.getCodeListItems();
                                                    }}
                                                ><span className="icon-[lucide--arrow-down] text-base"></span>
                                                </button>
                                            </div>
                                            <span>{formatNumber((row.sortNum ?? 0) + 1)}</span>
                                        </div>
                                    </td>);
                            case 'item':
                                return (
                                    <td key={field}>
                                        <div className="flex flex-row w-full items-center gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-xs"
                                                disabled={codeListItemState?.busy}
                                                onClick={() => {
                                                    setSelected(row);
                                                    setShowDialog(true);
                                                }}
                                            ><span className="icon-[lucide--edit] text-base"></span></button>
                                            <span>{row.code}:{row.value}</span>
                                        </div>
                                    </td>
                                );
                            case 'leafNode':
                                return (<td key={field}>{formatBoolean(row.leafNode)}</td>);
                            case 'actions':
                                return (
                                    <td key={field}>
                                        <button
                                            className="btn btn-accent btn-xs"
                                            type="button"
                                            disabled={codeListItemState?.busy}
                                            onClick={() => {
                                                dialogState?.showDialog({
                                                    type: DialogType.YES_NO,
                                                    title: 'Zmazať položku kategórie',
                                                    message: `Naozaj si želáte zmazať položku kategórie? [${row.code}:${row.value}]`,
                                                    callback: (answer: DialogAnswer) => {
                                                        if (answer === DialogAnswer.YES) {
                                                            (async () => {
                                                                await codeListItemState?.deleteCodeListItem(row.id ?? '');
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

            {showDialog && <CategoryItemDialog
                dialogId={MANAGER_CATEGORY_ITEM_DIALOG_ID}
                showDialog={showDialog}
                categoryId={categoryId ?? ''}
                parentId={parentItem?.id}
                codeListItem={selected}
                okHandler={async (data) => {
                    if (selected) {
                        await codeListItemState?.setCodeListItem(selected.id ?? '', data);
                    } else {
                        await codeListItemState?.addCodeListItem(data);
                    }
                    setShowDialog(false);
                }}
                cancelHandler={() => setShowDialog(false)}
            />}
        </>
    )
}