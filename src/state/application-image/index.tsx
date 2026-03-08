import {ApplicationImageContext, AuthContext, ErrorContext} from '../';
import {type ReactNode, useContext, useEffect, useState} from 'react';
import type {ApplicationImageInfo} from '../../api/model/porez';
import * as apiApplicationImage from '../../api/client/application-image';

const ApplicationImageProvider = ({children}: { children: ReactNode }) => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [busy, setBusy] = useState(false);
    const [previous, setPrevious] = useState(false);
    const [next, setNext] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [data, setData] = useState<ApplicationImageInfo[]>();

    useEffect(() => {
        if (authState?.accessToken) {
            getApplicationInfoImages().then();
        }
    }, [page]);

    const createData = (): ApplicationImageInfo[] => {
        if (data) {
            return [...data];
        }
        return [];
    }

    const getApplicationInfoImages = async () => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await apiApplicationImage.getApplicationImages({
                    page,
                    size: 10,
                    sort: {field: 'fileName', asc: true}
                }, authState?.accessToken);
                setTotalPages(response.data?.totalPages ?? 0);
                setPrevious(!(response.data?.first ?? true));
                setNext(!(response.data?.last ?? true));
                setData(response.data?.content);
                errorState?.addError(response.error);
            }
        } finally {
            setBusy(false);
        }
    }

    const addApplicationImage = async (file: File) => {
        setBusy(true);
        try {
            const response = await apiApplicationImage.addApplicationImage(file, authState?.accessToken);
            if (response.data) {
                const newData = [response.data, ...createData()];
                setData(newData);
            }
            errorState?.addError(response.error);
        } finally {
            setBusy(false);
        }
    }

    const setApplicationImage = async (id: string, file: File) => {
        setBusy(true);
        try {
            const response = await apiApplicationImage.setApplicationImage(id, file, authState?.accessToken);
            if (response.data) {
                const newData = createData();
                const index = newData.findIndex(item => item.id === id);
                if (index !== -1) {
                    newData[index] = response.data;
                }
                setData(newData);
            }
            errorState?.addError(response.error);
        } finally {
            setBusy(false);
        }
    }

    const deleteApplicationImage = async (id: string) => {
        setBusy(true);
        try {
            const response = await apiApplicationImage.deleteApplicationImage(id, authState?.accessToken);
            if (!response.error) {
                const newData = createData();
                const index = newData.findIndex(item => item.id === id);
                if (index !== -1) {
                    newData.splice(index, 1);
                }
                setData(newData);
            }
            errorState?.addError(response.error);
        } finally {
            setBusy(false);
        }
    }

    return (
        <ApplicationImageContext.Provider
            value={
                {
                    busy,
                    previous,
                    next,
                    page,
                    totalPages,
                    setPage,
                    data,
                    getApplicationInfoImages,
                    addApplicationImage,
                    setApplicationImage,
                    deleteApplicationImage
                }
            }
        >{children}
        </ApplicationImageContext.Provider>
    )
}

export default ApplicationImageProvider;
