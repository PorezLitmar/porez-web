import {type Board, type BoardData, Unit} from '../../api/model/porez';
import {type ChangeEvent, useContext, useState} from 'react';
import {AppContext, DialogContext} from '../../state';
import {createPortal} from 'react-dom';
import BaseDialog from '../dialog/base-dialog';
import FormInput from '../form/form-input';
import {
    type FieldErrors,
    formatNumber,
    getEnumValue,
    parseNumber,
    validateIntegerNumber,
    validateNumber,
    validateRequired
} from '..';
import FormTextArea from '../form/form-text-area';
import FormCheckBox from '../form/form-check-box';

type FormValues = {
    code: string;
    name: string;
    description: string;
    boardCode: string;
    structureCode: string;
    orientation: boolean;
    weight: string;
    length: string;
    width: string;
    thickness: string;
    price: string;
    inStock: boolean;
};

const BoardDialog = ({dialogId, showDialog, board, okHandler, cancelHandler}: {
    dialogId: string,
    showDialog: boolean,
    board?: Board,
    okHandler: (boardData: BoardData) => Promise<void>,
    cancelHandler: () => void
}) => {
    const appState = useContext(AppContext);
    const dialogState = useContext(DialogContext);

    const [values, setValues] = useState<FormValues>({
        code: board?.code ?? '',
        name: board?.name ?? '',
        description: board?.description ?? '',
        boardCode: board?.boardCode ?? '',
        structureCode: board?.structureCode ?? '',
        orientation: board?.orientation ?? false,
        weight: formatNumber(board?.weight),
        length: formatNumber(board?.length),
        width: formatNumber(board?.width),
        thickness: formatNumber(board?.thickness),
        price: formatNumber(board?.price),
        inStock: board?.inStock ?? false,
    });
    const [errors, setErrors] = useState<FieldErrors<FormValues>>({});
    const [busy, setBusy] = useState(false);

    const validate = (v: FormValues): FieldErrors<FormValues> => {
        return {
            ...validateRequired<FormValues, 'code'>('code', v.code, 'Vyžaduje sa kód'),
            ...validateRequired<FormValues, 'name'>('name', v.name, 'Vyžaduje sa názov'),
            ...validateRequired<FormValues, 'boardCode'>('boardCode', v.boardCode, 'Vyžaduje sa kód dosky'),
            ...validateRequired<FormValues, 'structureCode'>('structureCode', v.structureCode, 'Vyžaduje sa kód štruktúry'),
            ...validateIntegerNumber<FormValues, 'length'>('length', v.length, {
                message: 'Neplatný formát dĺžky',
                allowBlank: false,
                requiredMessage: 'Vyžaduje sa dĺžka'
            }),
            ...validateIntegerNumber<FormValues, 'width'>('width', v.width, {
                message: 'Neplatný formát šírky',
                allowBlank: false,
                requiredMessage: 'Vyžaduje sa šírka'
            }),
            ...validateIntegerNumber<FormValues, 'thickness'>('thickness', v.thickness, {
                message: 'Neplatný formát hrúbky',
                allowBlank: false,
                requiredMessage: 'Vyžaduje sa hrúbka'
            }),
            ...validateNumber<FormValues, 'weight'>('weight', v.weight, {
                message: 'Neplatný formát hmotnosti',
                allowBlank: false,
                requiredMessage: 'Vyžaduje sa hmotnosť'
            }),
            ...validateNumber<FormValues, 'price'>('price', v.price, {
                message: 'Neplatný formát hmotnosti',
                allowBlank: false,
                requiredMessage: 'Vyžaduje sa cena'
            }),
        };
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, type, value, checked} = e.target;
        const nextValue = type === 'checkbox' ? checked : value;

        setValues(prev => ({
            ...prev,
            [name as keyof FormValues]: nextValue as FormValues[keyof FormValues],
        }));
    }

    const onSubmit = async () => {
        setBusy(true);
        try {
            const validationErrors = validate(values);
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length !== 0) return;

            await okHandler({
                ...values,
                weight: parseNumber(values.weight) ?? 0,
                length: parseNumber(values.length) ?? 0,
                width: parseNumber(values.width) ?? 0,
                thickness: parseNumber(values.thickness) ?? 0,
                price: parseNumber(values.price) ?? 0,
            });
        } finally {
            setBusy(false);
        }
    }

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog id={dialogId} showDialog={showDialog} closeHandler={cancelHandler}>
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">Doska</div>
                </div>

                <div className="flex flex-col justify-center items-center w-full max-w-md">
                    <FormInput
                        name="code"
                        label="Kód"
                        placeholder="Zadajte kód"
                        value={values.code}
                        error={errors.code}
                        onChange={onChange}
                    />

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
                            name="boardCode"
                            label="Kód dosky"
                            placeholder="Zadajte kód dosky"
                            value={values.boardCode}
                            error={errors.boardCode}
                            onChange={onChange}
                        />

                        <FormInput
                            name="structureCode"
                            label="Kód štruktúry"
                            placeholder="Zadajte kód štruktúry"
                            value={values.structureCode}
                            error={errors.structureCode}
                            onChange={onChange}
                        />
                    </div>

                    <FormTextArea
                        name="description"
                        label="Popis"
                        placeholder="Zadajte popis"
                        value={values.description}
                        error={errors.description}
                        onChange={value => setValues({...values, description: value})}
                    />

                    <div className="flex flex-row gap-5 w-full">
                        <FormInput
                            name="length"
                            label={`Dĺžka [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}
                            placeholder="Zadajte dĺžku"
                            value={values.length}
                            error={errors.length}
                            onChange={onChange}
                        />

                        <FormInput
                            name="width"
                            label={`Šírka [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}
                            placeholder="Zadajte šírku"
                            value={values.width}
                            error={errors.width}
                            onChange={onChange}
                        />
                    </div>

                    <div className="flex flex-row gap-5 w-full">
                        <FormInput
                            name="thickness"
                            label={`Hrúbka [${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}]`}
                            placeholder="Zadajte hrúbku"
                            value={values.thickness}
                            error={errors.thickness}
                            onChange={onChange}
                        />

                        <FormInput
                            name="weight"
                            label={`Hmotnosť [${getEnumValue(Unit.KILOGRAM, appState?.units ?? [])}]`}
                            placeholder="Zadajte hmotnosť"
                            value={values.weight}
                            error={errors.weight}
                            onChange={onChange}
                        />
                    </div>

                    <FormInput
                        name="price"
                        label={`Cena [${getEnumValue(Unit.CURRENCY, appState?.units ?? [])}]`}
                        placeholder="Zadajte cenu"
                        value={values.price}
                        error={errors.price}
                        onChange={onChange}
                    />

                    <div className="flex flex-row gap-5 w-full">
                        <FormCheckBox
                            name="orientation"
                            value={values.orientation}
                            error={errors.orientation}
                            onChange={onChange}
                        >
                            <span>Orientácia</span>
                        </FormCheckBox>

                        <FormCheckBox
                            name="inStock"
                            value={values.inStock}
                            error={errors.inStock}
                            onChange={onChange}
                        >
                            <span>Skladom</span>
                        </FormCheckBox>
                    </div>

                    <div className="join mt-5">
                        <button
                            type="button"
                            className="btn btn-primary join-item"
                            disabled={busy}
                            onClick={onSubmit}
                        >Potvrdiť
                        </button>
                        <button
                            type="button"
                            className="btn btn-accent join-item"
                            onClick={cancelHandler}
                        >Zrušiť
                        </button>
                    </div>
                </div>
            </div>
        </BaseDialog>
        , dialogState.modalRoot))
}

export default BoardDialog;
