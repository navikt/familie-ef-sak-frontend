import React, { useEffect, useState } from 'react';
import { SimuleringResultat } from './SimuleringTyper';
import SimuleringTabell from './SimuleringTabell';
import { formaterIsoÅr } from '../../../App/utils/formatter';
import styled from 'styled-components';
import SimuleringOversikt from './SimuleringOversikt';
import { Tilbakekreving } from './Tilbakekreving';
import {
    ISanksjonereVedtakForOvergangsstønad,
    IVedtak,
    IVedtakType,
} from '../../../App/typer/vedtak';
import { Alert, VStack } from '@navikt/ds-react';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';
import { mapSimuleringstabellRader } from './utils';
import Sanksjonsperiode from './Sanksjonsperiode';
import { useApp } from '../../../App/context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';

const Container = styled.div`
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    width: fit-content;
`;

const AlertWarning = styled(Alert)`
    max-width: 60rem;
`;

const RETTSGEBYR_BELØP = 1277;

const Simulering: React.FC<{
    simuleringsresultat: SimuleringResultat;
    behandlingId: string;
    lagretVedtak?: IVedtak;
}> = ({ simuleringsresultat, behandlingId, lagretVedtak }) => {
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

    const harKreditorPosteringer = simuleringsresultat.sumKreditorPosteringer
        ? simuleringsresultat.sumKreditorPosteringer !== 0
        : false;

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
                {harKreditorPosteringer && (
                    <AlertWarning variant={'warning'}>
                        Bruker har kreditortrekk. Se egen rutine i Sharepoint.
                    </AlertWarning>
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
