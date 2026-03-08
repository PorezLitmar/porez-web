import {type ChangeEvent, type SubmitEvent, useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ErrorCode} from '../../api/model/porez';
import AuthDefender from '../../component/layout/auth-defender';
import MaintenanceDefender from '../../component/layout/maintenance-defender';
import {AuthContext, ErrorContext} from '../../state';
import {type FieldErrors, isBlank, validateRequired} from '../../component';
import FormInput from '../../component/form/form-input';

type FormValues = {
    oldPassword: string;
    newPassword: string;
    passwordConfirmation: string;
};

const AuthChangePasswordPage = () => {
    const navigate = useNavigate();

    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [values, setValues] = useState<FormValues>(() => ({
        oldPassword: '',
        newPassword: '',
        passwordConfirmation: ''
    }));

    const [errors, setErrors] = useState<FieldErrors<FormValues>>({});
    const [formError, setFormError] = useState<string>();

    const validate = (v: FormValues): FieldErrors<FormValues> => {
        const e: FieldErrors<FormValues> = {
            ...validateRequired<FormValues, 'oldPassword'>('oldPassword', v.oldPassword, 'Vyžaduje sa pôvodné heslo'),
            ...validateRequired<FormValues, 'newPassword'>('newPassword', v.newPassword, 'Vyžaduje sa nové heslo'),
            ...validateRequired<FormValues, 'passwordConfirmation'>('passwordConfirmation', v.passwordConfirmation, 'Vyžaduje sa potvrdenie hesla'),
        };

        if (isBlank(e.passwordConfirmation) && v.newPassword !== v.passwordConfirmation) {
            e.passwordConfirmation = "Potvrdenie hesla sa nezhoduje s novým heslom";
        }

        return e;
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormError(undefined);
        setValues(prev => ({
            ...prev,
            [name as keyof FormValues]: value,
        }));
    }

    const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFormError(undefined);
        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length !== 0) return;

        if (!authState) {
            setFormError('Zmena hesla nie je dostupná');
            return;
        }

        const response = await authState.changePassword(values);
        if (response?.error) {
            switch (response.error.code) {
                case ErrorCode.UNKNOWN:
                    if (response.error.message === 'invalid_credentials::invalid credentials') {
                        setFormError('Nesprávne pôvodné heslo');
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
                    <div className="font-bold text-center text-xl">Zmeniť heslo</div>
                </div>

                <form
                    className="flex flex-col justify-center items-center w-full max-w-md"
                    onSubmit={onSubmit}
                    noValidate
                >
                    <FormInput
                        type="password"
                        name="oldPassword"
                        label="Pôvodné heslo"
                        placeholder="Zadajte pôvodné heslo"
                        value={values.oldPassword}
                        error={errors.oldPassword}
                        onChange={onChange}
                    />

                    <FormInput
                        type="password"
                        name="newPassword"
                        label="Nové heslo"
                        placeholder="Zadajte nové heslo"
                        value={values.newPassword}
                        error={errors.newPassword}
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

export default AuthChangePasswordPage;
