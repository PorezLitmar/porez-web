import {ApplicationFileContext, AuthContext, ErrorContext} from '../';
import {type ReactNode, useContext, useEffect, useState} from 'react';
import type {ApplicationFileInfo, ApplicationImageInfo} from '../../api/model/porez';
import * as apiApplicationFile from '../../api/client/application-file';

const ApplicationFileProvider = ({children}: { children: ReactNode }) => {
    const authState = useContext(AuthContext);
    const errorState = useContext(ErrorContext);

    const [busy, setBusy] = useState(false);
    const [previous, setPrevious] = useState(false);
    const [next, setNext] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [data, setData] = useState<ApplicationFileInfo[]>();

    useEffect(() => {
        if (authState?.accessToken) {
            getApplicationInfoFiles().then();
        }
    }, [page]);

    const createData = (): ApplicationImageInfo[] => {
        if (data) {
            return [...data];
        }
        return [];
    }

    const getApplicationInfoFiles = async () => {
        setBusy(true);
        try {
            if (authState?.accessToken) {
                const response = await apiApplicationFile.getApplicationFiles({
                    page,
                    size: 10,
                    sort: {field: 'label', asc: true}
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

    const getApplicationFile = async (id: string) => {
        setBusy(true);
        try {
            const response = await apiApplicationFile.getApplicationFile(id, authState?.accessToken);
            if (response.data) {
                return response.data;
            }
            errorState?.addError(response.error);
        } finally {
            setBusy(false);
        }
    }

    const addApplicationFile = async (label: string, file: File) => {
        setBusy(true);
        try {
            const response = await apiApplicationFile.addApplicationFile(label, file, authState?.accessToken);
            if (response.data) {
                const newData = [response.data, ...createData()];
                setData(newData);
            }
            errorState?.addError(response.error);
        } finally {
            setBusy(false);
        }
    }

    const setApplicationFileLabel = async (id: string, label: string) => {
        setBusy(true);
        try {
            const response = await apiApplicationFile.setApplicationFileLabel(id, label, authState?.accessToken);
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

    const setApplicationFileData = async (id: string, file: File) => {
        setBusy(true);
        try {
            const response = await apiApplicationFile.setApplicationFileData(id, file, authState?.accessToken);
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

    const deleteApplicationFile = async (id: string) => {
        setBusy(true);
        try {
            const response = await apiApplicationFile.deleteApplicationFile(id, authState?.accessToken);
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
        <ApplicationFileContext.Provider
            value={
                {
                    busy,
                    previous,
                    next,
                    page,
                    totalPages,
                    setPage,
                    data,
                    getApplicationInfoFiles,
                    getApplicationFile,
                    addApplicationFile,
                    setApplicationFileLabel,
                    setApplicationFileData,
                    deleteApplicationFile
                }
            }
        >{children}
        </ApplicationFileContext.Provider>
    )
}

export default ApplicationFileProvider;
