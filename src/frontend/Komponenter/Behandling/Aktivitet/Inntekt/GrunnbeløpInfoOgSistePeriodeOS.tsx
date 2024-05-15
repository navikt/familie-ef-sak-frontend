import React, { FC, useEffect } from 'react';
import {
    formaterStrengMedStorForbokstav,
    formaterTallMedTusenSkille,
    formaterTilIsoDatoFraTilStreng,
    genererÅrOgMånedFraStreng,
} from '../../../../App/utils/formatter';
import TabellVisning from '../../Tabell/TabellVisning';
import { useHentNyesteGrunnbeløpOgAntallGrunnbeløpsperioderTilbakeITid } from '../../../../App/hooks/felles/useHentGrunnbeløpsperioder';
import { styled } from 'styled-components';
import { aktivitetTilTekst, periodetypeTilTekst } from '../../../../App/typer/vedtak';
import { IVilkårGrunnlag } from '../../Inngangsvilkår/vilkår';

const Container = styled.div`
    & > *:not(:last-child) {
        margin-bottom: 2rem;
    }
`;

export const GrunnbeløpInfoOgSistePeriodeOS: FC<{
    grunnlag: IVilkårGrunnlag;
}> = ({ grunnlag }) => {
    const periodeHistorikkOvergangsstønad =
        grunnlag.tidligereVedtaksperioder.sak?.periodeHistorikkOvergangsstønad;

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

            {periodeHistorikkOvergangsstønad && periodeHistorikkOvergangsstønad.length > 0 && (
                <TabellVisning
                    tittel="Siste periode med overgangsstønad"
                    verdier={[periodeHistorikkOvergangsstønad[0]]}
                    minimerKolonnebredde={true}
                    kolonner={[
                        {
                            overskrift: 'Periode',
                            tekstVerdi: (d) =>
                                formaterStrengMedStorForbokstav(
                                    formaterTilIsoDatoFraTilStreng(d.fom, d.tom)
                                ),
                        },
                        {
                            overskrift: 'Type',
                            tekstVerdi: (d) => periodetypeTilTekst[d.vedtaksperiodeType || ''],
                        },
                        {
                            overskrift: 'Aktivitet',
                            tekstVerdi: (d) => aktivitetTilTekst[d.aktivitet ?? ''],
                        },
                        {
                            overskrift: 'Inntekt',
                            tekstVerdi: (d) => `${formaterTallMedTusenSkille(d.inntekt)}`,
                        },
                    ]}
                />
            )}
        </Container>
    );
};
