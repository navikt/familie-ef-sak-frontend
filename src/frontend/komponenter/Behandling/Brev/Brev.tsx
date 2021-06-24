import React, { useEffect, useState } from 'react';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';
import PdfVisning from '../../Felleskomponenter/PdfVisning';
import styled from 'styled-components';
import SendTilBeslutterFooter from '../Totrinnskontroll/SendTilBeslutterFooter';
import { useBehandling } from '../../../context/BehandlingContext';
import Brevmeny from './Brevmeny';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { useApp } from '../../../context/AppContext';
import { TotrinnskontrollStatus } from '../../../typer/totrinnskontroll';
import { Steg } from '../../Høyremeny/Steg';
const StyledBrev = styled.div`
    background-color: #f2f2f2;
    padding: 3rem 5rem 3rem 5rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 5rem;
    justify-content: center;

    @media only screen and (max-width: 1250px) {
        display: flex;
        flex-wrap: wrap;
        gap: 3rem;
    }
`;

interface Props {
    behandlingId: string;
}

const Brev: React.FC<Props> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());
    const {
        behandlingErRedigerbar,
        personopplysningerResponse,
        behandling,
        totrinnskontroll,
    } = useBehandling();
    const [kanSendesTilBeslutter, settKanSendesTilBeslutter] = useState<boolean>(false);
    const kanFatteVedtak =
        totrinnskontroll.status === RessursStatus.SUKSESS &&
        totrinnskontroll.data.status === TotrinnskontrollStatus.KAN_FATTE_VEDTAK;

    const lagBeslutterBrev = () => {
        axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/brev/${behandlingId}`,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    };

    const hentBrev = () => {
        axiosRequest<string, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/brev/${behandlingId}`,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    };

    const oppdaterBrevRessurs = (respons: Ressurs<string>) => {
        settBrevRessurs(respons);
        if (respons.status === RessursStatus.SUKSESS) {
            settKanSendesTilBeslutter(true);
        }
    };

    useEffect(() => {
        if (!behandlingErRedigerbar) {
            if (
                behandling.status === RessursStatus.SUKSESS &&
                behandling.data.steg === Steg.BESLUTTE_VEDTAK &&
                kanFatteVedtak
            ) {
                lagBeslutterBrev();
            } else {
                hentBrev();
            }
        }
        // eslint-disable-next-line
    }, [behandlingErRedigerbar, behandling]);

    return (
        <>
            <StyledBrev>
                {behandlingErRedigerbar && (
                    <DataViewer response={{ personopplysningerResponse }}>
                        {({ personopplysningerResponse }) => (
                            <Brevmeny
                                behandlingId={behandlingId}
                                oppdaterBrevRessurs={oppdaterBrevRessurs}
                                personopplysninger={personopplysningerResponse}
                                settKanSendesTilBeslutter={settKanSendesTilBeslutter}
                            />
                        )}
                    </DataViewer>
                )}
                <PdfVisning pdfFilInnhold={brevRessurs} />
            </StyledBrev>
            {behandlingErRedigerbar && (
                <SendTilBeslutterFooter
                    behandlingId={behandlingId}
                    kanSendesTilBeslutter={kanSendesTilBeslutter}
                />
            )}
        </>
    );
};

export default Brev;
