import type {EdgeSearchCriteria} from '../../api/client/edge';
import {type ReactNode, useContext, useEffect, useState} from 'react';
import {CategoryContext} from '../../state';
import type {CodeListItem} from '../../api/model/porez';
import {parseNumber} from '..';
import SelectCategoryItem from '../category/select-category-item';
import FormInput from '../form/form-input';

const EdgeSearchCriteriaForm = ({searchHandler, children}: {
    searchHandler: (criteria: EdgeSearchCriteria) => void
    children?: ReactNode
}) => {
    const categoryState = useContext(CategoryContext);

    const [searchField, setSearchField] = useState('');
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [widthFrom, setWidthFrom] = useState('');
    const [widthTo, setWidthTo] = useState('');
    const [thicknessFrom, setThicknessFrom] = useState('');
    const [thicknessTo, setThicknessTo] = useState('');
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');
    const [codeListItems, setCodeListItems] = useState<{ codeListId: string, item: CodeListItem }[]>([]);

    const [extended, setExtended] = useState(false);

    const createCriteria = () => {
        return {
            searchField: searchField.length > 0 ? searchField : undefined,
            code: code.length > 0 ? code : undefined,
            name: name.length > 0 ? name : undefined,
            widthFrom: parseNumber(widthFrom),
            widthTo: parseNumber(widthTo),
            thicknessFrom: parseNumber(thicknessFrom),
            thicknessTo: parseNumber(thicknessTo),
            priceFrom: parseNumber(priceFrom),
            priceTo: parseNumber(priceTo),
            codeListItems: codeListItems.map(item => item.item.code ?? '')
        };
    }

    useEffect(() => {
        searchHandler(createCriteria());
    }, [codeListItems]);

    return (
        <div className="flex flex-col w-full gap-2">
            <div className="join join-horizontal w-full">
                <input
                    type="text"
                    className="join-item input input-bordered w-full"
                    placeholder="Kód alebo názov"
                    value={searchField}
                    onChange={event => setSearchField(event.target.value)}
                    onKeyUp={(event) => {
                        if (event.key === 'Enter') {
                            searchHandler(createCriteria());
                        }
                    }}
                />
                <button
                    className="join-item btn"
                    onClick={() => searchHandler(createCriteria())}
                ><span className="icon-[lucide--search] text-base"></span></button>
                <button
                    className="join-item btn"
                    onClick={() => setExtended(!extended)}
                >
                    {extended ?
                        <span className="icon-[lucide--arrow-up] text-base"></span>
                        :
                        <span className="icon-[lucide--arrow-down] text-base"></span>
                    }
                </button>
                {children}
            </div>


            {extended &&
                <>
                    <div className="grid grid-cols-8 gap-2 w-full">
                        <FormInput
                            name="code"
                            placeholder="Kód"
                            value={code}
                            onChange={event => setCode(event.target.value)}
                        />
                        <FormInput
                            name="name"
                            placeholder="Názov"
                            value={name}
                            onChange={event => setName(event.target.value)}
                        />
                        <FormInput
                            name="priceFrom"
                            placeholder="Cena od"
                            value={priceFrom}
                            onChange={event => setPriceFrom(event.target.value)}
                        />
                        <FormInput
                            name="priceTo"
                            placeholder="Cena do"
                            value={priceTo}
                            onChange={event => setPriceTo(event.target.value)}
                        />
                        <FormInput
                            name="widthFrom"
                            placeholder="Šírka od"
                            value={widthFrom}
                            onChange={event => setWidthFrom(event.target.value)}
                        />
                        <FormInput
                            name="widthTo"
                            placeholder="Šírka do"
                            value={widthTo}
                            onChange={event => setWidthTo(event.target.value)}
                        />
                        <FormInput
                            name="thicknessFrom"
                            placeholder="Hrúbka od"
                            value={thicknessFrom}
                            onChange={event => setThicknessFrom(event.target.value)}
                        />
                        <FormInput
                            name="thicknessTo"
                            placeholder="Hrúbka do"
                            value={thicknessTo}
                            onChange={event => setThicknessTo(event.target.value)}
                        />
                    </div>

                    {categoryState?.edgeCategories &&
                        <div className="flex flex-col w-full">
                            {categoryState?.edgeCategories.map(category =>
                                <SelectCategoryItem
                                    key={category.id}
                                    categoryId={category.id ?? ''}
                                    itemSelectedHandler={(codeListItem) => {
                                        const newCodeListItems = [...codeListItems];
                                        const index = newCodeListItems.findIndex(item => item.codeListId === category.id);
                                        if (index !== -1) {
                                            newCodeListItems.splice(index, 1);
                                        }
                                        if (codeListItem) {
                                            newCodeListItems.push({
                                                codeListId: category.id ?? '',
                                                item: codeListItem
                                            });
                                        }
                                        setCodeListItems(newCodeListItems);
                                    }}
                                />
                            )}
                        </div>
                    }
                </>
            }
        </div>
    )
}

export default EdgeSearchCriteriaForm;
