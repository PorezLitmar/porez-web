import type {Category} from '../../api/model/porez';
import {useContext, useEffect, useState} from 'react';
import {CodeListContext, DialogContext} from '../../state';
import {createPortal} from 'react-dom';
import BaseDialog from '../dialog/base-dialog';
import PageContent from '../layout/page-content';
import Pageable from '../pageable';
import Table from '../table';
import FormCheckBox from '../form/form-check-box';

const SelectCategoryDialog = (
    {
        dialogId,
        showDialog,
        setShowDialog,
        okHandler
    }: {
        dialogId: string,
        showDialog: boolean,
        setShowDialog: (showDialog: boolean) => void,
        okHandler: (codeList: Category) => void
    }
) => {
    const codeListState = useContext(CodeListContext);
    const dialogState = useContext(DialogContext);

    const [selected, setSelected] = useState<Category>();

    const [searchField, setSearchField] = useState('');

    const fetchData = () => {
        codeListState?.setCriteria({searchField});
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selected) {
            if (codeListState?.data?.find(item => item.id === selected.id) === undefined) {
                (async () => setSelected(undefined))();
            }
        }
    }, [codeListState?.data]);

    return (!dialogState?.modalRoot ? null : createPortal(
            <BaseDialog
                id={dialogId}
                maxWidth={true}
                showDialog={showDialog}
                closeHandler={() => setShowDialog(false)}>
                <div className="container">
                    <div className="flex flex-col justify-center w-full">
                        <div className="font-bold text-center text-xl">Vybrať kategóriu</div>
                    </div>

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
                            fields={['select', 'code', 'name']}
                            tableHeaderColumn={(field) => {
                                switch (field) {
                                    case 'select':
                                        return (<th key={field}></th>);
                                    case 'code':
                                        return (<th key={field}>Kód</th>);
                                    case 'name':
                                        return (<th key={field}>Názov</th>);
                                }
                            }}
                            rows={codeListState?.data}
                            tableRowKey={(row) => `${row.id}`}
                            tableRowColumn={(field, row) => {
                                switch (field) {
                                    case 'select':
                                        return (
                                            <td key={field}>
                                                <FormCheckBox
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
                                        return (<td key={field}>{row.name}</td>);
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
                                    okHandler(selected);
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
            </BaseDialog>
            , dialogState.modalRoot)
    )
}

export default SelectCategoryDialog;