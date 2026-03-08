import {Navigate, Route, Routes} from 'react-router-dom';
import HomePage from './home-page';
import MaintenancePage from './maintenance-page';
import NotFoundPage from './not-found-page';
import AuthPage from './auth/auth-page';
import AuthSignInPage from './auth/auth-sign-in-page';
import AuthSignUpPage from './auth/auth-sign-up-page';
import AuthResetPasswordPage from './auth/auth-reset-password-page';
import AuthChangeProfilePage from './auth/auth-change-profile-page';
import AuthChangePasswordPage from './auth/auth-change-password-page';
import AuthChangeEmailPage from './auth/auth-change-email-page';
import AuthConfirmPage from './auth/auth-confirm-page';
import ApplicationFilesPage from './application-files-page';
import ContactInfoPage from './contact-info-page';
import OrderInfoPage from './order-info-page';
import CookiesInfoPage from './cookies-info-page';
import GdprInfoPage from './gdpr-info-page';
import BusinessConditionsPage from './business-conditions-page';
import AdminPage from './admin/admin-page';
import CustomerPage from './customer/customer-page';
import EmployeePage from './employee/employee-page';
import ManagerPage from './manager/manager-page';
import AdminUsersPage from './admin/admin-users-page';
import AdminFreeDaysPage from './admin/admin-free-days-page';
import AdminApplicationFilesPage from './admin/admin-application-files-page';
import AdminApplicationImagesPage from './admin/admin-application-images-page';
import AdminApplicationSettingsPage from './admin/admin-application-settings-page';
import AdminCompanyInfoPage from './admin/admin-company-info-page';
import AdminMailFormatsPage from './admin/admin-mail-formats-page';
import AdminTextInfoPage from './admin/admin-text-info-page';
import AdminCsvSettingsPage from './admin/admin-csv-settings-page';
import AdminHtmlSettingsPage from './admin/admin-html-settings-page';
import AdminNumericSettingsPage from './admin/admin-numeric-settings-page';
import AdminStringSettingsPage from './admin/admin-string-settings-page';
import CustomerOrdersPage from './customer/customer-orders-page';
import CustomerOrderPage from './customer/customer-order-page';
import EmployeeOrdersPage from './employee/employee-orders-page';
import CustomerOrderEditPage from './customer/customer-order-edit-page';
import CustomerOrderItemEditPage from './customer/customer-order-item-edit-page';
import CustomerOrderDetailPage from './customer/customer-order-detail-page';
import ManagerOrdersPage from './manager/manager-orders-page';
import ManagerOrderEditPage from './manager/manager-order-edit-page';
import ManagerOrderItemEditPage from './manager/manager-order-item-edit-page';
import ManagerOrderDetailPage from './manager/manager-order-detail-page';
import ManagerBoardsPage from './manager/manager-boards-page';
import ManagerBoardCategoriesPage from './manager/manager-board-categories-page';
import ManagerBoardEdgesPage from './manager/manager-board-edges-page';
import ManagerBoardImagePage from './manager/manager-board-image-page';
import ManagerEdgesPage from './manager/manager-edges-page';
import ManagerEdgeCategoriesPage from './manager/manager-edge-categories-page';
import ManagerCategoriesPage from './manager/manager-categories-page';
import ManagerCategoryItemsPage from './manager/manager-category-items-page';
import ManagerPriceListsPage from './manager/manager-price-lists-page';
import OrderDetailPage from './order-detail-page';
import CustomerOrderSubmitPage from './customer/customer-order-submit-page';

