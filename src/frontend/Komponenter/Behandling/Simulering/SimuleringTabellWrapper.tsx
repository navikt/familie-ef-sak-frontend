import React, { useState } from 'react';
import { ISimulering, ISimuleringTabellRad } from './SimuleringTyper';
import SimuleringTabell from './SimuleringTabell';
import { formaterIsoMåned, formaterIsoÅr } from '../../../App/utils/formatter';
import { gjelderÅr } from '../../../App/utils/dato';
import styled from 'styled-components';
import SimuleringOversikt from './SimuleringOversikt';
import { Tilbakekreving } from './Tilbakekreving';
import { EBehandlingResultat, ISanksjonereVedtak, IVedtak } from '../../../App/typer/vedtak';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { nåværendeÅrOgMånedFormatert } from '../Sanksjon/utils';

const SimuleringsContainer = styled.div`
    margin: 2rem;
`;

const Seksjon = styled.div`
    margin-top: 2rem;
`;

const NormaltekstMedMargin = styled(Normaltekst)`
    margin-top: 1rem;
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
        lagretVedtak?.resultatType === EBehandlingResultat.SANKSJONERE
            ? (lagretVedtak as ISanksjonereVedtak)
            : undefined;

    function harFeilutbetaling() {
        return simuleringsresultat.feilutbetaling > 0;
    }

    return (
        <SimuleringsContainer>
            <SimuleringOversikt simulering={simuleringsresultat} />
            <SimuleringTabell
                perioder={simuleringTabellRader}
                årsvelger={{ valgtÅr: år, settÅr: settÅr, muligeÅr: muligeÅr }}
            />
            {harFeilutbetaling() && !lagretSanksjonertVedtak && (
                <Tilbakekreving behandlingId={behandlingId} />
            )}
            {lagretSanksjonertVedtak && (
                <Seksjon>
                    <Undertittel>Sanksjonsperiode</Undertittel>
                    <NormaltekstMedMargin>
                        Måneden for sanksjon er{' '}
                        <b>
                            {nåværendeÅrOgMånedFormatert(
                                lagretSanksjonertVedtak?.periode.årMånedFra
                            )}
                        </b>{' '}
                        som er måneden etter dette vedtaket. Bruker vil ikke få utbetalt stønad i
                        denne perioden.
                    </NormaltekstMedMargin>
                </Seksjon>
            )}
        </SimuleringsContainer>
    );
};

export default SimuleringTabellWrapper;
