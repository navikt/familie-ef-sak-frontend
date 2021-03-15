import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import BlankettFooter from './BlankettFooter';
import PdfVisning from '../../Felleskomponenter/PdfVisning';
import styled from 'styled-components';
import { Knapp } from 'nav-frontend-knapper';
import { useBehandling } from '../../../context/BehandlingContext';
import { BehandlingStatus } from '../../../typer/behandlingstatus';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';

interface Props {
    behandlingId: string;
}

const GenererBlankett = styled(Knapp)`
    display: block;
    margin: 0 auto;
`;

const HentBlankett = styled(Knapp)`
    display: block;
    margin: 0 auto;
    margin-top: 2rem;
`;

const StyledBlankett = styled.div`
    background-color: #f2f2f2;
    padding: 3rem;
`;

const Blankett: React.FC<Props> = ({ behandlingId }) => {
    const { behandling } = useBehandling();
    const { axiosRequest } = useApp();
    const [blankettRessurs, settBlankettRessurs] = useState<Ressurs<string>>(byggTomRessurs());
    const data = { navn: 'test', ident: '123456789' };

    const genererBlankett = () => {
        axiosRequest<string, any>({
            method: 'POST',
            url: `/familie-ef-sak/api/blankett/${behandlingId}`,
            data: data,
        }).then((respons: Ressurs<string>) => {
            settBlankettRessurs(respons);
        });
    };

    const hentBlankett = () => {
        axiosRequest<string, any>({
            method: 'GET',
            url: `/familie-ef-sak/api/blankett/${behandlingId}`,
        }).then((respons: Ressurs<string>) => {
            settBlankettRessurs(respons);
        });
    };

    const erBehandlingÅpen = (status: BehandlingStatus): boolean => {
        if (
            status ===
            (BehandlingStatus.FATTER_VEDTAK ||
                BehandlingStatus.IVERKSETTER_VEDTAK ||
                BehandlingStatus.FERDIGSTILT)
        ) {
            return false;
        }
        return true;
    };

    return (
        <>
            <DataViewer response={{ behandling }}>
                <StyledBlankett>
                    {erBehandlingÅpen(behandling.data.status) && (
                        <GenererBlankett onClick={genererBlankett}>
                            Generer blankett
                        </GenererBlankett>
                    )}
                    <HentBlankett onClick={hentBlankett}>Hent blankett</HentBlankett>
                    <PdfVisning pdfFilInnhold={blankettRessurs}></PdfVisning>
                </StyledBlankett>
                {erBehandlingÅpen(behandling.data.status) && (
                    <BlankettFooter behandlingId={behandlingId} />
                )}
            </DataViewer>
        </>
    );
};

export default Blankett;
