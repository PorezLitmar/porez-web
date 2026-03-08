import {type ChangeEvent, type SubmitEvent, useCallback, useContext, useEffect, useState} from 'react';
import {ErrorCode, type ResetPassword} from '../../api/model/porez';
import MaintenanceDefender from '../../component/layout/maintenance-defender';
import {AuthContext, ErrorContext} from '../../state';
import {generateCaptcha} from '../../api/client/captcha';
import {type FieldErrors, validateEmail, validateRequired} from '../../component';
import FormInput from '../../component/form/form-input.tsx';
import FormCaptcha from '../../component/form/form-captcha.tsx';

const AuthResetPasswordPage = () => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [values, setValues] = useState<ResetPassword>({
        email: "",
        captchaText: "",
        captchaToken: ""
    });

    const [captchaBusy, setCaptchaBusy] = useState(false);
    const [captchaImage, setCaptchaImage] = useState<string>();

    const reloadCaptcha = useCallback(async () => {
        setCaptchaBusy(true);
        try {
            const response = await generateCaptcha();
            const data = response?.data;
            if (data) {
                setValues(prev => ({
                    ...prev,
                    captchaToken: data.captchaToken ?? '',
                }));
                setCaptchaImage(data.captchaImage ?? '');
                setErrors(prev => ({
                    ...prev,
                    captchaText: undefined,
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    captchaText: 'Nepodarilo sa načítať kontrolný text',
                }));
            }
        } finally {
            setCaptchaBusy(false);
        }
    }, []);

    useEffect(() => {
        void reloadCaptcha();
    }, [reloadCaptcha]);

    const [errors, setErrors] = useState<FieldErrors<ResetPassword>>({});
    const [formError, setFormError] = useState<string>();
    const [message, setMessage] = useState<string>();

    const validate = (v: ResetPassword): FieldErrors<ResetPassword> => {
        return {
            ...validateEmail<ResetPassword, 'email'>('email', v.email),
            ...validateRequired<ResetPassword, 'captchaText'>('captchaText', v.captchaText, 'Vyžaduje sa kontrolný text')
        };
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormError(undefined);
        setValues(prev => ({
            ...prev,
            [name as keyof ResetPassword]: value,
        }));
    }

    const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFormError(undefined);
        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length !== 0) return;

        if (!authState) {
            setFormError('Obnovenie hesla nie je dostupné');
            return;
        }

        const response = await authState.resetPassword(values);
        if (response?.error) {
            switch (response?.error.code) {
                case ErrorCode.NOT_FOUND:
                    setFormError('Používateľ nebol nájdený');
                    return;
                case ErrorCode.FORBIDDEN:
                    if (response.error.message === 'unknown::account not confirmed') {
                        setFormError('Účet nie je aktivovaný');
                        return;
                    }
                    if (response.error.message === 'unknown::account not enabled') {
                        setFormError('Používateľ je zablokovaný');
                        return;
                    }
                    errorState?.addError(response?.error);
                    return;
                case ErrorCode.INVALID_CAPTCHA:
                    setFormError('Nesprávny kontrolný text');
                    return;
                default:
                    errorState?.addError(response?.error);
                    return;
            }
        }
        setMessage('Váš používateľský účet bol vytvorený. Počkajte, prosím, na potvrdzovací e-mail.');
    }

    return (
        <MaintenanceDefender>
            {message ?
                <div className="alert alert-info alert-soft">
                    <span>{message}</span>
                </div>
                :
                <>
                    <div className="flex flex-col justify-center w-full">
                        <div className="font-bold text-center text-xl">Obnovenie hesla</div>
                    </div>

                    <form
                        className="flex flex-col justify-center items-center w-full max-w-md"
                        onSubmit={onSubmit}
                        noValidate
                    >
                        <FormInput
                            type="email"
                            name="email"
                            label="Email"
                            placeholder="Zadajte email"
                            value={values.email}
                            error={errors.email}
                            onChange={onChange}
                        />

                        <FormCaptcha
                            busy={captchaBusy}
                            captchaToken={values.captchaToken}
                            captchaText={values.captchaText}
                            captchaImage={captchaImage}
                            error={errors.captchaText}
                            onChange={onChange}
                            onCaptchaReload={reloadCaptcha}
                        />

                        <button
                            type="submit"
                            className="btn btn-primary mt-5"
                            disabled={authState?.busy}
                        >Odoslať
                        </button>

                        {formError &&
                            <div className="alert alert-error w-full">
                                <span>{formError}</span>
                            </div>
                        }
                    </form>
                </>
            }
        </MaintenanceDefender>
    )
}

export default AuthResetPasswordPage;
