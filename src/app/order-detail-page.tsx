import {NavLink, useParams} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import {AuthContext, ErrorContext} from '../state';
import {getHtml} from '../api/client/order';

const OrderDetailPage = () => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const {id} = useParams();

    const [detail, setDetail] = useState<string>();
    const [message, setMessage] = useState<string>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                // Validate id
                if (!id) {
                    if (mounted) setMessage("Chýba identifikátor objednávky.");
                    return;
                }
                const orderId = id.trim();
                if (!orderId) {
                    if (mounted) setMessage("Neplatné ID objednávky.");
                    return;
                }

                // Validate auth context
                if (!authState) {
                    if (mounted)
                        setMessage(
                            "Vyžaduje sa prihlásenie. Prihláste sa prosím a akciu zopakujte."
                        );
                    return;
                }

                const existingToken = authState.accessToken;
                let token = existingToken;

                if (!token) {
                    const refreshToken = authState.refreshToken;
                    if (!refreshToken) {
                        if (mounted)
                            setMessage(
                                "Vyžaduje sa prihlásenie. Prihláste sa prosím a akciu zopakujte."
                            );
                        return;
                    }

                    const refreshResponse = await authState.refresh({refreshToken});
                    if (refreshResponse?.error) {
                        errorState?.addError(refreshResponse.error);
                        if (mounted)
                            setMessage(
                                "Vyžaduje sa prihlásenie. Prihláste sa prosím a akciu zopakujte."
                            );
                        return;
                    }

                    token = refreshResponse?.data?.accessToken;
                }

                if (!token) {
                    if (mounted)
                        setMessage(
                            "Chyba autentifikácie. Prihláste sa prosím a skúste znova."
                        );
                    return;
                }

                // Fetch HTML
                const response = await getHtml(orderId, token);
                if (response?.data) {
                    if (mounted) setDetail(response.data.value);
                } else {
                    if (response?.error) errorState?.addError(response.error);
                    if (mounted) setMessage("Detail objednávky nenájdený.");
                }
            } catch {
                if (mounted) setMessage("Nepodarilo sa načítať detail objednávky.");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [id, authState, errorState]);

    return (
        <>
            <div className="breadcrumbs text-sm w-full">
                <ul>
                    <li><NavLink to="/">Domovská stránka</NavLink></li>
                    <li><NavLink to={`/orders/${id}/detail`}>Detail objednávky</NavLink></li>
                </ul>
            </div>

            {loading && (
                <div className="flex flex-row justify-center items-center w-full">
                    <span className="loading loading-xl loading-spinner text-primary"></span>
                </div>
            )}

            {!loading && detail && (
                <div className="w-full overflow-auto flex flex-col min-h-0 flex-1">
                    <iframe
                        className="w-full grow flex-1"
                        srcDoc={detail}
                    />
                </div>
            )}

            {!loading && !detail && message && (
                <span className="font-mono text-center text-base w-full">{message}</span>
            )}
        </>
    );
};

export default OrderDetailPage;
