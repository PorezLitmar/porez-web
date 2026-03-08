import {ProductCornerType, Unit} from '../../../api/model/porez';
import type {FormProductCorner} from '..';
import {type ChangeEvent, useContext, useState} from 'react';
import {AppContext, DialogContext} from '../../../state';
import {type FieldErrors, getEnumValue, validateIntegerNumber} from '../..';
import {createPortal} from 'react-dom';
import BaseDialog from '../../dialog/base-dialog';
import FormInput from '../../form/form-input';
import FormSelect from '../../form/form-select';

type FormValues = {
    type: ProductCornerType,
    x: string,
    y: string
}

const FormerCornerDialog = (
    {
        name,
        corner,
        setCorner,
        showDialog,
        setShowDialog
    }: {
        name?: string,
        corner?: FormProductCorner,
        setCorner: (corner: FormProductCorner) => void,
        showDialog: boolean,
        setShowDialog: (showDialog: boolean) => void
    }
) => {
    const appState = useContext(AppContext);
    const dialogState = useContext(DialogContext);

    const [values, setValues] = useState<FormValues>({
        type: corner ? corner.type : ProductCornerType.STRAIGHT,
        x: corner ? corner.length : '',
        y: corner ? corner.width : ''
    });
    const [errors, setErrors] = useState<FieldErrors<FormValues>>({});

    const validate = (v: FormValues): FieldErrors<FormValues> => {
        if (v.type === ProductCornerType.ROUNDED) {
            return {
                ...validateIntegerNumber<FormValues, 'x'>('x', v.x, {
                    message: 'Neplatný formát polomeru',
                    allowBlank: false,
                    requiredMessage: 'Vyžaduje sa polomer'
                })
            };
        }

        return {
            ...validateIntegerNumber<FormValues, 'x'>('x', v.x, {
                message: 'Neplatný formát x',
                allowBlank: false,
                requiredMessage: 'Vyžaduje sa x'
            }),
            ...validateIntegerNumber<FormValues, 'y'>('y', v.y, {
                message: 'Neplatný formát y',
                allowBlank: false,
                requiredMessage: 'Vyžaduje sa y'
            })
        };
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setValues(prev => ({
            ...prev,
            [name as keyof FormValues]: value,
        }));
    }

    const onSubmit = async () => {
        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length !== 0) return;

        if (values.type == ProductCornerType.ROUNDED) {
            setCorner({type: ProductCornerType.ROUNDED, length: values.x, width: values.x});
        } else {
            setCorner({type: ProductCornerType.STRAIGHT, length: values.x, width: values.y});
        }
        setShowDialog(false);
    }

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog
            id="form-corner-dialog"
            showDialog={showDialog}
            closeHandler={() => setShowDialog(false)}
        >
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl"> {name ? `Roh ${name}` : 'Roh'}</div>
                </div>

                <div className="flex flex-col justify-center items-center w-full max-w-md">
                    <FormSelect
                        name="type"
                        label="Typ rohu"
                        value={values.type}
                        onChange={event => setValues({...values, type: event.target.value as ProductCornerType})}
                    >
                        <option value={ProductCornerType.STRAIGHT}>
                            {getEnumValue(ProductCornerType.STRAIGHT, appState?.productCornerTypes ?? [])}
                        </option>
                        <option value={ProductCornerType.ROUNDED}>
                            {getEnumValue(ProductCornerType.ROUNDED, appState?.productCornerTypes ?? [])}
                        </option>
                    </FormSelect>

                    {values.type === ProductCornerType.STRAIGHT ?
                        <>
                            <FormInput
                                name="x"
                                label={`x [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}
                                placeholder="Zadajte x"
                                value={values.x}
                                error={errors.x}
                                onChange={onChange}
                            />

                            <FormInput
                                name="y"
                                label={`y [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}
                                placeholder="Zadajte y"
                                value={values.y}
                                error={errors.y}
                                onChange={onChange}
                            />
                        </>
                        :
                        <>
                            <FormInput
                                name="x"
                                label={`r [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}
                                placeholder="Zadajte polomer"
                                value={values.x}
                                error={errors.x}
                                onChange={onChange}
                            />
                        </>
                    }

                    <div className="join mt-5">
                        <button
                            type="button"
                            className="btn btn-primary join-item"
                            onClick={onSubmit}
                        >Potvrdiť
                        </button>
                        <button
                            type="button"
                            className="btn btn-accent join-item"
                            onClick={() => setShowDialog(false)}
                        >Zrušiť
                        </button>
                    </div>
                </div>
            </div>
        </BaseDialog>,
        dialogState.modalRoot
    ))
}

export default FormerCornerDialog;
