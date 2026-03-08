import {NavLink} from 'react-router-dom';
import {type ChangeEvent, type SubmitEvent, useContext, useEffect, useState} from 'react';
import {AuthContext, ErrorContext} from '../../state';
import * as configApi from '../../api/client/config';
import {type FieldErrors, validateRequired} from '../../component';
import FormInput from '../../component/form/form-input.tsx';
import type {OrderCommentMail, OrderSendMail, OrderStatusMail} from '../../api/model/porez';

const AdminMailFormatsPage = () => {

    const [contentIndex, setContentIndex] = useState(0);

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Správca</li>
                    <li><NavLink to="/admin/mail-formats">Emailové správy</NavLink></li>
                </ul>
            </div>

            <select
                defaultValue="0"
                className="select select-neutral"
                onChange={event => setContentIndex(Number(event.currentTarget.value))}
            >
                <option value="0">Komentár objednávky</option>
                <option value="1">Odoslanie objednávky</option>
                <option value="2">Zmena stavu objednávky</option>
            </select>

            {contentIndex === 0 && <OrderCommentMailEditor/>}
            {contentIndex === 1 && <OrderSendMailEditor/>}
            {contentIndex === 2 && <OrderStatusMailEditor/>}
        </>
    );
};

export default AdminMailFormatsPage;

const OrderCommentMailEditor = () => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [values, setValues] = useState<OrderCommentMail>({
        subject: '',
        title: '',
        message: '',
        link: ''
    });

    useEffect(() => {
        let isMounted = true;

        const loadValues = async () => {
            if (!authState || !isMounted) {
                return;
            }

            const response = await configApi.getOrderCommentMail();
            if (response.data) {
                setValues(response.data);
            }
            errorState?.addError(response.error);
        };

        void loadValues();

        return () => {
            isMounted = false;
        };
    }, []);

    const [errors, setErrors] = useState<FieldErrors<OrderCommentMail>>({});
    const [busy, setBusy] = useState(false);

    const validate = (v: OrderCommentMail): FieldErrors<OrderCommentMail> => {
        return {
            ...validateRequired<OrderCommentMail, 'subject'>('subject', v.subject, 'Vyžaduje sa subjekt'),
            ...validateRequired<OrderCommentMail, 'title'>('title', v.title, 'Vyžaduje sa titulka'),
            ...validateRequired<OrderCommentMail, 'message'>('message', v.message, 'Vyžaduje sa správa'),
            ...validateRequired<OrderCommentMail, 'link'>('link', v.link, 'Vyžaduje sa odkaz')
        }
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setValues(prev => ({
            ...prev,
            [name as keyof OrderCommentMail]: value,
        }));
    }

    const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        setBusy(true);
        try {
            e.preventDefault();

            const validationErrors = validate(values);
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length !== 0) return;

            const response = await configApi.setOrderCommentMail(values, authState?.accessToken);
            errorState?.addError(response?.error);
        } finally {
            setBusy(false);
        }
    }

    return (
        <form
            className="flex flex-col justify-center items-center w-full"
            onSubmit={onSubmit}
            noValidate
        >
            <FormInput
                name="subject"
                label="Subjekt"
                placeholder="Zadajte subjekt"
                value={values.subject}
                error={errors.subject}
                onChange={onChange}
            />

            <FormInput
                name="title"
                label="Titulka"
                placeholder="Zadajte titulku"
                value={values.title}
                error={errors.title}
                onChange={onChange}
            />

            <FormInput
                name="message"
                label="Správa"
                placeholder="Zadajte správu"
                value={values.message}
                error={errors.message}
                onChange={onChange}
            />

            <FormInput
                name="link"
                label="Odkaz"
                placeholder="Zadajte odkaz"
                value={values.link}
                error={errors.link}
                onChange={onChange}
            />

            <button
                type="submit"
                className="btn btn-primary mt-5"
                disabled={busy}
            >Potvrdiť
            </button>
        </form>
    )
}

