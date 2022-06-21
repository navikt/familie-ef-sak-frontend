import React, { useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';

const GamleBehandlinger = () => {
    const { axiosRequest } = useApp();
    const [gamleBehandlinger, settGamleBehandlinger] = useState([]);

    useEffect(() => {
        axiosRequest<string, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/behandling/gamlebehandlinger`,
        }).then((res: any) => settGamleBehandlinger(res));
    }, []);
    return <div>GamleBehandlinger</div>;
};

export default GamleBehandlinger;
