import {ProductDecorOrientation} from '../../../api/model/porez';
import {useContext} from 'react';
import {AppContext} from '../../../state';
import FormSelect from '../../form/form-select';
import {getEnumValue} from '../..';

const FormBoardOrientationEditor = (
    {
        label,
        disabled = false,
        decorOrientation,
        setDecorOrientation
    }: {
        label?: string,
        disabled?: boolean,
        decorOrientation: ProductDecorOrientation,
        setDecorOrientation: (decorOrientation: ProductDecorOrientation) => void
    }
) => {
    const appState = useContext(AppContext);

    return (
        <FormSelect
            name="decorOrientation"
            label={label}
            value={decorOrientation}
            onChange={event => setDecorOrientation(event.currentTarget.value as ProductDecorOrientation)}
            disabled={disabled}
        >
            <option value={ProductDecorOrientation.ALONG_LENGTH}>
                {getEnumValue(ProductDecorOrientation.ALONG_LENGTH, appState?.productDecorOrientations ?? [])}
            </option>
            <option value={ProductDecorOrientation.ALONG_WIDTH}>
                {getEnumValue(ProductDecorOrientation.ALONG_WIDTH, appState?.productDecorOrientations ?? [])}
            </option>
        </FormSelect>
    )
}

export default FormBoardOrientationEditor;