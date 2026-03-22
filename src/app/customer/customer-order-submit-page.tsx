import {NavLink, useNavigate, useParams} from 'react-router-dom';
import OrderEditProvider from '../../state/order-edit';
import {type ChangeEvent, type SubmitEvent, useContext, useEffect, useRef, useState} from 'react';
import {AppContext, ErrorContext, OrderEditContext} from '../../state';
import {ErrorCode, type Order, OrderPackageType} from '../../api/model/porez';
import {
    type FieldErrors,
    getEnumValue,
    parseDate,
    PHONE_REGEX,
    validateEmail,
    validatePattern,
    validateRequired
} from '../../component';
import FormInput from '../../component/form/form-input';
import FormCheckBox from '../../component/form/form-check-box';
import FormSelect from '../../component/form/form-select';

const CustomerOrderSubmitPage = () => {
    const {id} = useParams();

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li><NavLink to="/customer/order">Objednávka</NavLink></li>
                    <li><NavLink to={`/customer/orders/${id}/edit`}>Upraviť objednávku</NavLink></li>
                    <li><NavLink to={`/customer/orders/${id}/submit`}>Odoslať objednávku</NavLink></li>
                </ul>
            </div>

            <OrderEditProvider>
                <CustomerOrderSubmitPageContent id={id ?? ''}/>
            </OrderEditProvider>
        </>
    );
};

export default CustomerOrderSubmitPage;

type FormValues = {
    name: string;
    street: string;
    zipCode: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    businessId: string;
    taxId: string;
    gdprAgreement: boolean;
    businessConditionsAgreement: boolean;
    deliveryDate: string;
    packageType: OrderPackageType;
};

