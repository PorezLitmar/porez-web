import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './app'
import ErrorProvider from './state/error';
import DialogProvider from './state/dialog';
import AppProvider from './state/app';
import AuthProvider from './state/auth';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorProvider>
            <DialogProvider>
                <AppProvider>
                    <AuthProvider>
                        <App/>
                    </AuthProvider>
                </AppProvider>
            </DialogProvider>
        </ErrorProvider>
    </StrictMode>,
)
