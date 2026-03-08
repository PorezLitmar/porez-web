import {NavLink} from 'react-router-dom';
import StringEntriesEditor from '../../component/string-entries-editor';
import type {HtmlPatternEntry, HtmlTextEntry} from '../../api/model/porez';
import * as apiConfig from '../../api/client/config';
import {useState} from 'react';

const ADMIN_HTML_SETTINGS_DIALOG_ID = 'admin-html-settings-dialog-001';

const AdminHtmlSettingsPage = () => {

    const [contentIndex, setContentIndex] = useState(0);

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Správca</li>
                    <li><NavLink to="/admin/html-settings">HTML parametre</NavLink></li>
                </ul>
            </div>

            <select
                defaultValue="0"
                className="select select-neutral"
                onChange={event => setContentIndex(Number(event.currentTarget.value))}
            >
                <option value="0">HTML texty</option>
                <option value="1">HTML formáty</option>
            </select>

            {contentIndex === 0 && <StringEntriesEditor<HtmlTextEntry>
                dialogId={ADMIN_HTML_SETTINGS_DIALOG_ID}
                getEntries={apiConfig.getHtmlTexts}
                setEntry={apiConfig.setHtmlText}
            />}

            {contentIndex === 1 && <StringEntriesEditor<HtmlPatternEntry>
                dialogId={ADMIN_HTML_SETTINGS_DIALOG_ID}
                getEntries={apiConfig.getHtmlPatterns}
                setEntry={apiConfig.setHtmlPattern}
            />}
        </>
    );
};

export default AdminHtmlSettingsPage;
