import * as React from 'react';
import { useMemo, useState } from 'react';
import { useDataHenter } from '../../hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import Vedleggoversikt from './Vedleggoversikt';
import { VedleggDto } from '../../typer/felles';
import { Ressurs } from '../../typer/ressurs';
import Valgvisning from './Valgvisning';
import styled from 'styled-components';

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
    const vedleggConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/vedlegg/${behandlingId}`,
        }),
        [behandlingId]
    );

    const vedleggResponse: Ressurs<VedleggDto[]> = useDataHenter<VedleggDto[], null>(vedleggConfig);
    return (
        <StyledHøyremeny>
            <Valgvisning aktiv={aktivtValg} settAktiv={settAktivtvalg} />
            {aktivtValg === Høyremenyvalg.Mappe && (
                <Vedleggoversikt vedleggResponse={vedleggResponse} />
            )}
            {aktivtValg === Høyremenyvalg.Logg && <div>Her kommer logg</div>}
            {aktivtValg === Høyremenyvalg.Dialog && <div>Her kommer dialog</div>}
        </StyledHøyremeny>
    );
};

export default Høyremeny;
