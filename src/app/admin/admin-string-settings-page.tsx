import {NavLink} from 'react-router-dom';
import {useState} from 'react';
import StringEntriesEditor from '../../component/string-entries-editor';
import type {
    OrderPackageTypeEntry,
    OrderStatusEntry,
    ProductCornerPositionEntry,
    ProductCornerTypeEntry,
    ProductDecorOrientationEntry,
    ProductDimensionEntry,
    ProductEdgePositionEntry,
    ProductPositionEntry,
    ProductTypeEntry,
    UnitEntry
} from '../../api/model/porez';
import * as apiConfig from '../../api/client/config';

const ADMIN_STRING_SETTINGS_DIALOG_ID = 'admin-string-settings-dialog-001';

const AdminStringSettingsPage = () => {

    const [contentIndex, setContentIndex] = useState(0);

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Správca</li>
                    <li><NavLink to="/admin/string-settings">Textové parametre</NavLink></li>
                </ul>
            </div>

            <select
                defaultValue="0"
                className="select select-neutral"
                onChange={event => setContentIndex(Number(event.currentTarget.value))}
            >
                <option value="0">Typ balenia objednávky</option>
                <option value="1">Stav objednávky</option>
                <option value="2">Pozície rohov</option>
                <option value="3">Typy rohov</option>
                <option value="4">Orientácia dekoru</option>
                <option value="5">Rozmery dielca</option>
                <option value="6">Pozície hrán</option>
                <option value="7">Pozície v dielci</option>
                <option value="8">Typ dielca</option>
                <option value="9">Merné jednotky</option>
            </select>

            {contentIndex === 0 && <StringEntriesEditor<OrderPackageTypeEntry>
                dialogId={ADMIN_STRING_SETTINGS_DIALOG_ID}
                getEntries={apiConfig.getOrderPackageTypes}
                setEntry={apiConfig.setOrderPackageType}
            />}

            {contentIndex === 1 && <StringEntriesEditor<OrderStatusEntry>
                dialogId={ADMIN_STRING_SETTINGS_DIALOG_ID}
                getEntries={apiConfig.getOrderStatuses}
                setEntry={apiConfig.setOrderStatus}
            />}

            {contentIndex === 2 && <StringEntriesEditor<ProductCornerPositionEntry>
                dialogId={ADMIN_STRING_SETTINGS_DIALOG_ID}
                getEntries={apiConfig.getProductCornerPositions}
                setEntry={apiConfig.setProductCornerPosition}
            />}

            {contentIndex === 3 && <StringEntriesEditor<ProductCornerTypeEntry>
                dialogId={ADMIN_STRING_SETTINGS_DIALOG_ID}
                getEntries={apiConfig.getProductCornerTypes}
                setEntry={apiConfig.setProductCornerType}
            />}

            {contentIndex === 4 && <StringEntriesEditor<ProductDecorOrientationEntry>
                dialogId={ADMIN_STRING_SETTINGS_DIALOG_ID}
                getEntries={apiConfig.getProductDecorOrientations}
                setEntry={apiConfig.setProductDecorOrientation}
            />}

            {contentIndex === 5 && <StringEntriesEditor<ProductDimensionEntry>
                dialogId={ADMIN_STRING_SETTINGS_DIALOG_ID}
                getEntries={apiConfig.getProductDimensions}
                setEntry={apiConfig.setProductDimension}
            />}

            {contentIndex === 6 && <StringEntriesEditor<ProductEdgePositionEntry>
                dialogId={ADMIN_STRING_SETTINGS_DIALOG_ID}
                getEntries={apiConfig.getProductEdgePositions}
                setEntry={apiConfig.setProductEdgePosition}
            />}

            {contentIndex === 7 && <StringEntriesEditor<ProductPositionEntry>
                dialogId={ADMIN_STRING_SETTINGS_DIALOG_ID}
                getEntries={apiConfig.getProductPositions}
                setEntry={apiConfig.setProductPosition}
            />}

            {contentIndex === 8 && <StringEntriesEditor<ProductTypeEntry>
                dialogId={ADMIN_STRING_SETTINGS_DIALOG_ID}
                getEntries={apiConfig.getProductTypes}
                setEntry={apiConfig.setProductType}
            />}

            {contentIndex === 9 && <StringEntriesEditor<UnitEntry>
                dialogId={ADMIN_STRING_SETTINGS_DIALOG_ID}
                getEntries={apiConfig.getUnits}
                setEntry={apiConfig.setUnit}
            />}
        </>
    );
};

export default AdminStringSettingsPage;
