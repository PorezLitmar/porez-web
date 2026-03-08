import {useEffect, useState} from 'react';
import type {ClientResponse} from '../../api/client';
import type {StringValue} from '../../api/model/porez';
import MarkdownRenderer from '../markdown-renderer';

const MdPage = ({getData}: { getData: () => Promise<ClientResponse<StringValue>> }) => {

    const [data, setData] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (!isMounted) {
                return;
            }

            const response = await getData();
            setData(response.data?.value ?? '');
        };

        void loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="w-full flex flex-col grow min-h-0">
            <div className="w-full overflow-auto grow min-h-0">
                <MarkdownRenderer className="prose w-full p-2 xl-p5 text-sm" md={data}/>
            </div>
        </div>
    )
}

export default MdPage;
