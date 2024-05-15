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
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { useHentAndelHistorikkPerioder } from '../../../../App/hooks/useHentAndelHistorikkPerioder';
import { aktivitetTilTekst, periodetypeTilTekst } from '../../../../App/typer/vedtak';
import { useHentFagsakIder } from '../../../../App/hooks/useHentFagsakIder';

const Container = styled.div`
    & > *:not(:last-child) {
        margin-bottom: 2rem;
    }
`;

export const GrunnbeløpInfoOgSistePeriodeOS: FC<{
    personIdent: string;
}> = ({ personIdent }) => {
    const { fagsakOvergangsstønad } = useHentFagsakIder(personIdent);

    const { perioder } = useHentAndelHistorikkPerioder(fagsakOvergangsstønad);

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

            <DataViewer response={{ perioder }}>
                {({ perioder }) => (
                    <TabellVisning
                        tittel="Siste periode med overgangsstønad"
                        verdier={[perioder[0]]}
                        minimerKolonnebredde={true}
                        kolonner={[
                            {
                                overskrift: 'Periode',
                                tekstVerdi: (d) =>
                                    formaterStrengMedStorForbokstav(
                                        formaterTilIsoDatoFraTilStreng(
                                            d.andel.stønadFra,
                                            d.andel.stønadTil
                                        )
                                    ),
                            },
                            {
                                overskrift: 'Type',
                                tekstVerdi: (d) => periodetypeTilTekst[d.periodeType || ''],
                            },
                            {
                                overskrift: 'Aktivitet',
                                tekstVerdi: (d) => aktivitetTilTekst[d.aktivitet || ''],
                            },
                            {
                                overskrift: 'Inntekt',
                                tekstVerdi: (d) => `${formaterTallMedTusenSkille(d.andel.inntekt)}`,
                            },
                        ]}
                    />
                )}
            </DataViewer>
        </Container>
    );
};
