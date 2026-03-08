import type {ChangeEvent} from 'react';

const FormCaptcha = (
    {
        busy,
        captchaImage,
        captchaToken,
        captchaText,
        error,
        onChange,
        onCaptchaReload
    }: {
        busy: boolean,
        captchaImage?: string,
        captchaToken?: string,
        captchaText?: string,
        error?: string,
        onChange: (e: ChangeEvent<HTMLInputElement>) => void
        onCaptchaReload: () => Promise<void>
    }) => {

    return (
        <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Kontrolný text</legend>
            <input type="hidden" name="captchaToken" value={captchaToken}/>

            <div className="grid grid-cols-[1fr_auto] items-center pb-1">
                <div className="w-full">
                    <img
                        className="w-full h-10 object-center rounded-lg"
                        src={captchaImage}
                        alt="captcha"
                    />
                </div>

                <button
                    type="button"
                    className="btn btn-secondary btn-square"
                    title="Obnoviť kontrolný obrázok"
                    onClick={onCaptchaReload}
                    disabled={busy}
                >
                    <span className="icon-[lucide--refresh-cw] text-xl"></span>
                </button>
            </div>

            <input
                className="input w-full"
                type="text"
                name="captchaText"
                placeholder="Zadajte kontrolný text"
                value={captchaText}
                onChange={onChange}
            />
            {error && <p className="label text-error text-xs">{error}</p>}
        </fieldset>
    )
}

export default FormCaptcha;
