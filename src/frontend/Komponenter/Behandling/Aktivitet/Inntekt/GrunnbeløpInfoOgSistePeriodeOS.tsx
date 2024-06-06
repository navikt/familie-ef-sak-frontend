import React, { FC, useEffect } from 'react';
import {
    formaterStrengMedStorForbokstav,
    formaterTallMedTusenSkille,
    genererÅrOgMånedFraStreng,
} from '../../../../App/utils/formatter';
import TabellVisning from '../../Tabell/TabellVisning';
import { useHentNyesteGrunnbeløpOgAntallGrunnbeløpsperioderTilbakeITid } from '../../../../App/hooks/felles/useHentGrunnbeløpsperioder';
import { styled } from 'styled-components';
import { IVilkårGrunnlag } from '../../Inngangsvilkår/vilkår';
import { IGrunnlagsdataSistePeriodeOvergangsstønad } from '../../TidligereVedtaksperioder/typer';
import SistePeriodeMedOvergangsstønad from './SistePeriodeMedOvergangsstønad';
import { Stønadstype } from '../../../../App/typer/behandlingstema';

const Container = styled.div`
    & > *:not(:last-child) {
        margin-bottom: 2rem;
    }
`;

export const GrunnbeløpInfoOgSistePeriodeOS: FC<{
    grunnlag: IVilkårGrunnlag;
    behandlingOpprettet: string;
    stønadstype: Stønadstype;
}> = ({ grunnlag, behandlingOpprettet, stønadstype }) => {
    const sistePeriodeMedOS: IGrunnlagsdataSistePeriodeOvergangsstønad | undefined =
        grunnlag.tidligereVedtaksperioder.sak?.sistePeriodeMedOvergangsstønad;

    const { grunnbeløpsperioder, hentGrunnbeløpsperioderCallback } =
        useHentNyesteGrunnbeløpOgAntallGrunnbeløpsperioderTilbakeITid(2);

    useEffect(() => {
        hentGrunnbeløpsperioderCallback();
    }, [hentGrunnbeløpsperioderCallback]);

    return (
        <Container>
            <TabellVisning
                tittel="6 ganger grunnbeløpet"
                verdier={grunnbeløpsperioder}
                minimerKolonnebredde={true}
                kolonner={[
                    {
                        overskrift: 'Fra',
                        tekstVerdi: (d) =>
                            formaterStrengMedStorForbokstav(
                                genererÅrOgMånedFraStreng(d.periode.fom)
                            ),
                    },
                    {
                        overskrift: '6G  (år)',
                        tekstVerdi: (d) =>
                            `${formaterTallMedTusenSkille(d.seksGangerGrunnbeløp)} kr`,
                    },
                    {
                        overskrift: '6G (måned)',
                        tekstVerdi: (d) =>
                            `${formaterTallMedTusenSkille(d.seksGangerGrunnbeløpPerMåned)} kr`,
                    },
                ]}
            />

            <SistePeriodeMedOvergangsstønad
                sistePeriodeMedOS={sistePeriodeMedOS}
                behandlingOpprettet={behandlingOpprettet}
                stønadstype={stønadstype}
            />
        </Container>
    );
};
