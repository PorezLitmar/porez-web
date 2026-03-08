import {type ChangeEvent, type SubmitEvent, useContext, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {ErrorCode} from '../../api/model/porez';
import {AuthContext, ErrorContext} from '../../state';
import FormInput from '../../component/form/form-input.tsx';
import {isBlank} from '../../component';

type FormValues = {
    password: string;
    passwordConfirmation: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const AuthConfirmPage = () => {

    const navigate = useNavigate();

    const {token} = useParams();

    if (!token) {
        navigate('/');
    }

    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);
    const [errors, setErrors] = useState<FormErrors>({});

    const [values, setValues] = useState<FormValues>({
        password: "",
        passwordConfirmation: ""
    });

    const [done, setDone] = useState(false);
    const [formMessage, setFormMessage] = useState<string>();
    const [formError, setFormError] = useState<string>();

    const validate = (v: FormValues): FormErrors => {
        const e: FormErrors = {};

        if (isBlank(v.password)) {
            e.password = 'Vyžaduje sa heslo';
        }

        if (isBlank(v.passwordConfirmation)) {
            e.passwordConfirmation = "Vyžaduje sa potvrdenie hesla";
        } else if (v.password !== v.passwordConfirmation) {
            e.passwordConfirmation = "Potvrdenie hesla sa nezhoduje s heslom";
        }

        return e;
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setValues(prev => ({
            ...prev,
            [name as keyof FormValues]: value,
        }));
    }

    const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length !== 0) return;

        if (!authState) {
            return;
        }

        try {
            const response = await authState?.confirmPassword({
                ...values,
                token: token ?? '',
            });
            if (response?.error) {
                switch (response?.error.code) {
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
                    case ErrorCode.UNKNOWN:
                        if (response.error.message === 'invalid_token::invalid token') {
                            setFormError('Nesprávna požiadavka.');
                            return;
                        }
                        errorState?.addError(response?.error);
                        return;
                    default:
                        errorState?.addError(response?.error);
                        break;
                }
            } else {
                setFormMessage('Vaša požiadavka bola spracovaná.');
            }
        } finally {
            setDone(true);
        }
    }

    return (
        <>
            <div className="flex flex-col justify-center w-full">
                <div className="font-bold text-center text-xl">Potvrdenie obnovenia hesla</div>
            </div>

            {!done &&
                <>
                    <form
                        className="flex flex-col justify-center items-center w-full max-w-md"
                        onSubmit={onSubmit}
                        noValidate
                    >
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

                        <button
                            type="submit"
                            className="btn btn-primary mt-5"
                            disabled={authState?.busy}
                        >Potvrdiť
                        </button>
                    </form>
                </>
            }

            {done &&
                <>
                    {authState?.busy ?
                        <span className="loading loading-xl loading-spinner text-primary"></span>
                        :
                        <>
                            {formMessage &&
                                <div className="alert alert-info alert-soft">
                                    <span>{formMessage}</span>
                                </div>
                            }

                            {formError &&
                                <div className="alert alert-error w-full">
                                    <span>{formError}</span>
                                </div>
                            }
                        </>
                    }
                </>
            }
        </>
    )
}

export default AuthConfirmPage;
