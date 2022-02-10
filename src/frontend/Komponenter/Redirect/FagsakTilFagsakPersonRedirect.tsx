import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { Fagsak } from '../../App/typer/fagsak';

type IFagsakParams = {
    fagsakId: string;
};

const EksternRedirectContainer: FC = () => {
    const { fagsakId } = useParams<IFagsakParams>();
    const [fagsak, settFagsak] = useState<Ressurs<Fagsak>>(byggTomRessurs());
    const { axiosRequest } = useApp();
    const navigate = useNavigate();

    const hentFagsak = () => {
        axiosRequest<Fagsak, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/fagsak/${fagsakId}`,
        }).then(settFagsak);
    };

    useEffect(() => {
        hentFagsak();
        // eslint-disable-next-line
    }, [axiosRequest]);

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            navigate(`/person/${fagsak.data.fagsakPersonId}`);
        }
        // eslint-disable-next-line
    }, [fagsak]);

    return (
        <DataViewer response={{ fagsak }}>
            <div>Du blir videresendt</div>
        </DataViewer>
    );
};

export default EksternRedirectContainer;
