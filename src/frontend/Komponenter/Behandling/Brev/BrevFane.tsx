import React, { useEffect, useState } from 'react';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import PdfVisning from '../../../Felles/Pdf/PdfVisning';
import { SendTilBeslutter } from '../Totrinnskontroll/SendTilBeslutter';
import { useBehandling } from '../../../App/context/BehandlingContext';
import Brevmeny from './Brevmeny';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useApp } from '../../../App/context/AppContext';
import { TotrinnskontrollStatus } from '../../../App/typer/totrinnskontroll';
import { BrevmottakereForBehandling } from '../Brevmottakere/BrevmottakereForBehandling';
import { utledAvslagValg } from '../VedtakOgBeregning/Felles/utils';
import { HøyreKolonne, StyledBrev, VenstreKolonne } from './StyledBrev';
import { Behandling } from '../../../App/typer/fagsak';
import { OverstyrtBrevmalVarsel } from './OverstyrtBrevmalVarsel';
import { FremleggoppgaverSomOpprettes } from './FremleggoppgaverSomOpprettes';
import { VStack } from '@navikt/ds-react';
import { OppgaverForFerdigstilling } from '../Totrinnskontroll/OppgaverForFerdigstilling';
import { useHentOppfølgingsoppgave } from '../../../App/hooks/useHentOppfølgingsoppgave';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';

interface Props {
    behandling: Behandling;
}

export const BrevFane: React.FC<Props> = ({ behandling }) => {
    const { axiosRequest } = useApp();
    const { behandlingErRedigerbar, vedtak, personopplysningerResponse, totrinnskontroll } =
        useBehandling();
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());
    const [kanSendesTilBeslutter, settKanSendesTilBeslutter] = useState<boolean>(false);
    const { hentOppfølgingsoppgave, oppfølgingsoppgave, feilmelding } = useHentOppfølgingsoppgave(
        behandling.id
    );

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
            }}
        >
            {({ personopplysningerResponse, vedtak }) => {
                const avslagValg = utledAvslagValg(vedtak);

                return (
                    <>
                        <StyledBrev>
                            <VenstreKolonne>
                                {feilmelding && <AlertError size="small">{feilmelding}</AlertError>}
                                <VStack gap="4">
                                    <BrevmottakereForBehandling
                                        behandlingId={behandling.id}
                                        personopplysninger={personopplysningerResponse}
                                    />
                                    {!behandlingErRedigerbar && (
                                        <>
                                            <FremleggoppgaverSomOpprettes
                                                oppgavetyperSomSkalOpprettes={
                                                    oppfølgingsoppgave?.oppgaverForOpprettelse
                                                        .oppgavetyperSomSkalOpprettes ?? []
                                                }
                                            />
                                            <OppgaverForFerdigstilling
                                                behandlingId={behandling.id}
                                            />
                                        </>
                                    )}
                                    {!behandlingErRedigerbar && (
                                        <OverstyrtBrevmalVarsel behandlingId={behandling.id} />
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
                                <VStack gap="8" align={'center'}>
                                    <PdfVisning pdfFilInnhold={brevRessurs} />

                                    <SendTilBeslutter
                                        behandling={behandling}
                                        kanSendesTilBeslutter={kanSendesTilBeslutter}
                                        avslagValg={avslagValg}
                                        behandlingErRedigerbar={behandlingErRedigerbar}
                                        hentOppfølgingsoppgave={hentOppfølgingsoppgave}
                                        oppfølgingsoppgave={oppfølgingsoppgave}
                                    />
                                </VStack>
                            </HøyreKolonne>
                        </StyledBrev>
                    </>
                );
            }}
        </DataViewer>
    );
};
