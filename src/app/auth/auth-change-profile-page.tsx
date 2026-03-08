import {type ChangeEvent, type SubmitEvent, useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {type ChangeUserProfile, ErrorCode} from '../../api/model/porez';
import AuthDefender from '../../component/layout/auth-defender';
import MaintenanceDefender from '../../component/layout/maintenance-defender';
import {AuthContext, ErrorContext} from '../../state';
import {type FieldErrors, validateRequired} from '../../component';
import FormInput from '../../component/form/form-input';

const AuthChangeProfilePage = () => {
    const navigate = useNavigate();

    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [values, setValues] = useState<ChangeUserProfile>(() => ({
        title: authState?.user?.title ?? '',
        firstName: authState?.user?.firstName ?? '',
        lastName: authState?.user?.lastName ?? ''
    }));

    const [errors, setErrors] = useState<FieldErrors<ChangeUserProfile>>({});
    const [formError, setFormError] = useState<string>();

    const validate = (v: ChangeUserProfile): FieldErrors<ChangeUserProfile> => {
        return {
            ...validateRequired<ChangeUserProfile, 'firstName'>('firstName', v.firstName, 'Vyžaduje sa meno'),
            ...validateRequired<ChangeUserProfile, 'lastName'>('lastName', v.firstName, 'Vyžaduje sa priezvisko'),
        };
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormError(undefined);
        setValues(prev => ({
            ...prev,
            [name as keyof ChangeUserProfile]: value,
        }));
    }

    const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFormError(undefined);
        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length !== 0) return;

        if (!authState) {
            setFormError('Detaily účtu nie sú dostupné');
            return;
        }

        const response = await authState.changeUserProfile(values);
        if (response?.error) {
            switch (response.error.code) {
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
                    <div className="font-bold text-center text-xl">Detaily účtu</div>
                </div>

                <form
                    className="flex flex-col justify-center items-center w-full max-w-md"
                    onSubmit={onSubmit}
                    noValidate
                >
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

export default AuthChangeProfilePage;
