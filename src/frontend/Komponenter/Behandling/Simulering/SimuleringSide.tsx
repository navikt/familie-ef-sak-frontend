import React, { useState } from 'react';
import { Simulering } from './SimuleringTyper';
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

const SimuleringSide: React.FC<{
    simuleringsresultat: Simulering;
    behandlingId: string;
    lagretVedtak?: IVedtak;
}> = ({ simuleringsresultat, behandlingId, lagretVedtak }) => {
    const { toggles } = useToggles();
    const muligeÅr = [...new Set(simuleringsresultat.perioder.map((p) => formaterIsoÅr(p.fom)))];

    const [år, settÅr] = useState(
        muligeÅr.length ? Math.max(...muligeÅr) : new Date().getFullYear()
    );

    const simuleringTabellRader = mapSimuleringstabellRader(simuleringsresultat, år);

    const lagretSanksjonertVedtak =
        lagretVedtak?._type === IVedtakType.Sanksjonering
            ? (lagretVedtak as ISanksjonereVedtakForOvergangsstønad)
            : undefined;

    const harFeilutbetaling = simuleringsresultat.feilutbetaling > 0;

    const erUnder4xRettsgebyr =
        simuleringsresultat.feilutbetaling < RETTSGEBYR_BELØP * 4 &&
        toggles[ToggleName.visAutomatiskBehandlingAvTilbakekrevingValg];

    const erPositivSum =
        simuleringsresultat.sumManuellePosteringer !== null &&
        simuleringsresultat.sumManuellePosteringer !== undefined &&
        simuleringsresultat.sumManuellePosteringer > 0;

    return (
        <Container>
            <VStack gap="4">
                <SimuleringOversikt simulering={simuleringsresultat} />
                {erPositivSum && (
                    <AlertWarning variant={'warning'}>
                        Det finnes manuelle posteringer tilknyttet tidligere behandling.
                        Simuleringsbildet kan derfor være ufullstendig.
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
                    erUnder4xRettsgebyr={erUnder4xRettsgebyr}
                />
            )}
        </Container>
    );
};

export default SimuleringSide;
