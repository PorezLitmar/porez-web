import type {ChangeEvent} from 'react';

const FormInput = (
    {
        type = 'text',
        name,
        disabled = false,
        label,
        placeholder,
        value,
        error,
        onChange
    }: {
        type?: 'text' | 'password' | 'email' | 'date' | 'datetime-local',
        name: string,
        disabled?: boolean,
        label?: string,
        placeholder?: string,
        value?: string,
        error?: string,
        onChange: (e: ChangeEvent<HTMLInputElement>) => void
    }) => {
    return (
        <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">{label}</legend>
            <input
                className="input w-full"
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}/>
            {error && <p className="label text-error text-xs">{error}</p>}
        </fieldset>
    )
}

export default FormInput;
