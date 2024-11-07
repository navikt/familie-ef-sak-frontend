import React, { useEffect, useState } from 'react';
import { SimuleringResultat } from './SimuleringTyper';
import SimuleringTabell from './SimuleringTabell';
import { formaterIsoDato, formaterIsoÅr } from '../../../App/utils/formatter';
import styled from 'styled-components';
import SimuleringOversikt from './SimuleringOversikt';
import { Tilbakekreving } from './Tilbakekreving';
import {
    ISanksjonereVedtakForOvergangsstønad,
    IVedtak,
    IVedtakType,
} from '../../../App/typer/vedtak';
import { Alert, ExpansionCard, List, VStack } from '@navikt/ds-react';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';
import { mapSimuleringstabellRader } from './utils';
import Sanksjonsperiode from './Sanksjonsperiode';
import { useApp } from '../../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Behandling } from '../../../App/typer/fagsak';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { BodyLongSmall } from '../../../Felles/Visningskomponenter/Tekster';
import { ASurfaceWarningSubtle, ASurfaceWarningSubtleHover } from '@navikt/ds-tokens/dist/tokens';
import { AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';
const Container = styled.div`
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    width: fit-content;
`;

const ExpansionCardWarning = styled(ExpansionCard)`
    max-width: 42.5rem;
    --ac-expansioncard-bg: ${ASurfaceWarningSubtle};
    --ac-expansioncard-header-bg-hover: ${ASurfaceWarningSubtleHover};
    --ac-expansioncard-border-open-color: ${ASurfaceWarningSubtleHover};
    --ac-expansioncard-border-hover-color: ${ASurfaceWarningSubtleHover};
`;
const AlertWarning = styled(Alert)`
    max-width: 60rem;
`;

const RETTSGEBYR_BELØP = 1277;

const Simulering: React.FC<{
    simuleringsresultat: SimuleringResultat;
    lagretVedtak?: IVedtak;
    behandling: Behandling;
}> = ({ simuleringsresultat, behandling, lagretVedtak }) => {
    const behandlingId = behandling.id;
    const { toggles } = useToggles();
    const { axiosRequest } = useApp();
    const muligeÅr = [...new Set(simuleringsresultat.perioder.map((p) => formaterIsoÅr(p.fom)))];

    const [
        finnesFlereTilbakekrevingsvalgRegistrertSisteÅr,
        settFinnesFlereTilbakekrevingsvalgRegistrertSisteÅr,
    ] = useState<Ressurs<boolean>>(byggTomRessurs());

    const hentFinnesFlereTilbakekrevingsvalgRegistrertSisteÅr = () =>
        axiosRequest<boolean, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/tilbakekreving/${behandlingId}/finnes-flere-tilbakekrevinger-valgt-siste-aar`,
        }).then((response) => settFinnesFlereTilbakekrevingsvalgRegistrertSisteÅr(response));

    useEffect(() => {
        hentFinnesFlereTilbakekrevingsvalgRegistrertSisteÅr();
        // eslint-disable-next-line
    }, [behandlingId]);
    const { behandlingErRedigerbar } = useBehandling();
    const [år, settÅr] = useState(
        muligeÅr.length ? Math.max(...muligeÅr) : new Date().getFullYear()
    );

    const simuleringTabellRader = mapSimuleringstabellRader(simuleringsresultat, år);

    const lagretSanksjonertVedtak =
        lagretVedtak?._type === IVedtakType.Sanksjonering
            ? (lagretVedtak as ISanksjonereVedtakForOvergangsstønad)
            : undefined;

    const harFeilutbetaling = simuleringsresultat.feilutbetaling > 0;

    const skalViseValgForAutomatiskBehandlingUnder4xRettsgebyr =
        simuleringsresultat.feilutbetaling < RETTSGEBYR_BELØP * 4 &&
        simuleringsresultat.etterbetaling === 0 &&
        toggles[ToggleName.visAutomatiskBehandlingAvTilbakekrevingValg];

    const harManuellePosteringer = simuleringsresultat.sumManuellePosteringer
        ? simuleringsresultat.sumManuellePosteringer > 0
        : false;

    const harKreditorPosteringerForOvergangsstønad =
        behandling.stønadstype === Stønadstype.OVERGANGSSTØNAD &&
        simuleringsresultat.sumKreditorPosteringer
            ? simuleringsresultat.sumKreditorPosteringer !== 0
            : false;

    if (simuleringsresultat.perioder.length === 0) {
        return (
            <Container>
                <AlertInfo>
                    I dette vedtaket er det ingen nye utbetalinger tilbake i tid og/eller i
                    inneværende måned. Det er derfor det ikke blir vist simulering i dette vedtaket.
                </AlertInfo>
            </Container>
        );
    }

    return (
        <Container>
            <VStack gap="4">
                <SimuleringOversikt simulering={simuleringsresultat} />
                {harManuellePosteringer && (
                    <AlertWarning variant={'warning'}>
                        Det finnes manuelle posteringer tilknyttet tidligere behandling.
                        Simuleringsbildet kan derfor være ufullstendig.
                    </AlertWarning>
                )}
                {harKreditorPosteringerForOvergangsstønad && (
                    <ExpansionCardWarning aria-label={'Kreditortrekk'} size={'small'}>
                        <ExpansionCard.Header>
                            <ExpansionCard.Title>
                                Bruker har kreditortrekk (
                                {formaterIsoDato(simuleringsresultat.tidSimuleringHentet)})
                            </ExpansionCard.Title>
                            <ExpansionCard.Description>
                                Hvis bruker har feilutbetalt overgangsstønad, må du sjekke om totalt
                                feilutbetalt beløp og månedsbeløpene stemmer overens.
                            </ExpansionCard.Description>
                        </ExpansionCard.Header>
                        <ExpansionCard.Content>
                            <List>
                                <List.Item>
                                    <BodyLongSmall>
                                        Hvis ja, kan du behandle saken på vanlig måte (varsle eller
                                        fatte vedtak)
                                    </BodyLongSmall>
                                </List.Item>
                                <List.Item>
                                    <BodyLongSmall>
                                        Hvis nei, kontakt NØS og spør om bruker har kreditortrekk
                                        som ikke er utbetalt til kreditor. Be om at kreditortrekket
                                        ikke utbetales til kreditor. Slik kan vi gjøre
                                        feilutbetalingssaken lavere for bruker. Behold saken på egen
                                        benk. Når NØS har gitt tilbakemelding og kravgrunnlaget er
                                        oppdatert, kan saken behandles på vanlig måte.
                                    </BodyLongSmall>
                                </List.Item>
                            </List>
                            <VStack gap={'2'}>
                                <BodyLongSmall>
                                    Du kan kontakte NØS via Gosys-oppgave eller på telefon.
                                </BodyLongSmall>
                                <div>
                                    <BodyLongSmall>Gosys-oppgave til NØS:</BodyLongSmall>
                                    <BodyLongSmall>Tema: Regnskap/utbetaling</BodyLongSmall>
                                    <BodyLongSmall>Gjelder: Velg aktuell ytelse</BodyLongSmall>
                                    <BodyLongSmall>Oppgavetype: Vurder henvendelse</BodyLongSmall>
                                </div>
                                <BodyLongSmall>
                                    Tlf. nr. 40003700, åpningstid kl. 10:00 - 14:00.
                                </BodyLongSmall>
                            </VStack>
                        </ExpansionCard.Content>
                    </ExpansionCardWarning>
                )}
                {finnesFlereTilbakekrevingsvalgRegistrertSisteÅr.status === RessursStatus.SUKSESS &&
                    finnesFlereTilbakekrevingsvalgRegistrertSisteÅr.data &&
                    skalViseValgForAutomatiskBehandlingUnder4xRettsgebyr &&
                    behandlingErRedigerbar && (
                        <AlertWarning variant={'warning'}>
                            Det er opprettet automatisk behandling av tilbakekreving minst 2 ganger
                            i løpet av de siste 12 månedene. Vurder om beløpet skal betales tilbake.
                        </AlertWarning>
                    )}
                <SimuleringTabell
                    perioder={simuleringTabellRader}
                    årsvelger={{ valgtÅr: år, settÅr: settÅr, muligeÅr: muligeÅr }}
                />
            </VStack>
            <Sanksjonsperiode sanksjonertVedtak={lagretSanksjonertVedtak} />
            {harFeilutbetaling && (
                <Tilbakekreving
                    behandlingId={behandlingId}
                    skalViseValgForAutomatiskBehandlingUnder4xRettsgebyr={
                        skalViseValgForAutomatiskBehandlingUnder4xRettsgebyr
                    }
                />
            )}
        </Container>
    );
};

export default Simulering;
