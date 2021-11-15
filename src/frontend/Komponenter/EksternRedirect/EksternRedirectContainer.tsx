import React, { FC, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IFagsak } from './typer/fagsak';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { Behandling } from '../../App/typer/fagsak';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';

export interface IFagsakParams {
    eksternFagsakId: string;
    behandlingIdEllerSaksoversikt: string; // Her vil vi enten få inn variabelen eksternBehandlingId, eller strengen: saksoversikt.
}

const EksternRedirectContainer: FC = () => {
    const { eksternFagsakId, behandlingIdEllerSaksoversikt } = useParams<IFagsakParams>();
    const [fagsak, settFagsak] = useState<Ressurs<IFagsak>>(byggTomRessurs());
    const [behandling, settBehandling] = useState<Ressurs<Behandling>>(byggTomRessurs());
    const { axiosRequest } = useApp();
    const skalHenteFagsak = behandlingIdEllerSaksoversikt === 'saksoversikt';
    const history = useHistory();

    const hentFagsak = () => {
        axiosRequest<IFagsak, null>({
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
            history.push(`/fagsak/${fagsak.data.id}`);
        } else if (behandling.status === RessursStatus.SUKSESS) {
            history.push(`/behandling/${behandling.data.id}`);
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
