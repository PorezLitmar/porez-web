import type {ChangeEvent, ReactNode} from 'react';

const FormSelect = (
    {
        name,
        disabled = false,
        label,
        value,
        error,
        onChange,
        children
    }: {
        name: string,
        disabled?: boolean,
        label?: string,
        value?: string,
        error?: string,
        onChange: (e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => void
        children?: ReactNode
    }) => {
    return (
        <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">{label}</legend>
            <select
                className="select w-full"
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
            >
                {children}
            </select>
            {error && <p className="label text-error text-xs">{error}</p>}
        </fieldset>
    )
}

export default FormSelect;
