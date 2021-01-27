import * as React from 'react';
import { useMemo, useState } from 'react';
import { useDataHenter } from '../../hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import Dokumentoversikt from './Dokumentoversikt';
import { Ressurs } from '../../typer/ressurs';
import Valgvisning from './Valgvisning';
import styled from 'styled-components';
import { DokumentProps } from '@navikt/familie-dokumentliste';
import BehandlingHistorikk from './BehandlingHistorikk';
import Totrinnskontroll from '../Behandling/Totrinnskontroll/Totrinnskontroll';

const StyledHøyremeny = styled.div`
    width: 300px;
`;

export enum Høyremenyvalg {
    Mappe = 'Mappe',
    Dialog = 'Dialog',
    Logg = 'Logg',
}

interface HøyremenyProps {
    behandlingId: string;
}

const Høyremeny: React.FC<HøyremenyProps> = ({ behandlingId }) => {
    const [aktivtValg, settAktivtvalg] = useState<Høyremenyvalg>(Høyremenyvalg.Mappe);
    const dokumentConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/vedlegg/${behandlingId}`,
        }),
        [behandlingId]
    );

    const dokumentResponse: Ressurs<DokumentProps[]> = useDataHenter<DokumentProps[], null>(
        dokumentConfig
    );
    return (
        <>
            <Totrinnskontroll />
            <StyledHøyremeny>
                <Valgvisning aktiv={aktivtValg} settAktiv={settAktivtvalg} />
                {aktivtValg === Høyremenyvalg.Mappe && (
                    <Dokumentoversikt dokumentResponse={dokumentResponse} />
                )}
                {aktivtValg === Høyremenyvalg.Logg && (
                    <BehandlingHistorikk behandlingId={behandlingId} />
                )}
                {aktivtValg === Høyremenyvalg.Dialog && <div>Her kommer dialog</div>}
            </StyledHøyremeny>
        </>
    );
};

export default Høyremeny;
