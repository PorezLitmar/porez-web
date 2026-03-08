import {type ChangeEvent, type SubmitEvent, useCallback, useContext, useEffect, useState} from 'react';
import {NavLink} from 'react-router-dom';
import {ErrorCode} from '../../api/model/porez';
import MaintenanceDefender from '../../component/layout/maintenance-defender';
import {AuthContext, ErrorContext} from '../../state';
import {type FieldErrors, isBlank, validateEmail, validateRequired} from '../../component';
import FormInput from '../../component/form/form-input';
import FormCaptcha from '../../component/form/form-captcha';
import {generateCaptcha} from '../../api/client/captcha';
import FormCheckBox from '../../component/form/form-check-box.tsx';

type FormValues = {
    email: string;
    password: string;
    passwordConfirmation: string;
    title: string;
    firstName: string;
    lastName: string;
    captchaText: string;
    captchaToken: string;
    gdprConsent: boolean;
};

const AuthSignUpPage = () => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [values, setValues] = useState<FormValues>({
        email: "",
        password: "",
        passwordConfirmation: "",
        title: "",
        firstName: "",
        lastName: "",
        captchaText: "",
        captchaToken: "",
        gdprConsent: false,
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

    const [errors, setErrors] = useState<FieldErrors<FormValues>>({});
    const [formError, setFormError] = useState<string>();
    const [message, setMessage] = useState<string>();

    const validate = (v: FormValues): FieldErrors<FormValues> => {
        const e: FieldErrors<FormValues> = {
            ...validateEmail<FormValues, 'email'>('email', v.email),
            ...validateRequired<FormValues, 'password'>('password', v.password, 'Vyžaduje sa heslo'),
            ...validateRequired<FormValues, 'passwordConfirmation'>('passwordConfirmation', v.passwordConfirmation, 'Vyžaduje sa potvrdenie hesla'),
            ...validateRequired<FormValues, 'firstName'>('firstName', v.firstName, 'Vyžaduje sa meno'),
            ...validateRequired<FormValues, 'lastName'>('lastName', v.firstName, 'Vyžaduje sa priezvisko'),
            ...validateRequired<FormValues, 'captchaText'>('captchaText', v.captchaText, 'Vyžaduje sa kontrolný text'),
        };

        if (isBlank(e.passwordConfirmation) && v.password !== v.passwordConfirmation) {
            e.passwordConfirmation = "Potvrdenie hesla sa nezhoduje s heslom";
        }

        if (!v.gdprConsent) {
            e.gdprConsent = 'Vyžaduje sa GDPR súhlas';
        }

        return e;
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, type, value, checked} = e.target;
        const nextValue = type === 'checkbox' ? checked : value;

        setValues(prev => ({
            ...prev,
            [name as keyof FormValues]: nextValue as FormValues[keyof FormValues],
        }));
    }

    const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFormError(undefined);
        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length !== 0) return;

        if (!authState) {
            setFormError('Registrácia nie je dostupná');
            return;
        }

        const response = await authState.signUp(values);
        if (response?.error) {
            switch (response?.error.code) {
                case ErrorCode.INVALID_CAPTCHA:
                    setFormError('Nesprávny kontrolný text');
                    return;
                case ErrorCode.UNKNOWN:
                    if (response.error.message === "email_already_exists::'email' already exists") {
                        setFormError('Email sa už používa');
                        return;
                    }
                    errorState?.addError(response?.error);
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
                        <div className="font-bold text-center text-xl">Zaregistrujte si svoj účet.</div>
                        <div className="text-center text-xs">
                            <span>Ak už účet máte, môžete sa </span>
                            <NavLink className="link" to="/auth/sign-in">prihlásiť.</NavLink>
                        </div>
                        <div className="text-center text-xs">
                            <span>V prípade, že ste zabudli heslo, môžete si ho </span>
                            <NavLink className="link" to="/auth/reset-password">obnoviť.</NavLink>
                        </div>
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

                        <FormInput
                            type="password"
                            name="password"
                            label="Heslo"
                            placeholder="Zadajte heslo"
                            value={values.password}
                            error={errors.password}
                            onChange={onChange}
                        />

                        <FormInput
                            type="password"
                            name="passwordConfirmation"
                            label="Potvrdenie hesla"
                            placeholder="Zadajte potvrdenie hesla"
                            value={values.passwordConfirmation}
                            error={errors.passwordConfirmation}
                            onChange={onChange}
                        />

                        <FormInput
                            name="title"
                            label="Titul"
                            placeholder="Zadajte titul"
                            value={values.title}
                            error={errors.title}
                            onChange={onChange}
                        />

                        <FormInput
                            name="firstName"
                            label="Meno"
                            placeholder="Zadajte meno"
                            value={values.firstName}
                            error={errors.firstName}
                            onChange={onChange}
                        />

                        <FormInput
                            name="lastName"
                            label="Priezvisko"
                            placeholder="Zadajte priezvisko"
                            value={values.lastName}
                            error={errors.lastName}
                            onChange={onChange}
                        />

                        <FormCheckBox
                            name="gdprConsent"
                            value={values.gdprConsent}
                            error={errors.gdprConsent}
                            onChange={onChange}
                        >
                            <NavLink className="link" to="/ui/gdpr-info">GDPR súhlas</NavLink>
                        </FormCheckBox>

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
                        >Zaregistrovať
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

export default AuthSignUpPage;
