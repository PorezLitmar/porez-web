import {type ChangeEvent, type SubmitEvent, useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {type ChangeEmail, ErrorCode} from '../../api/model/porez';
import AuthDefender from '../../component/layout/auth-defender';
import MaintenanceDefender from '../../component/layout/maintenance-defender';
import {AuthContext, ErrorContext} from '../../state';
import {validateEmail, validateRequired} from '../../component';
import FormInput from '../../component/form/form-input';
import type {FieldErrors} from '../../component';

const AuthChangeEmailPage = () => {
    const navigate = useNavigate();

    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [values, setValues] = useState<ChangeEmail>(() => ({
        email: authState?.user?.email ?? '',
        password: ''
    }));

    const [errors, setErrors] = useState<FieldErrors<ChangeEmail>>({});
    const [formError, setFormError] = useState<string>();

    const validate = (v: ChangeEmail): FieldErrors<ChangeEmail> => {
        return {
            ...validateEmail<ChangeEmail, 'email'>('email', v.email),
            ...validateRequired<ChangeEmail, 'password'>('password', v.password, 'Vyžaduje sa heslo')
        };
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormError(undefined);
        setValues(prev => ({
            ...prev,
            [name as keyof ChangeEmail]: value,
        }));
    }

    const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFormError(undefined);
        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length !== 0) return;

        if (!authState) {
            setFormError('Zmena emailu nie je dostupná');
            return;
        }

        const response = await authState.changeEmail(values);
        if (response?.error) {
            switch (response.error.code) {
                case ErrorCode.UNKNOWN:
                    if (response.error.message === 'invalid_credentials::invalid credentials') {
                        setFormError('Nesprávne heslo');
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
        <MaintenanceDefender>
            <AuthDefender>
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">Zmeniť email</div>
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
                    >Potvrdiť
                    </button>

                    {formError &&
                        <div className="alert alert-error w-full">
                            <span>{formError}</span>
                        </div>
                    }
                </form>
            </AuthDefender>
        </MaintenanceDefender>
    );
};

export default AuthChangeEmailPage;