const OrderSendMailEditor = () => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [values, setValues] = useState<OrderSendMail>({
        subject: '',
        title: '',
        message: '',
        link: '',
        attachment: ''
    });

    useEffect(() => {
        let isMounted = true;

        const loadValues = async () => {
            if (!authState || !isMounted) {
                return;
            }

            const response = await configApi.getOrderSendMail();
            if (response.data) {
                setValues(response.data);
            }
            errorState?.addError(response.error);
        };

        void loadValues();

        return () => {
            isMounted = false;
        };
    }, []);

    const [errors, setErrors] = useState<FieldErrors<OrderSendMail>>({});
    const [busy, setBusy] = useState(false);

    const validate = (v: OrderSendMail): FieldErrors<OrderSendMail> => {
        return {
            ...validateRequired<OrderSendMail, 'subject'>('subject', v.subject, 'Vyžaduje sa subjekt'),
            ...validateRequired<OrderSendMail, 'title'>('title', v.title, 'Vyžaduje sa titulka'),
            ...validateRequired<OrderSendMail, 'message'>('message', v.message, 'Vyžaduje sa správa'),
            ...validateRequired<OrderSendMail, 'link'>('link', v.link, 'Vyžaduje sa odkaz'),
            ...validateRequired<OrderSendMail, 'attachment'>('attachment', v.attachment, 'Vyžaduje sa príloha')
        }
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setValues(prev => ({
            ...prev,
            [name as keyof OrderSendMail]: value,
        }));
    }

    const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        setBusy(true);
        try {
            e.preventDefault();

            const validationErrors = validate(values);
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length !== 0) return;

            const response = await configApi.setOrderSendMail(values, authState?.accessToken);
            errorState?.addError(response?.error);
        } finally {
            setBusy(false);
        }
    }

    return (
        <form
            className="flex flex-col justify-center items-center w-full"
            onSubmit={onSubmit}
            noValidate
        >
            <FormInput
                name="subject"
                label="Subjekt"
                placeholder="Zadajte subjekt"
                value={values.subject}
                error={errors.subject}
                onChange={onChange}
            />

            <FormInput
                name="title"
                label="Titulka"
                placeholder="Zadajte titulku"
                value={values.title}
                error={errors.title}
                onChange={onChange}
            />

            <FormInput
                name="message"
                label="Správa"
                placeholder="Zadajte správu"
                value={values.message}
                error={errors.message}
                onChange={onChange}
            />

            <FormInput
                name="link"
                label="Odkaz"
                placeholder="Zadajte odkaz"
                value={values.link}
                error={errors.link}
                onChange={onChange}
            />

            <FormInput
                name="attachment"
                label="Príloha"
                placeholder="Zadajte prílohu"
                value={values.attachment}
                error={errors.attachment}
                onChange={onChange}
            />

            <button
                type="submit"
                className="btn btn-primary mt-5"
                disabled={busy}
            >Potvrdiť
            </button>
        </form>
    )
}

