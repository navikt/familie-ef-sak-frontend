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
import { skalFerdigstilleUtenBeslutter } from '../VedtakOgBeregning/Felles/utils';
import { useHentOppgaverForOpprettelse } from '../../../App/hooks/useHentOppgaverForOpprettelse';
import { AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';
import { oppgaveSomSkalOpprettesTilTekst } from '../Totrinnskontroll/oppgaveForOpprettelseTyper';
import { HøyreKolonne, StyledBrev, VenstreKolonne } from './StyledBrev';
import { Behandling } from '../../../App/typer/fagsak';
import { Link, VStack } from '@navikt/ds-react';
import { FolderFileIcon } from '@navikt/aksel-icons';

const InfostripeGruppe = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
`;

const StyledInfostripe = styled(AlertInfo)`
    padding-top: 1rem;
    width: 40rem;
`;

interface Props {
    behandling: Behandling;
}

const BREVMALER_SHAREPOINT_URL =
    'https://navno.sharepoint.com/sites/Ensligforsrger-Sharepoint/Delte%20dokumenter/Forms/AllItems.aspx?id=%2Fsites%2FEnsligforsrger%2DSharepoint%2FDelte%20dokumenter%2FMaler&viewid=9e59b601%2Db831%2D49f5%2D8495%2D8623c77b3ae9';

export const BrevFane: React.FC<Props> = ({ behandling }) => {
    const { axiosRequest } = useApp();
    const { behandlingErRedigerbar, vedtak, personopplysningerResponse, totrinnskontroll } =
        useBehandling();
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());
    const [kanSendesTilBeslutter, settKanSendesTilBeslutter] = useState<boolean>(false);
    const oppgaverForOpprettelse = useHentOppgaverForOpprettelse(behandling.id);

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

    const åpneUrlINyttVindu = (url: string) => {
        window.open(url, 'BrevmalerVindu', 'width=1200,height=1000');
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
        <DataViewer response={{ personopplysningerResponse, vedtak }}>
            {({ personopplysningerResponse, vedtak }) => (
                <>
                    <StyledBrev>
                        <VenstreKolonne>
                            <VStack gap="6">
                                <BrevmottakereForBehandling
                                    behandlingId={behandling.id}
                                    personopplysninger={personopplysningerResponse}
                                />

                                <Link
                                    href={BREVMALER_SHAREPOINT_URL}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        åpneUrlINyttVindu(BREVMALER_SHAREPOINT_URL);
                                    }}
                                >
                                    Brevmaler i Sharepoint
                                    <FolderFileIcon title="a11y-title" fontSize="1.5rem" />
                                </Link>

                                {!behandlingErRedigerbar && (
                                    <InfostripeGruppe>
                                        {oppgaverForOpprettelse.oppgavetyperSomSkalOpprettes.map(
                                            (oppgaveType, idx) => (
                                                <StyledInfostripe key={idx}>
                                                    {oppgaveSomSkalOpprettesTilTekst[oppgaveType]}
                                                </StyledInfostripe>
                                            )
                                        )}
                                    </InfostripeGruppe>
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
                        oppgaverForOpprettelse={oppgaverForOpprettelse}
                    />
                </>
            )}
        </DataViewer>
    );
};
