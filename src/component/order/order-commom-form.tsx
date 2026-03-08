import FormCornerEditor from './corner/form-corner-editor';
import {type FieldErrors, getEnumValue} from '..';
import FormCheckBox from '../form/form-check-box';
import {type FormOrderCommon, onFormOrderCommonChange} from '.';
import FormEdgeEditor from './edge/form-edge-editor';
import {type Board, type Edge, ProductCornerPosition, ProductPosition} from '../../api/model/porez';
import {useContext} from 'react';
import {AppContext} from '../../state';
import type {ClientResponse} from '../../api/client';

const OrderCommonForm = (
    {
        disabled,
        values,
        setValues,
        errors,
        board,
        getEdge
    }: {
        disabled: boolean,
        values: FormOrderCommon
        setValues: (values: FormOrderCommon) => void,
        errors: FieldErrors<FormOrderCommon>,
        board?: Board,
        getEdge: (id: string) => Promise<ClientResponse<Edge>>
    }
) => {
    const appState = useContext(AppContext);

    return (
        <>
            <FormCheckBox
                disabled={disabled}
                name="allEdgesEnabled"
                onChange={event => setValues({...values, allEdgesEnabled: event.target.checked})}
            >
                <span>Povoliť všetky hrany</span>
            </FormCheckBox>

            <div className="flex flex-row w-full gap-5">
                <FormEdgeEditor
                    disabled={disabled}
                    label={`Hrana ${getEnumValue(ProductPosition.A1, appState?.productEdgePositions ?? [])}`}
                    name="edgeA1"
                    allEdgesEnabled={values.allEdgesEnabled}
                    edges={board?.edges ?? []}
                    edgeId={values.edgeA1}
                    setEdgeId={async (value) => {
                        const commonValues = await onFormOrderCommonChange({...values}, {...values, edgeA1: value});
                        setValues(commonValues);
                    }}
                    error={errors.edgeA1}
                    getEdge={getEdge}
                />

                <FormEdgeEditor
                    disabled={disabled}
                    label={`Hrana ${getEnumValue(ProductPosition.A2, appState?.productEdgePositions ?? [])}`}
                    name="edgeA2"
                    allEdgesEnabled={values.allEdgesEnabled}
                    edges={board?.edges ?? []}
                    edgeId={values.edgeA2}
                    setEdgeId={async (value) => {
                        const commonValues = await onFormOrderCommonChange({...values}, {...values, edgeA2: value});
                        setValues({...values, ...commonValues});
                    }}
                    error={errors.edgeA2}
                    getEdge={getEdge}
                />
            </div>

            <div className="flex flex-row w-full gap-5">
                <FormEdgeEditor
                    disabled={disabled}
                    label={`Hrana ${getEnumValue(ProductPosition.B1, appState?.productEdgePositions ?? [])}`}
                    name="edgeB1"
                    allEdgesEnabled={values.allEdgesEnabled}
                    edges={board?.edges ?? []}
                    edgeId={values.edgeB1}
                    setEdgeId={async (value) => {
                        const commonValues = await onFormOrderCommonChange({...values}, {...values, edgeB1: value});
                        setValues({...values, ...commonValues});
                    }}
                    error={errors.edgeB1}
                    getEdge={getEdge}
                />

                <FormEdgeEditor
                    disabled={disabled}
                    label={`Hrana ${getEnumValue(ProductPosition.B2, appState?.productEdgePositions ?? [])}`}
                    name="edgeB2"
                    allEdgesEnabled={values.allEdgesEnabled}
                    edges={board?.edges ?? []}
                    edgeId={values.edgeB2}
                    setEdgeId={async (value) => {
                        const commonValues = await onFormOrderCommonChange({...values}, {...values, edgeB2: value});
                        setValues({...values, ...commonValues});
                    }}
                    error={errors.edgeB2}
                    getEdge={getEdge}
                />
            </div>

            <div className="flex flex-row w-full gap-5">
                <FormCornerEditor
                    disabled={disabled}
                    label={`Roh ${getEnumValue(ProductCornerPosition.A1_B1, appState?.productCornerPositions ?? [])}`}
                    name="cornerA1B1"
                    corner={values.cornerA1B1}
                    setCorner={async (value) => {
                        const commonValues = await onFormOrderCommonChange({...values}, {
                            ...values,
                            cornerA1B1: value
                        });
                        setValues({...values, ...commonValues});
                    }}
                    error={errors.cornerA1B1}
                />

                <FormEdgeEditor
                    disabled={disabled || values.cornerA1B1 === undefined}
                    label={`Hrana ${getEnumValue(ProductCornerPosition.A1_B1, appState?.productCornerPositions ?? [])}`}
                    name="edgeA1B1"
                    allEdgesEnabled={values.allEdgesEnabled}
                    edges={board?.edges ?? []}
                    edgeId={values.edgeA1B1}
                    setEdgeId={async (value) => {
                        const commonValues = await onFormOrderCommonChange({...values}, {
                            ...values,
                            edgeA1B1: value
                        });
                        setValues({...values, ...commonValues});
                    }}
                    error={errors.edgeA1B1}
                    getEdge={getEdge}
                />
            </div>

            <div className="flex flex-row w-full gap-5">
                <FormCornerEditor
                    disabled={disabled}
                    label={`Roh ${getEnumValue(ProductCornerPosition.A1_B2, appState?.productCornerPositions ?? [])}`}
                    name="cornerA1B2"
                    corner={values.cornerA1B2}
                    setCorner={async (value) => {
                        const commonValues = await onFormOrderCommonChange({...values}, {
                            ...values,
                            cornerA1B2: value
                        });
                        setValues({...values, ...commonValues});
                    }}
                    error={errors.cornerA1B2}
                />

                <FormEdgeEditor
                    disabled={disabled || values.cornerA1B2 === undefined}
                    label={`Hrana ${getEnumValue(ProductCornerPosition.A1_B2, appState?.productCornerPositions ?? [])}`}
                    name="edgeA1B2"
                    allEdgesEnabled={values.allEdgesEnabled}
                    edges={board?.edges ?? []}
                    edgeId={values.edgeA1B2}
                    setEdgeId={async (value) => {
                        const commonValues = await onFormOrderCommonChange({...values}, {
                            ...values,
                            edgeA1B2: value
                        });
                        setValues({...values, ...commonValues});
                    }}
                    error={errors.edgeA1B2}
                    getEdge={getEdge}
                />
            </div>

            <div className="flex flex-row w-full gap-5">
                <FormCornerEditor
                    disabled={disabled}
                    label={`Roh ${getEnumValue(ProductCornerPosition.A2_B1, appState?.productCornerPositions ?? [])}`}
                    name="cornerA2B1"
                    corner={values.cornerA2B1}
                    setCorner={async (value) => {
                        const commonValues = await onFormOrderCommonChange({...values}, {
                            ...values,
                            cornerA2B1: value
                        });
                        setValues({...values, ...commonValues});
                    }}
                    error={errors.cornerA2B1}
                />

                <FormEdgeEditor
                    disabled={disabled || values.cornerA2B1 === undefined}
                    label={`Hrana ${getEnumValue(ProductCornerPosition.A2_B1, appState?.productCornerPositions ?? [])}`}
                    name="edgeA2B1"
                    allEdgesEnabled={values.allEdgesEnabled}
                    edges={board?.edges ?? []}
                    edgeId={values.edgeA2B1}
                    setEdgeId={async (value) => {
                        const commonValues = await onFormOrderCommonChange({...values}, {
                            ...values,
                            edgeA2B1: value
                        });
                        setValues({...values, ...commonValues});
                    }}
                    error={errors.edgeA2B1}
                    getEdge={getEdge}
                />
            </div>

            <div className="flex flex-row w-full gap-5">
                <FormCornerEditor
                    disabled={disabled}
                    label={`Roh ${getEnumValue(ProductCornerPosition.A2_B2, appState?.productCornerPositions ?? [])}`}
                    name="cornerA2B2"
                    corner={values.cornerA2B2}
                    setCorner={async (value) => {
                        const commonValues = await onFormOrderCommonChange({...values}, {
                            ...values,
                            cornerA2B2: value
                        });
                        setValues({...values, ...commonValues});
                    }}
                    error={errors.cornerA2B2}
                />

                <FormEdgeEditor
                    disabled={disabled || values.cornerA2B2 === undefined}
                    label={`Hrana ${getEnumValue(ProductCornerPosition.A2_B2, appState?.productCornerPositions ?? [])}`}
                    name="edgeA2B2"
                    allEdgesEnabled={values.allEdgesEnabled}
                    edges={board?.edges ?? []}
                    edgeId={values.edgeA2B2}
                    setEdgeId={async (value) => {
                        const commonValues = await onFormOrderCommonChange({...values}, {
                            ...values,
                            edgeA2B2: value
                        });
                        setValues({...values, ...commonValues});
                    }}
                    error={errors.edgeA2B2}
                    getEdge={getEdge}
                />
            </div>
        </>
    )
}

export default OrderCommonForm;