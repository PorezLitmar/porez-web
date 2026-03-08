const FormTextArea = (
    {
        name,
        disabled = false,
        label,
        placeholder,
        value,
        error,
        onChange,
        rows = 3
    }: {
        name: string,
        disabled?: boolean,
        label?: string,
        placeholder?: string,
        value?: string,
        error?: string,
        onChange: (value: string) => void,
        rows?: number
    }) => {
    return (
        <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">{label}</legend>
            <textarea
                name={name}
                className="textarea w-full"
                rows={rows}
                placeholder={placeholder}
                value={value}
                onChange={event => onChange(event.target.value)}
                disabled={disabled}
            />
            {error && <p className="label text-error text-xs">{error}</p>}
        </fieldset>
    )
}

export default FormTextArea;
