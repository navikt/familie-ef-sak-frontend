import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { Behandling, Fagsak } from '../../App/typer/fagsak';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';

type IFagsakParams = {
    eksternFagsakId: string;
    behandlingIdEllerSaksoversikt: string; // Her vil vi enten få inn variabelen eksternBehandlingId, eller strengen: saksoversikt.
};

const EksternRedirectContainer: FC = () => {
    const { eksternFagsakId, behandlingIdEllerSaksoversikt } = useParams<IFagsakParams>();
    const [fagsak, settFagsak] = useState<Ressurs<Fagsak>>(byggTomRessurs());
    const [behandling, settBehandling] = useState<Ressurs<Behandling>>(byggTomRessurs());
    const { axiosRequest } = useApp();
    const skalHenteFagsak = behandlingIdEllerSaksoversikt === 'saksoversikt';
    const navigate = useNavigate();

    const hentFagsak = () => {
        axiosRequest<Fagsak, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/fagsak/ekstern/${eksternFagsakId}`,
        }).then(settFagsak);
    };

    const hentBehandling = () => {
        axiosRequest<Behandling, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/behandling/ekstern/${behandlingIdEllerSaksoversikt}`,
        }).then(settBehandling);
    };

    useEffect(() => {
        skalHenteFagsak ? hentFagsak() : hentBehandling();
        // eslint-disable-next-line
    }, [axiosRequest]);

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            navigate(`/fagsak/${fagsak.data.id}`);
        } else if (behandling.status === RessursStatus.SUKSESS) {
            navigate(`/behandling/${behandling.data.id}`);
        }
        // eslint-disable-next-line
    }, [fagsak, behandling]);

    return (
        <DataViewer response={{ fagsak, behandling }}>
            <div>Du blir videresendt</div>
        </DataViewer>
    );
};

export default EksternRedirectContainer;
