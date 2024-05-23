import React, { FC, useEffect } from 'react';
import {
    formaterIsoDatoTid,
    formaterStrengMedStorForbokstav,
    formaterTallMedTusenSkille,
    formaterTilIsoDatoFraTilStreng,
    genererÅrOgMånedFraStreng,
} from '../../../../App/utils/formatter';
import TabellVisning from '../../Tabell/TabellVisning';
import { useHentNyesteGrunnbeløpOgAntallGrunnbeløpsperioderTilbakeITid } from '../../../../App/hooks/felles/useHentGrunnbeløpsperioder';
import { styled } from 'styled-components';
import { periodetypeTilTekst } from '../../../../App/typer/vedtak';
import { IVilkårGrunnlag } from '../../Inngangsvilkår/vilkår';
import { IGrunnlagsdataPeriodeHistorikkOvergangsstønad } from '../../TidligereVedtaksperioder/typer';

const Container = styled.div`
    & > *:not(:last-child) {
        margin-bottom: 2rem;
    }
`;

export const GrunnbeløpInfoOgSistePeriodeOS: FC<{
    grunnlag: IVilkårGrunnlag;
    behandlingOpprettet: string;
}> = ({ grunnlag, behandlingOpprettet }) => {
    const sistePeriodeMedOS: IGrunnlagsdataPeriodeHistorikkOvergangsstønad | undefined =
        grunnlag.tidligereVedtaksperioder.sak?.periodeHistorikkOvergangsstønad[0];

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

            {sistePeriodeMedOS && (
                <TabellVisning
                    tittel={`Siste periode med overgangsstønad`}
                    ekstraTekstTittel={`(sist oppdatert ${formaterIsoDatoTid(behandlingOpprettet)})`}
                    verdier={[sistePeriodeMedOS]}
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
                            overskrift: 'Inntekt',
                            tekstVerdi: (d) =>
                                `${formaterTallMedTusenSkille(d.inntekt ? d.inntekt : 0)}`,
                        },
                        ...(sistePeriodeMedOS.samordningsfradrag &&
                        sistePeriodeMedOS.samordningsfradrag > 0
                            ? [
                                  {
                                      overskrift: 'Samordning',
                                      tekstVerdi: (
                                          d: IGrunnlagsdataPeriodeHistorikkOvergangsstønad
                                      ) => `${formaterTallMedTusenSkille(d.samordningsfradrag)}`,
                                  },
                              ]
                            : []),
                    ]}
                />
            )}
        </Container>
    );
};
