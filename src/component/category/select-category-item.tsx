import type {CodeListItem} from '../../api/model/porez';
import {useContext, useEffect, useState} from 'react';
import {CodeListContext, CodeListItemContext} from '../../state';

const SelectCategoryItem = (
    {
        categoryId,
        categoryItemId,
        size = 10000,
        itemSelectedHandler
    }: {
        categoryId: string,
        categoryItemId?: string,
        size?: number,
        itemSelectedHandler: (item?: CodeListItem) => void
    }) => {
    const codeListState = useContext(CodeListContext);
    const codeListItemState = useContext(CodeListItemContext);

    const [home, setHome] = useState<{ name: string, item?: CodeListItem }>();
    const [menu, setMenu] = useState<CodeListItem[]>([]);

    const fetchData = (parentId?: string) => {
        codeListItemState?.setCriteria({
            codeListId: categoryId,
            root: !parentId,
            parentId
        }, size);
    }

    useEffect(() => {
        const fetchHome = async () => {
            if (categoryItemId) {
                const response = await codeListItemState?.getCodeListItem(categoryItemId);
                if (response?.data) {
                    setHome({name: response.data.value ?? '', item: response.data});
                }
            } else {
                const response = await codeListState?.getCodeList(categoryId);
                if (response?.data) {
                    setHome({name: response.data.name ?? ''});
                }
            }
        }
        fetchHome().then();
    }, [categoryId, categoryItemId]);

    useEffect(() => {
        if (home) {
            fetchData(home.item?.id);
        }
    }, [home]);

    const menuHandler = (id?: string) => {
        if (id) {
            const newMenu = [...menu];
            const index = newMenu.findIndex(item => item.id === id);
            newMenu.splice(index + 1);
            setMenu(newMenu);
            itemSelectedHandler(newMenu[index])
        } else {
            setMenu([]);
            itemSelectedHandler(undefined);
        }
        fetchData(id);
    }

    const selectItemHandler = (item: CodeListItem) => {
        setMenu([...menu, item]);
        fetchData(item.id);
        itemSelectedHandler(item);
    }

    return (codeListItemState?.busy ?
            <span className="loading loading-spinner text-primary"></span>
            :
            <>
                <div className="breadcrumbs">
                    <ul>
                        {home &&
                            <li>
                                <a onClick={() => menuHandler(undefined)}>
                                    {home.name}
                                </a>
                            </li>
                        }
                        {menu.map(item =>
                            <li key={item.id}>
                                <a onClick={() => menuHandler(item.id)}>
                                    {item.value}
                                </a>
                            </li>
                        )}
                        {codeListItemState?.data && codeListItemState?.data.length > 0 &&
                            <li>
                                <select
                                    defaultValue="0"
                                    onChange={event => {
                                        const id = event.currentTarget.value;
                                        const item = codeListItemState?.data?.find(item => item.id === id);
                                        if (item) {
                                            selectItemHandler(item);
                                        }
                                    }}
                                >
                                    <option disabled value="0">Zvoľte položku</option>
                                    {codeListItemState?.data?.map(item =>
                                        <option key={item.id} value={item.id}>{item.value}</option>
                                    )}
                                </select>
                            </li>
                        }
                    </ul>
                </div>
            </>
    )
}

export default SelectCategoryItem;