const CustomerOrderSubmitPageContent = ({id}: { id: string }) => {
    const navigate = useNavigate();

    const appState = useContext(AppContext);
    const errorState = useContext(ErrorContext);
    const orderEditState = useContext(OrderEditContext);

    const [order, setOrder] = useState<Order>();
    const [lastContact, setLastContact] = useState<Order['contact']>();

    const [loading, setLoading] = useState(true);

    const [values, setValues] = useState<FormValues>({
        name: '',
        street: '',
        zipCode: '',
        city: '',
        state: '',
        phone: '',
        email: '',
        businessId: '',
        taxId: '',
        gdprAgreement: false,
        businessConditionsAgreement: false,
        deliveryDate: '',
        packageType: OrderPackageType.NO_PACKAGE
    });
    const [isDirty, setIsDirty] = useState(false);
    const lastContactRequested = useRef(false);
    const [errors, setErrors] = useState<FieldErrors<FormValues>>({});
    const [formError, setFormError] = useState<string>();

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const response = await orderEditState?.getOrder(id);
                if (response?.data) {
                    setOrder(response.data);
                }
            } finally {
                setLoading(false);
            }
        })();

    }, [id]);

    useEffect(() => {
        if (lastContactRequested.current || !orderEditState) {
            return;
        }
        lastContactRequested.current = true;
        (async () => {
            const response = await orderEditState?.getLastContact();
            if (response?.data) {
                setLastContact(response.data);
            }
        })();
    }, [orderEditState]);

    useEffect(() => {
        const contact = order?.contact ?? lastContact;
        if (isDirty) {
            return;
        }
        (async () => setValues({
            name: contact?.name ?? '',
            street: contact?.street ?? '',
            zipCode: contact?.zipCode ?? '',
            city: contact?.city ?? '',
            state: contact?.state ?? '',
            phone: contact?.phone ?? '',
            email: contact?.email ?? '',
            businessId: contact?.businessId ?? '',
            taxId: contact?.taxId ?? '',
            gdprAgreement: false,
            businessConditionsAgreement: false,
            deliveryDate: order?.deliveryDate ?? '',
            packageType: order?.packageType ?? OrderPackageType.NO_PACKAGE,
        }))();
    }, [isDirty, lastContact, order])

    const validate = (v: FormValues): FieldErrors<FormValues> => {
        const e: FieldErrors<FormValues> = {
            ...validateRequired<FormValues, 'name'>('name', v.name, 'Vyžaduje sa názov'),
            ...validateRequired<FormValues, 'street'>('street', v.street, 'Vyžaduje sa ulica'),
            ...validateRequired<FormValues, 'zipCode'>('zipCode', v.zipCode, 'Vyžaduje sa PSČ'),
            ...validateRequired<FormValues, 'city'>('city', v.city, 'Vyžaduje sa mesto'),
            ...validateRequired<FormValues, 'state'>('state', v.state, 'Vyžaduje sa štát'),
            ...validatePattern<FormValues, 'phone'>('phone', v.phone, PHONE_REGEX, {
                message: 'Neplatné telefónne číslo',
                allowBlank: false,
                requiredMessage: 'Vyžaduje sa telefónne číslo'
            }),
            ...validateEmail<FormValues, 'email'>('email', v.email),
        }

        if (!v.gdprAgreement) {
            e.gdprAgreement = 'Vyžaduje sa GDPR súhlas';
        }

        if (!v.businessConditionsAgreement) {
            e.businessConditionsAgreement = 'Vyžaduje sa súhlas s obchodnými podmienkami';
        }

        return e;
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, type, value, checked} = e.target;
        const nextValue = type === 'checkbox' ? checked : value;

        setIsDirty(true);
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

        const dateValue = parseDate(values.deliveryDate);

        const response = await orderEditState?.sendOrder(order?.id ?? '', {
            contact: {
                name: values.name,
                street: values.street,
                zipCode: values.zipCode,
                city: values.city,
                state: values.state,
                phone: values.phone,
                email: values.email,
                businessId: values.businessId,
                taxId: values.taxId
            },
            gdprAgreement: values.gdprAgreement,
            businessConditionsAgreement: values.businessConditionsAgreement,
            deliveryDate: dateValue ? dateValue.toISOString() : undefined,
            packageType: values.packageType
        });
        if (response?.error) {
            switch (response.error.code) {
                case ErrorCode.ORDER_IS_EMPTY:
                    setFormError('Prázdna objednávka.');
                    break;
                case ErrorCode.ORDER_AGREEMENTS_INVALID:
                    setFormError('Vyžaduje sa súhlas s Gdpr a obchodnými podmienkami.');
                    break;
                case ErrorCode.ORDER_DELIVERY_DATE_INVALID:
                    setFormError('Nesprávny dátum dodania.');
                    break;
                case ErrorCode.ORDER_DELIVERY_DATE_MIN_DELIVERY_DAYS:
                    setFormError(`Dátum dodania je menší ako počet pracovných dní potrebných na vybavenie objednávky (${appState?.orderDeliveryMinDays || 5}).`);
                    break;
                case ErrorCode.ORDER_DELIVERY_DATE_NOT_WORKING_DAY:
                    setFormError(`Dátum dodania nie je pracovný deň.`);
                    break;
                default:
                    errorState?.addError(response.error);
                    break;
            }
        } else {
            navigate('/customer/orders');
        }
    }


    return (
        <>
            {loading &&
                <div className="flex flex-col justify-center items-center w-full">
                    <span className="loading loading-xl loading-spinner text-primary"></span>
                    <span>Načítavanie objednávky...</span>
                </div>
            }
            {!loading &&
                <form
                    className="flex flex-col justify-center items-center w-full max-w-xl"
                    onSubmit={onSubmit}
                    noValidate
                >
                    <FormInput
                        name="name"
                        label="Názov"
                        placeholder="Zadajte názov"
                        value={values.name}
                        error={errors.name}
                        onChange={onChange}
                    />

                    <div className="flex flex-row gap-5 w-full">
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
                            name="phone"
                            label="Telefónne číslo"
                            placeholder="Zadajte telefónne číslo"
                            value={values.phone}
                            error={errors.phone}
                            onChange={onChange}
                        />
                    </div>

                    <FormInput
                        name="street"
                        label="Ulica"
                        placeholder="Zadajte ulicu"
                        value={values.street}
                        error={errors.street}
                        onChange={onChange}
                    />

                    <div className="flex flex-row gap-5 w-full">
                        <FormInput
                            name="city"
                            label="Mesto"
                            placeholder="Zadajte mesto"
                            value={values.city}
                            error={errors.city}
                            onChange={onChange}
                        />

                        <FormInput
                            name="zipCode"
                            label="PSČ"
                            placeholder="Zadajte PSČ"
                            value={values.zipCode}
                            error={errors.zipCode}
                            onChange={onChange}
                        />
                    </div>

                    <FormInput
                        name="state"
                        label="Štát"
                        placeholder="Zadajte štát"
                        value={values.state}
                        error={errors.state}
                        onChange={onChange}
                    />

                    <div className="flex flex-row gap-5 w-full">
                        <FormInput
                            name="businessId"
                            label="IČO"
                            placeholder="Zadajte IČO"
                            value={values.businessId}
                            error={errors.businessId}
                            onChange={onChange}
                        />

                        <FormInput
                            name="taxId"
                            label="DIČ"
                            placeholder="Zadajte DIČ"
                            value={values.taxId}
                            error={errors.taxId}
                            onChange={onChange}
                        />
                    </div>

                    <div className="flex flex-row gap-5 w-full">
                        <FormInput
                            type="date"
                            name="deliveryDate"
                            label="Dátum dodania"
                            value={values.deliveryDate}
                            error={errors.deliveryDate}
                            onChange={onChange}
                        />

                        <FormSelect
                            name="packageType"
                            label="Spôsob doručenia a balenia"
                            value={values.packageType}
                            error={errors.packageType}
                            onChange={event => {
                                setIsDirty(true);
                                setValues({
                                    ...values,
                                    packageType: event.currentTarget.value as OrderPackageType
                                });
                            }}
                        >
                            <option value={OrderPackageType.NO_PACKAGE}>
                                {getEnumValue(OrderPackageType.NO_PACKAGE, appState?.orderPackageTypes ?? [])}
                            </option>
                            <option value={OrderPackageType.NO_PACKAGE_WITH_REMAINS}>
                                {getEnumValue(OrderPackageType.NO_PACKAGE_WITH_REMAINS, appState?.orderPackageTypes ?? [])}
                            </option>
                            <option value={OrderPackageType.PACKAGE}>
                                {getEnumValue(OrderPackageType.PACKAGE, appState?.orderPackageTypes ?? [])}
                            </option>
                            <option value={OrderPackageType.PACKAGE_WITH_REMAINS}>
                                {getEnumValue(OrderPackageType.PACKAGE_WITH_REMAINS, appState?.orderPackageTypes ?? [])}
                            </option>
                        </FormSelect>
                    </div>

                    <FormCheckBox
                        name="gdprAgreement"
                        value={values.gdprAgreement}
                        error={errors.gdprAgreement}
                        onChange={onChange}>
                        <NavLink
                            className="link text-xs"
                            to="/gdpr-info"
                        >GDPR súhlas</NavLink>
                    </FormCheckBox>


                    <FormCheckBox
                        name="businessConditionsAgreement"
                        value={values.businessConditionsAgreement}
                        error={errors.businessConditionsAgreement}
                        onChange={onChange}>
                        <NavLink
                            className="link text-xs"
                            to="/business-conditions"
                        >Súhlas s obchodnými podmienkami</NavLink>
                    </FormCheckBox>

                    <button
                        type="submit"
                        className="btn btn-primary mt-5"
                        disabled={orderEditState?.busy}
                    >Odoslať
                    </button>

                    {formError &&
                        <div className="alert alert-error w-full">
                            <span>{formError}</span>
                        </div>
                    }
                </form>
            }
        </>
    )
}
