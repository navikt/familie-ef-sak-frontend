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
import { Behandling } from '../../../../App/typer/fagsak';

const Container = styled.div`
    & > *:not(:last-child) {
        margin-bottom: 2rem;
    }
`;

interface Props {
    grunnlag: IVilkårGrunnlag;
    behandling: Behandling;
}

export const GrunnbeløpInfoOgSistePeriodeOS: FC<Props> = ({ grunnlag, behandling }) => {
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
                behandling={behandling}
            />
        </Container>
    );
};
