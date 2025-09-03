import React, { useCallback, useEffect, useState } from 'react';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import PdfVisning from '../../../Felles/Pdf/PdfVisning';
import SendTilBeslutter from '../Totrinnskontroll/SendTilBeslutter';
import { useBehandling } from '../../../App/context/BehandlingContext';
import Brevmeny from './Brevmeny';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useApp } from '../../../App/context/AppContext';
import { TotrinnskontrollStatus } from '../../../App/typer/totrinnskontroll';
import { BrevmottakereForBehandling } from '../Brevmottakere/BrevmottakereForBehandling';
import { Behandling } from '../../../App/typer/fagsak';
import { OverstyrtBrevmalVarsel } from './OverstyrtBrevmalVarsel';
import { FremleggoppgaverSomOpprettes } from './FremleggoppgaverSomOpprettes';
import { VStack } from '@navikt/ds-react';
import { OppgaverForFerdigstilling } from '../Totrinnskontroll/OppgaverForFerdigstilling';
import { useHentOppfølgingsoppgave } from '../../../App/hooks/useHentOppfølgingsoppgave';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';
import styled from 'styled-components';
import { AutomatiskBrevSomSendes } from './AutomatiskBrevSomSendes';
import { IBrevmottakere } from '../Brevmottakere/typer';
import { AxiosRequestConfig } from 'axios';

const StyledVStack = styled(VStack)`
    position: sticky;
    top: 100px;
`;

const Container = styled.div`
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background-color: #f2f2f2;

    @media (max-width: 1400px) {
        flex-direction: column;
        padding: 3rem;
    }
`;

const LikDelContainer = styled.div`
    flex: 1;
`;

interface Props {
    behandling: Behandling;
}

export const BrevFane: React.FC<Props> = ({ behandling }) => {
    const { axiosRequest } = useApp();
    const {
        behandlingErRedigerbar,
        vedtak,
        personopplysningerResponse,
        totrinnskontroll,
        vilkårState,
    } = useBehandling();
    const { vilkår, hentVilkår } = vilkårState;
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());
    const [kanSendesTilBeslutter, settKanSendesTilBeslutter] = useState<boolean>(false);
    const { hentOppfølgingsoppgave, oppfølgingsoppgave, feilmelding } = useHentOppfølgingsoppgave(
        behandling.id
    );
    const [erDokumentInnlastet, settErDokumentInnlastet] = useState(false);
    const [brevmottakere, settBrevmottakere] =
        useState<Ressurs<IBrevmottakere | undefined>>(byggTomRessurs());

    const hentBrevmottakere = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `familie-ef-sak/api/brevmottakere/${behandling.id}`,
        };
        return axiosRequest<IBrevmottakere | undefined, null>(behandlingConfig).then(
            (res: RessursSuksess<IBrevmottakere | undefined> | RessursFeilet) => {
                settBrevmottakere(res);
                return res;
            }
        );
    }, [axiosRequest, behandling.id]);

    const lagBeslutterBrev = () => {
        axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/brev/${behandling.id}`,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
            settErDokumentInnlastet(false);
        });
    };

    const hentBrev = () => {
        axiosRequest<string, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/brev/${behandling.id}`,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
            settErDokumentInnlastet(false);
        });
    };

    const oppdaterBrevRessurs = (respons: Ressurs<string>) => {
        settBrevRessurs(respons);
        settErDokumentInnlastet(false);
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

    useEffect(() => {
        hentVilkår(behandling.id);
    }, [behandling.id, hentVilkår]);

    useEffect(() => {
        hentBrevmottakere();
    }, [hentBrevmottakere]);

    return (
        <DataViewer
            response={{
                personopplysningerResponse,
                vedtak,
                vilkår,
                brevmottakere,
            }}
        >
            {({ personopplysningerResponse, vedtak, vilkår, brevmottakere }) => {
                return (
                    <Container>
                        <LikDelContainer>
                            {feilmelding && <AlertError size="small">{feilmelding}</AlertError>}
                            <VStack gap="4">
                                <BrevmottakereForBehandling
                                    behandlingId={behandling.id}
                                    personopplysninger={personopplysningerResponse}
                                    brevmottakere={brevmottakere}
                                    settBrevMottakere={settBrevmottakere}
                                />
                                {!behandlingErRedigerbar && (
                                    <>
                                        <FremleggoppgaverSomOpprettes
                                            oppgavetyperSomSkalOpprettes={
                                                oppfølgingsoppgave?.oppgaverForOpprettelse
                                                    .oppgavetyperSomSkalOpprettes ?? []
                                            }
                                        />
                                        <OppgaverForFerdigstilling behandlingId={behandling.id} />

                                        <AutomatiskBrevSomSendes
                                            automatiskBrev={
                                                oppfølgingsoppgave?.automatiskBrev ?? []
                                            }
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
                                        brevmottakere={brevmottakere}
                                    />
                                )}
                            </VStack>
                        </LikDelContainer>

                        <LikDelContainer>
                            <StyledVStack gap="8" align={'center'}>
                                <PdfVisning
                                    pdfFilInnhold={brevRessurs}
                                    erDokumentInnlastet={erDokumentInnlastet}
                                    settErDokumentInnlastet={settErDokumentInnlastet}
                                />

                                <SendTilBeslutter
                                    behandling={behandling}
                                    vilkår={vilkår}
                                    vedtak={vedtak}
                                    kanSendesTilBeslutter={kanSendesTilBeslutter}
                                    behandlingErRedigerbar={behandlingErRedigerbar}
                                    hentOppfølgingsoppgave={hentOppfølgingsoppgave}
                                    oppfølgingsoppgave={oppfølgingsoppgave}
                                />
                            </StyledVStack>
                        </LikDelContainer>
                    </Container>
                );
            }}
        </DataViewer>
    );
};
