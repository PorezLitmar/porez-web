import {NavLink} from 'react-router-dom';
import {type ChangeEvent, type SubmitEvent, useContext, useEffect, useState} from 'react';
import {AuthContext, ErrorContext} from '../../state';
import {type FieldErrors, PHONE_REGEX, validateEmail, validatePattern, validateRequired} from '../../component';
import FormInput from '../../component/form/form-input';
import * as applicationInfoApi from '../../api/client/application-info';
import FormTextArea from '../../component/form/form-text-area';
import type {CompanyInfo} from '../../api/model/porez';

const AdminCompanyInfoPage = () => {

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Správca</li>
                    <li><NavLink to="/admin/company-info">Informácie o spoločnosti</NavLink></li>
                </ul>
            </div>

            <AdminCompanyInfoPageContent/>
        </>
    );
};

export default AdminCompanyInfoPage;

const AdminCompanyInfoPageContent = () => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [values, setValues] = useState<CompanyInfo>({
        name: '',
        street: '',
        city: '',
        zipCode: '',
        state: '',
        phone: '',
        mail: '',
        businessId: '',
        taxId: '',
        vatRegNo: '',
        commercialRegisterInfo: '',
        mapUrl: '',
    });

    useEffect(() => {
        let isMounted = true;

        const loadValues = async () => {
            if (!authState || !isMounted) {
                return;
            }

            const response = await applicationInfoApi.getCompanyInfo();
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

    const [errors, setErrors] = useState<FieldErrors<CompanyInfo>>({});
    const [busy, setBusy] = useState(false);

    const validate = (v: CompanyInfo): FieldErrors<CompanyInfo> => {
        return {
            ...validateRequired<CompanyInfo, 'name'>('name', v.name, 'Vyžaduje sa názov'),
            ...validateEmail<CompanyInfo, 'mail'>('mail', v.mail),
            ...validatePattern<CompanyInfo, 'phone'>('phone', v.phone, PHONE_REGEX, {
                message: 'Neplatné telefónne číslo',
                allowBlank: false,
                requiredMessage: 'Vyžaduje sa telefónne číslo'
            }),
            ...validateRequired<CompanyInfo, 'street'>('street', v.street, 'Vyžaduje sa ulica'),
            ...validateRequired<CompanyInfo, 'city'>('city', v.city, 'Vyžaduje sa mesto'),
            ...validateRequired<CompanyInfo, 'zipCode'>('zipCode', v.zipCode, 'Vyžaduje sa PSČ'),
            ...validateRequired<CompanyInfo, 'state'>('state', v.state, 'Vyžaduje sa štát'),
            ...validateRequired<CompanyInfo, 'mapUrl'>('mapUrl', v.mapUrl, 'Vyžaduje sa mapa'),
        };
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setValues(prev => ({
            ...prev,
            [name as keyof CompanyInfo]: value,
        }));
    }

    const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        setBusy(true);
        try {
            e.preventDefault();

            const validationErrors = validate(values);
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length !== 0) return;

            const response = await applicationInfoApi.setCompanyInfo(values, authState?.accessToken);
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
                    name="mail"
                    label="Email"
                    placeholder="Zadajte email"
                    value={values.mail}
                    error={errors.mail}
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

                <FormInput
                    name="state"
                    label="Štát"
                    placeholder="Zadajte štát"
                    value={values.state}
                    error={errors.state}
                    onChange={onChange}
                />
            </div>

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

                <FormInput
                    name="vatRegNo"
                    label="IČ DPH"
                    placeholder="Zadajte IČ DPH"
                    value={values.vatRegNo}
                    error={errors.vatRegNo}
                    onChange={onChange}
                />
            </div>

            <FormTextArea
                label="Daňová registračná informácia"
                name="commercialRegisterInfo"
                placeholder="Zadajte daňovú registračnú informáciu"
                value={values.commercialRegisterInfo}
                onChange={value => setValues({...values, commercialRegisterInfo: value})}
            />

            <div className="flex flex-row items-end justify-center gap-5 w-full mt-5">
                <FormTextArea
                    label="Mapa"
                    name="mapUrl"
                    placeholder="Zadajte mapu"
                    value={values.mapUrl}
                    onChange={(value) => setValues({...values, mapUrl: value})}
                    rows={6}
                />

                <iframe
                    title="contact-info-frame"
                    width="100%"
                    height="100%"
                    src={values.mapUrl}
                    className="border border-base-300 w-full">
                </iframe>
            </div>

            <button
                type="submit"
                className="btn btn-primary mt-5"
                disabled={busy}
            >Potvrdiť
            </button>
        </form>
    )
}