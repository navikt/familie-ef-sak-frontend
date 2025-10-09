import React, { FC, useEffect } from 'react';
import {
    formaterStrengMedStorForbokstav,
    formaterTallMedTusenSkille,
    formaterFraIsoDatoTilStreng,
    genererÅrOgMånedFraStreng,
} from '../../../../App/utils/formatter';
import TabellVisning from '../../Tabell/TabellVisning';
import { useHentNyesteGrunnbeløpOgAntallGrunnbeløpsperioderTilbakeITid } from '../../../../App/hooks/felles/useHentGrunnbeløpsperioder';
import { styled } from 'styled-components';
import { IVilkårGrunnlag } from '../../Inngangsvilkår/vilkår';
import {
    IGrunnlagsdataPerioderOvergangsstønadOgInntekt,
    IGrunnlagsdataSistePeriodeOvergangsstønad,
} from '../../TidligereVedtaksperioder/typer';
import SistePeriodeMedOvergangsstønad from './SistePeriodeMedOvergangsstønad';
import { Behandling } from '../../../../App/typer/fagsak';
import { Heading, Table } from '@navikt/ds-react';
import { behandlingOgTilbakekrevingsårsakTilTekst } from '../../../../App/typer/behandlingsårsak';

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

    const perioderMedOvergangsstønadOgInntekt:
        | IGrunnlagsdataPerioderOvergangsstønadOgInntekt[]
        | undefined = grunnlag.tidligereVedtaksperioder.sak?.perioderMedOvergangsstønadOgInntekt;

    const toNyestePerioderMedOvergangsstønadOgInntekt =
        perioderMedOvergangsstønadOgInntekt && perioderMedOvergangsstønadOgInntekt.slice(0, 2);

    const finnesPerioderMedOvergangsstønadOgInntektMedInnhold =
        perioderMedOvergangsstønadOgInntekt?.some((periode) => periode.behandlingsårsak) ?? false;

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

            {finnesPerioderMedOvergangsstønadOgInntektMedInnhold &&
            perioderMedOvergangsstønadOgInntekt ? (
                <>
                    <Heading level="1" size="small">
                        Perioder med overgangsstønad
                    </Heading>

                    <Table size="small">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Inntekt</Table.HeaderCell>
                                <Table.HeaderCell scope="col">Behandlingsårsak</Table.HeaderCell>
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
                                            <Table.DataCell>{inntekt}</Table.DataCell>
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
                </>
            ) : (
                <SistePeriodeMedOvergangsstønad
                    sistePeriodeMedOS={sistePeriodeMedOS}
                    behandling={behandling}
                />
            )}
        </Container>
    );
};
