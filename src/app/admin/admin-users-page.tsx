import {NavLink} from 'react-router-dom';
import UserProvider from '../../state/user';
import {type ChangeEvent, useContext, useEffect, useState} from 'react';
import {DialogContext, UserContext} from '../../state';
import {Authority, type User} from '../../api/model/porez';
import PageContent from '../../component/layout/page-content';
import Pageable from '../../component/pageable';
import type {UserSearchCriteria} from '../../api/client/user';
import Table from '../../component/table';
import {containsAuthority} from '../../api/model';
import {DialogAnswer, DialogType} from '../../state/dialog/model';
import {createPortal} from 'react-dom';
import BaseDialog from '../../component/dialog/base-dialog';
import FormCheckBox from '../../component/form/form-check-box';

const ADMIN_USERS_DIALOG_ID = 'admin-users-dialog-001';

const AdminUsersPage = () => {

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li>Správca</li>
                    <li><NavLink to="/admin/users">Používatelia</NavLink></li>
                </ul>
            </div>
            <UserProvider>
                <AdminUsersPageContent/>
            </UserProvider>
        </>
    );
};

export default AdminUsersPage;

const AdminUsersPageContent = () => {
    const dialogState = useContext(DialogContext);
    const userState = useContext(UserContext);

    const [selected, setSelected] = useState<User>();
    const [showAuthoritiesDialog, setShowAuthoritiesDialog] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadUsers = async () => {
            if (!userState || !isMounted) {
                return;
            }

            await userState.getUsers();
        };

        void loadUsers();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <PageContent
                toolBar={
                    <AdminUserSearchCriteriaForm searchHandler={(criteria) => userState?.setCriteria(criteria)}/>
                }
                pageNav={
                    <Pageable
                        isPrevious={userState?.previous ?? false}
                        previousHandler={() => userState?.setPage(userState?.page - 1)}
                        page={(userState?.page ?? 0) + 1}
                        totalPages={userState?.totalPages ?? 0}
                        isNext={userState?.next ?? false}
                        nextHandler={() => userState?.setPage(userState?.page + 1)}
                        disabled={userState?.busy}
                    />
                }
            >
                <Table
                    fields={['rn', 'email', 'profile', 'authorities', 'confirmed', 'enabled', 'actions']}
                    tableHeaderColumn={(field) => {
                        switch (field) {
                            case 'rn':
                                return (<th key={field}></th>);
                            case 'email':
                                return (<th key={field}>Email</th>);
                            case 'profile':
                                return (<th key={field}>Profil</th>);
                            case 'authorities':
                                return (<th key={field}>Povolenia</th>);
                            case 'confirmed':
                                return (<th key={field}>Potvrdený</th>);
                            case 'enabled':
                                return (<th key={field}>Povolený</th>);
                            case 'actions':
                                return (<th key={field}></th>);
                        }
                    }}
                    rows={userState?.data}
                    tableRowKey={(row) => `${row.id}`}
                    tableRowColumn={
                        (field, row, rowIndex) => {
                            switch (field) {
                                case 'rn':
                                    return (<th key={field}>{`${rowIndex + 1}`}</th>);
                                case 'email':
                                    return (<td key={field}>{row.email}</td>);
                                case 'profile':
                                    return (
                                        <td key={field}>
                                            <div className="flex flex-row gap-2">
                                                {row.title && <span>{row.title}</span>}
                                                <span>{row.firstName}</span>
                                                <span>{row.lastName}</span>
                                            </div>
                                        </td>
                                    );
                                case 'authorities':
                                    return (
                                        <td key={field}>
                                            <div className="flex flex-row w-full items-center gap-2">
                                                <button
                                                    className="btn btn-secondary btn-xs"
                                                    type="button"
                                                    disabled={userState?.busy || !userState?.isEditEnabled(row)}
                                                    onClick={() => {
                                                        setSelected(row);
                                                        setShowAuthoritiesDialog(true);
                                                    }}
                                                ><span className="icon-[lucide--edit] text-base"></span></button>
                                                <div className="flex flex-row gap-5">
                                                    {containsAuthority(row.authorities ?? [], Authority.P_ADMIN) &&
                                                        <span
                                                            className="icon-[eos-icons--admin-outlined] text-base"></span>
                                                    }
                                                    {containsAuthority(row.authorities ?? [], Authority.P_MANAGER) &&
                                                        <span className="icon-[lucide--user-star] text-base"></span>
                                                    }
                                                    {containsAuthority(row.authorities ?? [], Authority.P_EMPLOYEE) &&
                                                        <span className="icon-[lucide--user-cog] text-base"></span>
                                                    }
                                                    {containsAuthority(row.authorities ?? [], Authority.P_CUSTOMER) &&
                                                        <span
                                                            className="icon-[lucide--shopping-basket] text-base"></span>
                                                    }
                                                </div>
                                            </div>
                                        </td>
                                    );
                                case 'confirmed':
                                    return (
                                        <td key={field}>
                                            <div className="flex flex-row w-full items-center gap-2">
                                                <button
                                                    className="btn btn-secondary btn-xs"
                                                    type="button"
                                                    disabled={userState?.busy || !userState?.isEditEnabled(row)}
                                                    onClick={() => {
                                                        dialogState?.showDialog({
                                                            type: DialogType.YES_NO,
                                                            title: row.confirmed ? 'Zrušiť potvrdenie' : 'Potvrdiť',
                                                            message: row.confirmed ?
                                                                `Naozaj si želáte zrušiť potvrdenie používateľa? [${row.email}]` :
                                                                `Naozaj si želáte potvrdiť používateľa? [${row.email}]`,
                                                            callback: (answer: DialogAnswer) => {
                                                                if (answer === DialogAnswer.YES) {
                                                                    userState?.confirmUser(row.id ?? '').then();
                                                                }
                                                            }
                                                        });
                                                    }}
                                                ><span className="icon-[lucide--edit] text-base"></span></button>
                                                {row.confirmed ?
                                                    <span className="icon-[lucide--package-check] text-base"></span>
                                                    :
                                                    <span
                                                        className="icon-[lucide--package-x] text-base bg-warning"></span>
                                                }
                                            </div>
                                        </td>
                                    );
                                case 'enabled':
                                    return (
                                        <td key={field}>
                                            <div className="flex flex-row w-full items-center gap-2">
                                                <button
                                                    className="btn btn-secondary btn-xs"
                                                    type="button"
                                                    disabled={userState?.busy || !userState?.isEditEnabled(row)}
                                                    onClick={() => {
                                                        dialogState?.showDialog({
                                                            type: DialogType.YES_NO,
                                                            title: row.enabled ? 'Zakázať používateľa' : 'Povoliť používateľa',
                                                            message: row.enabled ?
                                                                `Naozaj si želáte zakázať používateľa? [${row.email}]` :
                                                                `Naozaj si želáte povoliť používateľa? [${row.email}]`,
                                                            callback: (answer: DialogAnswer) => {
                                                                if (answer === DialogAnswer.YES) {
                                                                    userState?.setEnabled(row.id ?? '', !row.enabled).then();
                                                                }
                                                            }
                                                        });
                                                    }}
                                                ><span className="icon-[lucide--edit] text-base"></span></button>
                                                {row.enabled ?
                                                    <span className="icon-[lucide--lock-open] text-base"></span>
                                                    :
                                                    <span className="icon-[lucide--lock] text-base bg-warning"></span>
                                                }
                                            </div>
                                        </td>
                                    );
                                case 'actions':
                                    return (
                                        <td key={field}>
                                            <button
                                                className="btn btn-accent btn-xs"
                                                type="button"
                                                disabled={userState?.busy || !userState?.isEditEnabled(row)}
                                                onClick={() => {
                                                    dialogState?.showDialog({
                                                        type: DialogType.YES_NO,
                                                        title: 'Zmazať používateľa',
                                                        message: `Naozaj si želáte zmazať používateľa? [${row.email}]`,
                                                        callback: (answer: DialogAnswer) => {
                                                            if (answer === DialogAnswer.YES) {
                                                                userState?.deleteUser(row.id ?? '').then();
                                                            }
                                                        }
                                                    });
                                                }}
                                            ><span className="icon-[lucide--trash] text-base"></span></button>
                                        </td>
                                    )
                            }
                        }
                    }
                />
            </PageContent>

            {showAuthoritiesDialog && <AdminUserAuthoritiesDialog
                dialogId={ADMIN_USERS_DIALOG_ID}
                showDialog={showAuthoritiesDialog}
                email={selected?.email ?? ''}
                authorities={selected?.authorities ?? []}
                cancelHandler={() => setShowAuthoritiesDialog(false)}
                okHandler={(authorities) => {
                    if (selected && selected.id) {
                        void userState?.setAuthorities(selected.id, authorities);
                    }
                    setShowAuthoritiesDialog(false);
                    setSelected(undefined);
                }}/>
            }
        </>
    )
}

