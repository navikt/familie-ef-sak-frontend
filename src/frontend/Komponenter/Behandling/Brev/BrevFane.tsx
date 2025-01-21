import React, { useEffect, useState } from 'react';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import PdfVisning from '../../../Felles/Pdf/PdfVisning';
import SendTilBeslutterFooter from '../Totrinnskontroll/SendTilBeslutterFooter';
import { useBehandling } from '../../../App/context/BehandlingContext';
import Brevmeny from './Brevmeny';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useApp } from '../../../App/context/AppContext';
import { TotrinnskontrollStatus } from '../../../App/typer/totrinnskontroll';
import { BrevmottakereForBehandling } from '../Brevmottakere/BrevmottakereForBehandling';
import { skalFerdigstilleUtenBeslutter } from '../VedtakOgBeregning/Felles/utils';
import { HøyreKolonne, StyledBrev, VenstreKolonne } from './StyledBrev';
import { Behandling } from '../../../App/typer/fagsak';
import { FremleggoppgaverSomOpprettes } from './FremleggoppgaverSomOpprettes';
import { VStack } from '@navikt/ds-react';
import { useHentOppgaverForOpprettelse } from '../../../App/hooks/useHentOppgaverForOpprettelse';

interface Props {
    behandling: Behandling;
}

export const BrevFane: React.FC<Props> = ({ behandling }) => {
    const { axiosRequest } = useApp();
    const { behandlingErRedigerbar, vedtak, personopplysningerResponse, totrinnskontroll } =
        useBehandling();
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());
    const [kanSendesTilBeslutter, settKanSendesTilBeslutter] = useState<boolean>(false);
    const { oppgaverForOpprettelse, hentOppgaverForOpprettelseCallback } =
        useHentOppgaverForOpprettelse(behandling.id);

    const lagBeslutterBrev = () => {
        axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/brev/${behandling.id}`,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    };

    const hentBrev = () => {
        axiosRequest<string, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/brev/${behandling.id}`,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    };

    const oppdaterBrevRessurs = (respons: Ressurs<string>) => {
        settBrevRessurs(respons);
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
        <DataViewer
            response={{
                personopplysningerResponse,
                vedtak,
                oppgaverForOpprettelse,
            }}
        >
            {({ personopplysningerResponse, vedtak, oppgaverForOpprettelse }) => (
                <>
                    <StyledBrev>
                        <VenstreKolonne>
                            <VStack gap="4">
                                <BrevmottakereForBehandling
                                    behandlingId={behandling.id}
                                    personopplysninger={personopplysningerResponse}
                                />
                                {!behandlingErRedigerbar && (
                                    <FremleggoppgaverSomOpprettes
                                        oppgavetyperSomSkalOpprettes={
                                            oppgaverForOpprettelse.oppgavetyperSomSkalOpprettes
                                        }
                                    />
                                )}
                                {behandlingErRedigerbar && (
                                    <Brevmeny
                                        oppdaterBrevRessurs={oppdaterBrevRessurs}
                                        personopplysninger={personopplysningerResponse}
                                        settKanSendesTilBeslutter={settKanSendesTilBeslutter}
                                        behandling={behandling}
                                        vedtaksresultat={vedtak?.resultatType}
                                    />
                                )}
                            </VStack>
                        </VenstreKolonne>
                        <HøyreKolonne>
                            <PdfVisning pdfFilInnhold={brevRessurs} />
                        </HøyreKolonne>
                    </StyledBrev>
                    <SendTilBeslutterFooter
                        behandling={behandling}
                        kanSendesTilBeslutter={kanSendesTilBeslutter}
                        ferdigstillUtenBeslutter={skalFerdigstilleUtenBeslutter(vedtak)}
                        behandlingErRedigerbar={behandlingErRedigerbar}
                        oppgavetyperSomKanOpprettes={
                            oppgaverForOpprettelse.oppgavetyperSomKanOpprettes
                        }
                        oppgaverForOpprettelse={oppgaverForOpprettelse}
                        hentOppgaverForOpprettelseCallback={hentOppgaverForOpprettelseCallback}
                    />
                </>
            )}
        </DataViewer>
    );
};
