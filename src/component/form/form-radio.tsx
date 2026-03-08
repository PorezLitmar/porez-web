import type {ChangeEvent, ReactNode} from 'react';

const FormRadio = (
    {
        name,
        disabled = false,
        value,
        error,
        onChange,
        children
    }: {
        name: string,
        disabled?: boolean
        value?: boolean,
        error?: string,
        onChange: (e: ChangeEvent<HTMLInputElement>) => void
        children?: ReactNode
    }) => {
    return (
        <fieldset className="fieldset w-full">
            <div className="flex flex-row items-center justify-start gap-2">
                <input
                    type="radio"
                    name={name}
                    className="radio"
                    checked={value}
                    onChange={onChange}
                    disabled={disabled}
                />
                {children}
            </div>
            {error && <p className="label text-error text-xs">{error}</p>}
        </fieldset>
    )
}

export default FormRadio;
