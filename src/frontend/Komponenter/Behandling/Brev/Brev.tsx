import React, { useEffect, useState } from 'react';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import PdfVisning from '../../../Felles/Pdf/PdfVisning';
import styled from 'styled-components';
import SendTilBeslutterFooter from '../Totrinnskontroll/SendTilBeslutterFooter';
import { useBehandling } from '../../../App/context/BehandlingContext';
import Brevmeny from './Brevmeny';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useApp } from '../../../App/context/AppContext';
import { TotrinnskontrollStatus } from '../../../App/typer/totrinnskontroll';
import { BrevmottakereForBehandling } from '../Brevmottakere/BrevmottakereForBehandling';
import { useHentVedtak } from '../../../App/hooks/useHentVedtak';
import { skalFerdigstilleUtenBeslutter } from '../VedtakOgBeregning/Felles/utils';

const StyledBrev = styled.div`
    background-color: #f2f2f2;
    padding: 2rem 2rem;
    display: flex;
    flex-flow: wrap;
    gap: 3rem;
    justify-content: center;
`;

const VenstreKolonne = styled.div`
    flex-basis: 450px;
    flex-shrink: 1;
    flex-grow: 1;
`;

const HøyreKolonne = styled.div`
    flex-shrink: 0;
    flex-grow: 1;
`;

interface Props {
    behandlingId: string;
}

const Brev: React.FC<Props> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());
    const { behandlingErRedigerbar, personopplysningerResponse, totrinnskontroll, behandling } =
        useBehandling();
    const [kanSendesTilBeslutter, settKanSendesTilBeslutter] = useState<boolean>(false);
    const { hentVedtak, vedtak } = useHentVedtak(behandlingId);

    useEffect(() => {
        hentVedtak();
    }, [hentVedtak]);

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
        if (!behandlingErRedigerbar && totrinnskontroll.status === RessursStatus.SUKSESS) {
            if (totrinnskontroll.data.status === TotrinnskontrollStatus.KAN_FATTE_VEDTAK) {
                lagBeslutterBrev();
            } else {
                hentBrev();
            }
        }
        // eslint-disable-next-line
    }, [behandlingErRedigerbar, totrinnskontroll]);

    return (
        <DataViewer response={{ personopplysningerResponse, behandling, vedtak }}>
            {({ personopplysningerResponse, behandling, vedtak }) => (
                <>
                    <StyledBrev>
                        <VenstreKolonne>
                            <BrevmottakereForBehandling
                                behandlingId={behandling.id}
                                personopplysninger={personopplysningerResponse}
                            />
                            {behandlingErRedigerbar && (
                                <Brevmeny
                                    behandlingId={behandlingId}
                                    oppdaterBrevRessurs={oppdaterBrevRessurs}
                                    personopplysninger={personopplysningerResponse}
                                    settKanSendesTilBeslutter={settKanSendesTilBeslutter}
                                    behandling={behandling}
                                    vedtaksresultat={vedtak?.resultatType}
                                />
                            )}
                        </VenstreKolonne>
                        <HøyreKolonne>
                            <PdfVisning pdfFilInnhold={brevRessurs} />
                        </HøyreKolonne>
                    </StyledBrev>
                    <SendTilBeslutterFooter
                        behandlingId={behandlingId}
                        kanSendesTilBeslutter={kanSendesTilBeslutter}
                        ferdigstillUtenBeslutter={skalFerdigstilleUtenBeslutter(vedtak)}
                        behandlingErRedigerbar={behandlingErRedigerbar}
                    />
                </>
            )}
        </DataViewer>
    );
};

export default Brev;
