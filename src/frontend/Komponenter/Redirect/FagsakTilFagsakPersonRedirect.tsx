import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { byggFeiletRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { Fagsak } from '../../App/typer/fagsak';
import { isUUID } from '../../App/utils/utils';

type IFagsakParams = {
    fagsakId: string;
};

const EksternRedirectContainer: FC = () => {
    const fagsakId = useParams<IFagsakParams>().fagsakId as string;
    const [fagsak, settFagsak] = useState<Ressurs<Fagsak>>(byggTomRessurs());
    const { axiosRequest } = useApp();
    const navigate = useNavigate();

    const hentFagsak = () => {
        if (!isNaN(Number(fagsakId))) {
            axiosRequest<Fagsak, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/fagsak/ekstern/${fagsakId}`,
            }).then(settFagsak);
        } else if (!isUUID(fagsakId)) {
            settFagsak(byggFeiletRessurs(`"${fagsakId}" er ikke en gyldig verdi for fagsak`));
        } else {
            axiosRequest<Fagsak, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/fagsak/${fagsakId}`,
            }).then(settFagsak);
        }
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
