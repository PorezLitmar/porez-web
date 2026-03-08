import type {Category, CodeListItem} from '../../api/model/porez';
import {useContext, useState} from 'react';
import {DialogContext} from '../../state';
import {createPortal} from 'react-dom';
import BaseDialog from '../dialog/base-dialog';
import SelectCategory from './select-category';
import SelectCategoryItem from './select-category-item';

const SelectCategoryItemDialog = (
    {
        dialogId,
        categories,
        showDialog,
        setShowDialog,
        onSelectCodeListItem
    }: {
        dialogId: string,
        categories: Category[],
        showDialog: boolean,
        setShowDialog: (showDialog: boolean) => void,
        onSelectCodeListItem: (codeListItem: CodeListItem) => void
    }
) => {
    const dialogState = useContext(DialogContext);

    const [selectedCodeList, setSelectedCodeList] = useState<Category>();
    const [selectedCodeListItem, setSelectedCodeListItem] = useState<CodeListItem>();

    return (!dialogState?.modalRoot ? null : createPortal(
            <BaseDialog
                id={dialogId}
                showDialog={showDialog}
                closeHandler={() => setShowDialog(false)}>
                <div className="container">
                    <div className="flex flex-col justify-center w-full">
                        <div className="font-bold text-center text-xl">Vybrať položku kategórie</div>
                    </div>

                    <SelectCategory
                        placeholder="Zvoľte kategóriu"
                        setValue={(codeList) => {
                            setSelectedCodeList(codeList);
                            setSelectedCodeListItem(undefined);
                        }}
                        codeLists={categories}
                    />
                    {selectedCodeList &&
                        <SelectCategoryItem
                            categoryId={selectedCodeList.id ?? ''}
                            itemSelectedHandler={setSelectedCodeListItem}
                        />
                    }

                    <div className="join mt-5">
                        <button
                            type="button"
                            className="btn btn-primary join-item"
                            disabled={selectedCodeList === undefined}
                            onClick={() => {
                                if (selectedCodeListItem) {
                                    onSelectCodeListItem(selectedCodeListItem);
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

export default SelectCategoryItemDialog;
