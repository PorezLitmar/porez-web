import type {Category} from '../../api/model/porez';
import type {SyntheticEvent} from 'react';

const SelectCategory = (
    {
        placeholder,
        value,
        setValue,
        codeLists,
    }: {
        placeholder?: string
        value?: Category,
        setValue: (codeList: Category) => void,
        codeLists: Category[]
    }) => {

    const codeListChangeHandler = (event: SyntheticEvent<HTMLSelectElement>) => {
        const id = event.currentTarget.value;
        const index = codeLists.findIndex(item => item.id === id);
        if (index !== -1) {
            setValue(codeLists[index]);
        }
    }

    return (
        <select
            className="w-full"
            defaultValue={value?.id ?? ''}
            onChange={event => codeListChangeHandler(event)}
        >
            {placeholder && <option disabled value="">{placeholder}</option>}
            {codeLists?.map(codeList =>
                <option
                    key={codeList.id}
                    value={codeList.id}>{codeList.code}:{codeList.name}</option>
            )}
        </select>
    )
}

export default SelectCategory;
