const FormFileInput = (
    {
        legend,
        label,
        error,
        onFileSelected
    }: {
        legend?: string,
        label?: string,
        error?: string,
        onFileSelected: (file: File) => void
    }) => {

    return (
        <div className="w-full flex flex-col">
            <fieldset className="fieldset">
                {legend && <legend className="fieldset-legend">{legend}</legend>}
                <input
                    type="file"
                    className="file-input w-full"
                    onChange={event => {
                        if (event.target.files && event.target.files.length > 0) {
                            onFileSelected(event.target.files[0]);
                        }
                    }}
                />
                {label && <label className="label">{label}</label>}
            </fieldset>
            {error &&
                <p className="text-error text-xs mt-1">{error}</p>
            }
        </div>
    )
}

export default FormFileInput;
