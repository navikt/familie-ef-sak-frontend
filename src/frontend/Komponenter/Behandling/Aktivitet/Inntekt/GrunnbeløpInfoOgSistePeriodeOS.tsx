import React, { FC, useEffect } from 'react';
import {
    formaterStrengMedStorForbokstav,
    formaterTallMedTusenSkille,
    formaterFraIsoDatoTilStreng,
    genererÅrOgMånedFraStreng,
} from '../../../../App/utils/formatter';
import { useHentNyesteGrunnbeløpOgAntallGrunnbeløpsperioderTilbakeITid } from '../../../../App/hooks/felles/useHentGrunnbeløpsperioder';
import { IVilkårGrunnlag } from '../../Inngangsvilkår/vilkår';
import {
    IGrunnlagsdataPerioderOvergangsstønadOgInntekt,
    IGrunnlagsdataSistePeriodeOvergangsstønad,
} from '../../TidligereVedtaksperioder/typer';
import SistePeriodeMedOvergangsstønad from './SistePeriodeMedOvergangsstønad';
import { Behandling } from '../../../../App/typer/fagsak';
import { Heading, Table, VStack } from '@navikt/ds-react';
import { behandlingOgTilbakekrevingsårsakTilTekst } from '../../../../App/typer/behandlingsårsak';

interface Props {
    grunnlag: IVilkårGrunnlag;
    behandling: Behandling;
}

export const GrunnbeløpInfoOgSistePeriodeOS: FC<Props> = ({ grunnlag, behandling }) => {
    const sistePeriodeMedOS: IGrunnlagsdataSistePeriodeOvergangsstønad | undefined =
        grunnlag.tidligereVedtaksperioder.sak?.sistePeriodeMedOvergangsstønad;

    const perioderMedOvergangsstønadOgInntekt:
        | IGrunnlagsdataPerioderOvergangsstønadOgInntekt[]
        | undefined = grunnlag.tidligereVedtaksperioder.sak?.perioderMedOvergangsstønadOgInntekt;

    const toNyestePerioderMedOvergangsstønadOgInntekt =
        perioderMedOvergangsstønadOgInntekt && perioderMedOvergangsstønadOgInntekt.slice(0, 2);

    // Det er lagt til en ny verdi i grunnlagsdata - behandlingsårsak. Hvis denne ikke finnes (gamle behandlinger) skal vi vise tabell med en rad som før.
    const visTabellMedToNyestePerioder =
        perioderMedOvergangsstønadOgInntekt?.some((periode) => periode.behandlingsårsak) ?? false;

    const { grunnbeløpsperioder, hentGrunnbeløpsperioderCallback } =
        useHentNyesteGrunnbeløpOgAntallGrunnbeløpsperioderTilbakeITid(2);

    useEffect(() => {
        hentGrunnbeløpsperioderCallback();
    }, [hentGrunnbeløpsperioderCallback]);

    return (
        <VStack
            gap="4"
            style={{
                maxWidth: 'fit-content',
            }}
        >
            <Heading level="1" size="xsmall">
                6 ganger grunnbeløpet
            </Heading>
            <Table size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader textSize="small" scope="col">
                            Fra
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textSize="small" scope="col">
                            6G (år)
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textSize="small" scope="col">
                            6G (måned)
                        </Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {grunnbeløpsperioder?.map(
                        ({ periode, seksGangerGrunnbeløp, seksGangerGrunnbeløpPerMåned }, i) => {
                            return (
                                <Table.Row key={i}>
                                    <Table.DataCell>
                                        {formaterStrengMedStorForbokstav(
                                            genererÅrOgMånedFraStreng(periode.fom)
                                        )}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {formaterTallMedTusenSkille(seksGangerGrunnbeløp)}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {formaterTallMedTusenSkille(seksGangerGrunnbeløpPerMåned)}
                                    </Table.DataCell>
                                </Table.Row>
                            );
                        }
                    )}
                </Table.Body>
            </Table>
            {/*<TabellVisning*/}
            {/*    tittel="6 ganger grunnbeløpet"*/}
            {/*    verdier={grunnbeløpsperioder}*/}
            {/*    minimerKolonnebredde={true}*/}
            {/*    kolonner={[*/}
            {/*        {*/}
            {/*            overskrift: 'Fra',*/}
            {/*            tekstVerdi: (d) =>*/}
            {/*                formaterStrengMedStorForbokstav(*/}
            {/*                    genererÅrOgMånedFraStreng(d.periode.fom)*/}
            {/*                ),*/}
            {/*        },*/}
            {/*        {*/}
            {/*            overskrift: '6G  (år)',*/}
            {/*            tekstVerdi: (d) =>*/}
            {/*                `${formaterTallMedTusenSkille(d.seksGangerGrunnbeløp)} kr`,*/}
            {/*        },*/}
            {/*        {*/}
            {/*            overskrift: '6G (måned)',*/}
            {/*            tekstVerdi: (d) =>*/}
            {/*                `${formaterTallMedTusenSkille(d.seksGangerGrunnbeløpPerMåned)} kr`,*/}
            {/*        },*/}
            {/*    ]}*/}
            {/*/>*/}

            {visTabellMedToNyestePerioder && perioderMedOvergangsstønadOgInntekt ? (
                <div>
                    <Heading level="1" size="xsmall">
                        De to nyeste periodene med overgangsstønad
                    </Heading>

                    <Table
                        size="small"
                        style={{
                            maxWidth: 'fit-content',
                        }}
                    >
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell textSize="small" scope="col">
                                    Periode
                                </Table.HeaderCell>
                                <Table.HeaderCell textSize="small" scope="col">
                                    Inntekt
                                </Table.HeaderCell>
                                <Table.HeaderCell textSize="small" scope="col">
                                    Behandlingsårsak
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {toNyestePerioderMedOvergangsstønadOgInntekt?.map(
                                ({ fom, tom, inntekt, behandlingsårsak }, i) => {
                                    return (
                                        <Table.Row key={i}>
                                            <Table.DataCell>
                                                {formaterFraIsoDatoTilStreng(fom, tom)}
                                            </Table.DataCell>
                                            <Table.DataCell>
                                                {formaterTallMedTusenSkille(inntekt)}
                                            </Table.DataCell>
                                            <Table.DataCell>
                                                {
                                                    behandlingOgTilbakekrevingsårsakTilTekst[
                                                        behandlingsårsak
                                                    ]
                                                }
                                            </Table.DataCell>
                                        </Table.Row>
                                    );
                                }
                            )}
                        </Table.Body>
                    </Table>
                </div>
            ) : (
                <SistePeriodeMedOvergangsstønad
                    sistePeriodeMedOS={sistePeriodeMedOS}
                    behandling={behandling}
                />
            )}
        </VStack>
    );
};
