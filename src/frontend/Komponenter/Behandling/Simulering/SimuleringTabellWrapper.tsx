import React, { useState } from 'react';
import { ISimulering, ISimuleringTabellRad } from './SimuleringTyper';
import SimuleringTabell from './SimuleringTabell';
import { formaterIsoMåned, formaterIsoÅr } from '../../../App/utils/formatter';
import { gjelderÅr } from '../../../App/utils/dato';
import styled from 'styled-components';
import SimuleringOversikt from './SimuleringOversikt';
import { Tilbakekreving } from './Tilbakekreving';
import {
    ISanksjonereVedtakForOvergangsstønad,
    IVedtak,
    IVedtakType,
} from '../../../App/typer/vedtak';
import { nåværendeÅrOgMånedFormatert } from '../Sanksjon/utils';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import { Heading, Alert } from '@navikt/ds-react';

const SimuleringsContainer = styled.div`
    margin: 2rem;
`;

const Seksjon = styled.div`
    margin-top: 2rem;
`;

const TekstMedMargin = styled(BodyShortSmall)`
    margin-top: 1rem;
`;

const StyledAlert = styled(Alert)`
    max-width: 60rem;
    margin: 1rem 0 0.25rem 0;
`;

const mapSimuleringstabellRader = (
    simuleringsresultat: ISimulering,
    år: number
): ISimuleringTabellRad[] => {
    return simuleringsresultat.perioder
        .filter((periode) => {
            return gjelderÅr(periode.fom, år);
        })
        .map((periode) => {
            return {
                måned: formaterIsoMåned(periode.fom),
                nyttBeløp: periode.nyttBeløp,
                tidligereUtbetalt: periode.tidligereUtbetalt,
                resultat: periode.resultat,
                gjelderNestePeriode: periode.fom === simuleringsresultat.fomDatoNestePeriode,
            };
        });
};

const SimuleringTabellWrapper: React.FC<{
    simuleringsresultat: ISimulering;
    behandlingId: string;
    lagretVedtak?: IVedtak;
}> = ({ simuleringsresultat, behandlingId, lagretVedtak }) => {
    const muligeÅr = [...new Set(simuleringsresultat.perioder.map((p) => formaterIsoÅr(p.fom)))];

    const [år, settÅr] = useState(
        muligeÅr.length ? Math.max(...muligeÅr) : new Date().getFullYear()
    );

    const simuleringTabellRader = mapSimuleringstabellRader(simuleringsresultat, år);

    const lagretSanksjonertVedtak =
        lagretVedtak?._type === IVedtakType.Sanksjonering
            ? (lagretVedtak as ISanksjonereVedtakForOvergangsstønad)
            : undefined;

    function harFeilutbetaling() {
        return simuleringsresultat.feilutbetaling > 0;
    }

    return (
        <SimuleringsContainer>
            <SimuleringOversikt simulering={simuleringsresultat} />
            {simuleringsresultat.sumManuellePosteringer != null &&
                simuleringsresultat.sumManuellePosteringer > 0 && (
                    <StyledAlert variant={'warning'}>
                        Det finnes manuelle posteringer tilknyttet tidligere behandling.
                        Simuleringsbildet kan derfor være utilstrekkelig.
                    </StyledAlert>
                )}
            <SimuleringTabell
                perioder={simuleringTabellRader}
                årsvelger={{ valgtÅr: år, settÅr: settÅr, muligeÅr: muligeÅr }}
            />
            {lagretSanksjonertVedtak && (
                <Seksjon>
                    <Heading size={'small'} level={'3'}>
                        Sanksjonsperiode
                    </Heading>
                    <TekstMedMargin>
                        Måneden for sanksjon er{' '}
                        <b>
                            {nåværendeÅrOgMånedFormatert(
                                lagretSanksjonertVedtak?.periode.årMånedFra
                            )}
                        </b>{' '}
                        som er måneden etter dette vedtaket. Bruker vil ikke få utbetalt stønad i
                        denne perioden.
                    </TekstMedMargin>
                </Seksjon>
            )}
            {harFeilutbetaling() && <Tilbakekreving behandlingId={behandlingId} />}
        </SimuleringsContainer>
    );
};

export default SimuleringTabellWrapper;