const OrderStatusMailEditor = () => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [values, setValues] = useState<OrderStatusMail>({
        productionSubject: '',
        productionTitle: '',
        productionMessage: '',
        readySubject: '',
        readyTitle: '',
        readyMessage: '',
        finishedSubject: '',
        finishedTitle: '',
        finishedMessage: '',
        cancelledSubject: '',
        cancelledTitle: '',
        cancelledMessage: '',
        link: '',
        attachment: ''
    });

    useEffect(() => {
        let isMounted = true;

        const loadValues = async () => {
            if (!authState || !isMounted) {
                return;
            }

            const response = await configApi.getOrderStatusMail();
            if (response.data) {
                setValues(response.data);
            }
            errorState?.addError(response.error);
        };

        void loadValues();

        return () => {
            isMounted = false;
        };
    }, []);

    const [errors, setErrors] = useState<FieldErrors<OrderStatusMail>>({});
    const [busy, setBusy] = useState(false);

    const validate = (v: OrderStatusMail): FieldErrors<OrderStatusMail> => {
        return {
            ...validateRequired<OrderStatusMail, 'productionSubject'>('productionSubject', v.productionSubject, 'Vyžaduje sa subjekt'),
            ...validateRequired<OrderStatusMail, 'productionTitle'>('productionTitle', v.productionTitle, 'Vyžaduje sa titulka'),
            ...validateRequired<OrderStatusMail, 'productionMessage'>('productionMessage', v.productionMessage, 'Vyžaduje sa správa'),
            ...validateRequired<OrderStatusMail, 'readySubject'>('readySubject', v.readySubject, 'Vyžaduje sa subjekt'),
            ...validateRequired<OrderStatusMail, 'readyTitle'>('readyTitle', v.readyTitle, 'Vyžaduje sa titulka'),
            ...validateRequired<OrderStatusMail, 'readyMessage'>('readyMessage', v.readyMessage, 'Vyžaduje sa správa'),
            ...validateRequired<OrderStatusMail, 'finishedSubject'>('finishedSubject', v.finishedSubject, 'Vyžaduje sa subjekt'),
            ...validateRequired<OrderStatusMail, 'finishedTitle'>('finishedTitle', v.finishedTitle, 'Vyžaduje sa titulka'),
            ...validateRequired<OrderStatusMail, 'finishedMessage'>('finishedMessage', v.finishedMessage, 'Vyžaduje sa správa'),
            ...validateRequired<OrderStatusMail, 'cancelledSubject'>('cancelledSubject', v.cancelledSubject, 'Vyžaduje sa subjekt'),
            ...validateRequired<OrderStatusMail, 'cancelledTitle'>('cancelledTitle', v.cancelledTitle, 'Vyžaduje sa titulka'),
            ...validateRequired<OrderStatusMail, 'cancelledMessage'>('cancelledMessage', v.cancelledMessage, 'Vyžaduje sa správa'),
            ...validateRequired<OrderStatusMail, 'link'>('link', v.link, 'Vyžaduje sa odkaz'),
            ...validateRequired<OrderStatusMail, 'attachment'>('attachment', v.attachment, 'Vyžaduje sa príloha')
        }
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setValues(prev => ({
            ...prev,
            [name as keyof OrderStatusMail]: value,
        }));
    }

    const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        setBusy(true);
        try {
            e.preventDefault();

            const validationErrors = validate(values);
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length !== 0) return;

            const response = await configApi.setOrderStatusMail(values, authState?.accessToken);
            errorState?.addError(response?.error);
        } finally {
            setBusy(false);
        }
    }

    return (
        <form
            className="flex flex-col justify-center items-center w-full"
            onSubmit={onSubmit}
            noValidate
        >
            <FormInput
                name="productionSubject"
                label="Subjekt vo výrobe"
                placeholder="Zadajte subjekt vo výrobe"
                value={values.productionSubject}
                error={errors.productionSubject}
                onChange={onChange}
            />

            <FormInput
                name="productionTitle"
                label="Titulka vo výrobe"
                placeholder="Zadajte titulku vo výrobe"
                value={values.productionTitle}
                error={errors.productionTitle}
                onChange={onChange}
            />

            <FormInput
                name="productionMessage"
                label="Správa vo výrobe"
                placeholder="Zadajte správu vo výrobe"
                value={values.productionMessage}
                error={errors.productionMessage}
                onChange={onChange}
            />

            <FormInput
                name="readySubject"
                label="Subjekt pripravená"
                placeholder="Zadajte subjekt pripravená"
                value={values.readySubject}
                error={errors.readySubject}
                onChange={onChange}
            />

            <FormInput
                name="readyTitle"
                label="Titulka pripravená"
                placeholder="Zadajte titulku pripravená"
                value={values.readyTitle}
                error={errors.readyTitle}
                onChange={onChange}
            />

            <FormInput
                name="readyMessage"
                label="Správa pripravená"
                placeholder="Zadajte správu pripravená"
                value={values.readyMessage}
                error={errors.readyMessage}
                onChange={onChange}
            />

            <FormInput
                name="finishedSubject"
                label="Subjekt vyzdvihnutá"
                placeholder="Zadajte subjekt vyzdvihnutá"
                value={values.finishedSubject}
                error={errors.finishedSubject}
                onChange={onChange}
            />

            <FormInput
                name="finishedTitle"
                label="Titulka vyzdvihnutá"
                placeholder="Zadajte titulku vyzdvihnutá"
                value={values.finishedTitle}
                error={errors.finishedTitle}
                onChange={onChange}
            />

            <FormInput
                name="finishedMessage"
                label="Správa vyzdvihnutá"
                placeholder="Zadajte správu vyzdvihnutá"
                value={values.finishedMessage}
                error={errors.finishedMessage}
                onChange={onChange}
            />

            <FormInput
                name="cancelledSubject"
                label="Subjekt zrušená"
                placeholder="Zadajte subjekt zrušená"
                value={values.cancelledSubject}
                error={errors.cancelledSubject}
                onChange={onChange}
            />

            <FormInput
                name="cancelledTitle"
                label="Titulka zrušená"
                placeholder="Zadajte titulku zrušená"
                value={values.cancelledTitle}
                error={errors.cancelledTitle}
                onChange={onChange}
            />

            <FormInput
                name="cancelledMessage"
                label="Správa zrušená"
                placeholder="Zadajte správu zrušená"
                value={values.cancelledMessage}
                error={errors.cancelledMessage}
                onChange={onChange}
            />

            <FormInput
                name="link"
                label="Odkaz"
                placeholder="Zadajte odkaz"
                value={values.link}
                error={errors.link}
                onChange={onChange}
            />

            <FormInput
                name="attachment"
                label="Príloha"
                placeholder="Zadajte prílohu"
                value={values.attachment}
                error={errors.attachment}
                onChange={onChange}
            />

            <button
                type="submit"
                className="btn btn-primary mt-5"
                disabled={busy}
            >Potvrdiť
            </button>
        </form>
    )
}