const AdminUserSearchCriteriaForm = ({searchHandler}: {
    searchHandler: (criteria: UserSearchCriteria) => void
}) => {
    const [searchField, setSearchField] = useState<string>();

    return (
        <div className="join join-horizontal w-full">
            <input
                type="text"
                className="join-item input input-bordered w-full"
                placeholder="Email, meno, stredné meno alebo priezvisko"
                value={searchField}
                onChange={event => setSearchField(event.target.value)}
                onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                        searchHandler({searchField});
                    }
                }}
            />
            <button
                className="join-item btn"
                onClick={() => searchHandler({searchField})}
            ><span className="icon-[lucide--search] text-base"></span></button>
        </div>
    )
}


type FormValues = {
    customer: boolean;
    employee: boolean;
    manager: boolean;
    admin: boolean;
};

const AdminUserAuthoritiesDialog = ({dialogId, showDialog, email, authorities, okHandler, cancelHandler}: {
    dialogId: string,
    showDialog: boolean,
    email: string,
    authorities: Authority[],
    okHandler: (authorities: Authority[]) => void,
    cancelHandler: () => void
}) => {
    const dialogState = useContext(DialogContext);

    const [values, setValues] = useState<FormValues>({
        customer: containsAuthority(authorities, Authority.P_CUSTOMER),
        employee: containsAuthority(authorities, Authority.P_EMPLOYEE),
        manager: containsAuthority(authorities, Authority.P_MANAGER),
        admin: containsAuthority(authorities, Authority.P_ADMIN)
    });

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, type, value, checked} = e.target;
        const nextValue = type === 'checkbox' ? checked : value;

        setValues(prev => ({
            ...prev,
            [name as keyof FormValues]: nextValue as FormValues[keyof FormValues],
        }));
    }

    const onSubmit = async () => {
        const authorities = [];
        if (values.customer) {
            authorities.push(Authority.P_CUSTOMER);
        }
        if (values.employee) {
            authorities.push(Authority.P_EMPLOYEE);
        }
        if (values.manager) {
            authorities.push(Authority.P_MANAGER);
        }
        if (values.admin) {
            authorities.push(Authority.P_ADMIN);
        }

        okHandler(authorities as Authority[]);
    }

    return (!dialogState?.modalRoot ? null : createPortal(
        <BaseDialog id={dialogId} showDialog={showDialog} closeHandler={cancelHandler}>
            <div className="container">
                <div className="flex flex-col justify-center w-full">
                    <div className="font-bold text-center text-xl">Povolenia používateľa</div>
                    <div className="font-bold text-center text-sm">[{email}]</div>
                </div>

                <div className="flex flex-col justify-center items-center w-full max-w-md">
                    <FormCheckBox
                        name="customer"
                        value={values.customer}
                        onChange={onChange}
                    >
                        <div className="flex flex-row items-center justify-center gap-1">
                            <span className="icon-[lucide--shopping-basket] text-base"></span>
                            <span>Zákazník</span>
                        </div>
                    </FormCheckBox>

                    <FormCheckBox
                        name="employee"
                        value={values.employee}
                        onChange={onChange}
                    >
                        <div className="flex flex-row items-center justify-center gap-1">
                            <span className="icon-[lucide--user-cog] text-base"></span>
                            <span>Zamestnanec</span>
                        </div>
                    </FormCheckBox>

                    <FormCheckBox
                        name="manager"
                        value={values.manager}
                        onChange={onChange}
                    >
                        <div className="flex flex-row items-center justify-center gap-1">
                            <span className="icon-[lucide--user-star] text-base"></span>
                            <span>Manažér</span>
                        </div>
                    </FormCheckBox>

                    <FormCheckBox
                        name="admin"
                        value={values.admin}
                        onChange={onChange}
                    >
                        <div className="flex flex-row items-center justify-center gap-1">
                            <span className="icon-[eos-icons--admin-outlined] text-base"></span>
                            <span>Správca</span>
                        </div>
                    </FormCheckBox>

                    <div className="join">
                        <button
                            type="button"
                            className="btn btn-primary join-item"
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