const AppPage = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>

            <Route path="/admin" element={<AdminPage/>}>
                <Route path="users" element={<AdminUsersPage/>}/>
                <Route path="free-days" element={<AdminFreeDaysPage/>}/>
                <Route path="application-files" element={<AdminApplicationFilesPage/>}/>
                <Route path="application-images" element={<AdminApplicationImagesPage/>}/>
                <Route path="application-settings" element={<AdminApplicationSettingsPage/>}/>
                <Route path="company-info" element={<AdminCompanyInfoPage/>}/>
                <Route path="mail-formats" element={<AdminMailFormatsPage/>}/>
                <Route path="text-info" element={<AdminTextInfoPage/>}/>
                <Route path="csv-settings" element={<AdminCsvSettingsPage/>}/>
                <Route path="html-settings" element={<AdminHtmlSettingsPage/>}/>
                <Route path="numeric-settings" element={<AdminNumericSettingsPage/>}/>
                <Route path="string-settings" element={<AdminStringSettingsPage/>}/>
            </Route>

            <Route path="/auth" element={<AuthPage/>}>
                <Route path="change-profile" element={<AuthChangeProfilePage/>}/>
                <Route path="change-password" element={<AuthChangePasswordPage/>}/>
                <Route path="change-email" element={<AuthChangeEmailPage/>}/>
                <Route path="reset-password" element={<AuthResetPasswordPage/>}/>
                <Route path="sign-in" element={<AuthSignInPage/>}/>
                <Route path="sign-up" element={<AuthSignUpPage/>}/>
                <Route path="confirm/:token" element={<AuthConfirmPage/>}/>
            </Route>

            <Route path="/customer" element={<CustomerPage/>}>
                <Route path="order" element={<CustomerOrderPage/>}/>
                <Route path="orders" element={<CustomerPage/>}>
                    <Route index element={<Navigate to="index" replace/>}/>
                    <Route path="index" element={<CustomerOrdersPage/>}/>
                    <Route path=":id/edit" element={<CustomerOrderEditPage/>}/>
                    <Route path=":id/edit-item" element={<CustomerOrderItemEditPage/>}/>
                    <Route path=":id/edit-item/:itemId" element={<CustomerOrderItemEditPage/>}/>
                    <Route path=":id/detail" element={<CustomerOrderDetailPage/>}/>
                    <Route path=":id/submit" element={<CustomerOrderSubmitPage/>}/>
                </Route>
            </Route>

            <Route path="/employee" element={<EmployeePage/>}>
                <Route path="orders" element={<EmployeeOrdersPage/>}/>
            </Route>

            <Route path="/manager" element={<ManagerPage/>}>
                <Route path="orders" element={<ManagerPage/>}>
                    <Route index element={<Navigate to="index" replace/>}/>
                    <Route path="index" element={<ManagerOrdersPage/>}/>
                    <Route path=":id/edit" element={<ManagerOrderEditPage/>}/>
                    <Route path=":id/edit-item" element={<ManagerOrderItemEditPage/>}/>
                    <Route path=":id/edit-item/:itemId" element={<ManagerOrderItemEditPage/>}/>
                    <Route path=":id/detail" element={<ManagerOrderDetailPage/>}/>
                </Route>
                <Route path="boards" element={<ManagerPage/>}>
                    <Route index element={<Navigate to="index" replace/>}/>
                    <Route path="index" element={<ManagerBoardsPage/>}/>
                    <Route path=":id/categories" element={<ManagerBoardCategoriesPage/>}/>
                    <Route path=":id/edges" element={<ManagerBoardEdgesPage/>}/>
                    <Route path=":id/image" element={<ManagerBoardImagePage/>}/>
                </Route>
                <Route path="edges" element={<ManagerPage/>}>
                    <Route index element={<Navigate to="index" replace/>}/>
                    <Route path="index" element={<ManagerEdgesPage/>}/>
                    <Route path=":id/categories" element={<ManagerEdgeCategoriesPage/>}/>
                </Route>
                <Route path="categories" element={<ManagerPage/>}>
                    <Route index element={<Navigate to="index" replace/>}/>
                    <Route path="index" element={<ManagerCategoriesPage/>}/>
                    <Route path=":id/items" element={<ManagerCategoryItemsPage/>}/>
                </Route>
                <Route path="price-lists" element={<ManagerPriceListsPage/>}/>
            </Route>

            <Route path="/contact-info" element={<ContactInfoPage/>}/>
            <Route path="/order-info" element={<OrderInfoPage/>}/>
            <Route path="/application-files" element={<ApplicationFilesPage/>}/>
            <Route path="/cookies-info" element={<CookiesInfoPage/>}/>
            <Route path="/gdpr-info" element={<GdprInfoPage/>}/>
            <Route path="/business-conditions" element={<BusinessConditionsPage/>}/>
            <Route path="/orders/:id/detail" element={<OrderDetailPage/>}/>
            <Route path="/maintenance" element={<MaintenancePage/>}/>
            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    )
}

export default AppPage;
