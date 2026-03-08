import type {ChangeEvent, SubmitEvent} from 'react';
import {useContext, useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {ErrorCode, type SignIn} from '../../api/model/porez';
import {AppContext, AuthContext, ErrorContext} from '../../state';
import {type FieldErrors, validateEmail, validateRequired} from '../../component';
import FormInput from '../../component/form/form-input';

const AuthSignInPage = () => {
    const navigate = useNavigate();

    const appState = useContext(AppContext);
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [values, setValues] = useState<SignIn>({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<FieldErrors<SignIn>>({});
    const [formError, setFormError] = useState<string>();

    const validate = (v: SignIn): FieldErrors<SignIn> => {
        return {
            ...validateEmail<SignIn, 'email'>('email', v.email),
            ...validateRequired<SignIn, 'password'>('password', v.password, 'Vyžaduje sa heslo')
        };
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormError(undefined);
        setValues(prev => ({
            ...prev,
            [name as keyof SignIn]: value,
        }));
    }

    const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFormError(undefined);
        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length !== 0) return;

        if (!authState) {
            setFormError('Prihlásenie nie je dostupné');
            return;
        }

        const response = await authState.signIn(values);
        if (response?.error) {
            switch (response.error.code) {
                case ErrorCode.NOT_FOUND:
                    setFormError('Používateľ nebol nájdený');
                    return;
                case ErrorCode.UNKNOWN:
                    if (response.error.message === 'invalid_credentials::invalid credentials') {
                        setFormError('Nesprávne prihlasovacie údaje');
                        return;
                    }
                    errorState?.addError(response?.error);
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
                default:
                    errorState?.addError(response?.error);
                    return;
            }
        }
        navigate('/');
    }

    return (
        <>
            <div className="flex flex-col justify-center w-full">
                <div className="font-bold text-center text-xl">Prihláste sa do svojho účtu.</div>
                {!appState?.maintenance &&
                    <>
                        <div className="text-center text-xs">
                            <span>Ak ešte nemáte účet, môžete sa </span>
                            <NavLink className="link" to="/auth/sign-up">zaregistrovať.</NavLink>
                        </div>
                        <div className="text-center text-xs">
                            <span>V prípade, že ste zabudli heslo, môžete si ho </span>
                            <NavLink className="link" to="/auth/reset-password">obnoviť.</NavLink>
                        </div>
                    </>
                }
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

                <button
                    type="submit"
                    className="btn btn-primary mt-5"
                    disabled={authState?.busy}
                >Prihlásiť
                </button>

                {formError &&
                    <div className="alert alert-error w-full">
                        <span>{formError}</span>
                    </div>
                }
            </form>
        </>
    )
}

export default AuthSignInPage;
