import { Button, Heading, HStack, Table, Tag, TextField, VStack } from '@navikt/ds-react';
import React, { useState } from 'react';
import DatePickerMedTittel from './DatePickerMedTittel';
import { PlusIcon } from '@navikt/aksel-icons';
import { formaterTallMedTusenSkille } from '../../../App/utils/formatter';
import {
    finnAvvik,
    lagBeregninger,
    mapMånedTallTilNavn,
    oppdaterBeregnetfra,
    oppdaterÅrslønn,
    regnUtFeilutbetaling,
    regnUtHarMottatt,
    regnUtNyBeregning,
} from './utils';
import { KopierNedKnapp } from './KopierNedKnapp';
import { Periode, Beregninger, AvvikEnum, Beregning } from './typer';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';
import TabellGjennomsnitt from './TabellGjennomsnitt';
import { SlettKolonneKnapp } from './SlettKolonneKnapp';

const tomPeriode: Periode = {
    fra: {
        årstall: '',
        måned: '',
    },
    til: {
        årstall: '',
        måned: '',
    },
};

export const BeregningsskjemaSide: React.FC = () => {
    const [beregninger, settBeregninger] = useState<Beregninger>([]);
    const [periode, settPeriode] = useState<Periode>(tomPeriode);
    const { toggles } = useToggles();

    const erTogglet = toggles[ToggleName.visBeregningsskjema] || false;

    const handleLagBeregninger = (periode: Periode) => {
        settBeregninger([]);
        const nyeBeregninger = lagBeregninger(periode);
        settBeregninger(nyeBeregninger);
    };

    const oppdaterArbeidsgiver = (
        beregningIndeks: number,
        arbeidsgiverIndeks: number,
        nyVerdi: number
    ) => {
        settBeregninger((prev) => {
            const oppdatert = prev.map((beregning, bIndeks) =>
                bIndeks === beregningIndeks
                    ? {
                          ...beregning,
                          arbeidsgivere: beregning.arbeidsgivere.map((ag, agIndeks) =>
                              agIndeks === arbeidsgiverIndeks ? { ...ag, verdi: nyVerdi } : ag
                          ),
                          årslønn: oppdaterÅrslønn(beregning, arbeidsgiverIndeks, nyVerdi),
                      }
                    : beregning
            );

            const oppdatertAvvik: Beregning[] = oppdatert.map((beregning) => ({
                ...beregning,
                avvik: finnAvvik(beregning),
            }));

            const oppdatertBeregnetFra = oppdaterBeregnetfra(oppdatertAvvik);

            return oppdatertBeregnetFra;
        });
    };

    const oppdaterRedusertEtter = (beregningIndeks: number, nyVerdi: number) => {
        settBeregninger((prev) => {
            const oppdatertRedusertEtter = prev.map((beregning, bIndeks) =>
                bIndeks === beregningIndeks ? { ...beregning, redusertEtter: nyVerdi } : beregning
            );

            const oppdatertAvvik: Beregning[] = oppdatertRedusertEtter.map((beregning) => ({
                ...beregning,
                avvik: finnAvvik(beregning),
            }));

            const oppdatertBeregnetFra = oppdaterBeregnetfra(oppdatertAvvik);

            return oppdatertBeregnetFra;
        });
    };

    const leggTilArbeidsgiver = () => {
        settBeregninger((prev) =>
            prev.map((beregning) => ({
                ...beregning,
                arbeidsgivere: [
                    ...beregning.arbeidsgivere,
                    {
                        navn: `Arbeidsgiver ${beregning.arbeidsgivere.length + 1}`,
                        verdi: 0,
                    },
                ],
            }))
        );
    };

    const kopierRedusertEtterTilBeregningerUnder = (beregningIndeks: number) => {
        const redusertEtterSomSkalKopieres = beregninger[beregningIndeks].redusertEtter;

        settBeregninger((prev) => {
            const oppdatertRedusertEtter = prev.map((beregning, idx) =>
                idx > beregningIndeks
                    ? { ...beregning, redusertEtter: redusertEtterSomSkalKopieres }
                    : beregning
            );

            const oppdatertAvvik: Beregning[] = oppdatertRedusertEtter.map((beregning) => ({
                ...beregning,
                avvik: finnAvvik(beregning),
            }));

            const oppdatertBeregnetFra: Beregning[] = oppdaterBeregnetfra(oppdatertAvvik);

            return oppdatertBeregnetFra;
        });
    };

    const slettKolonne = (arbeidsgiverIndeks: number) => {
        settBeregninger((prev) => {
            const oppdatertBeregninger = prev.map((beregning) => {
                if (beregning.arbeidsgivere.length <= arbeidsgiverIndeks) {
                    return beregning; // Indeksen finnes ikke, returner uendret
                }

                const nyeArbeidsgivere = beregning.arbeidsgivere.filter(
                    (_, idx) => idx !== arbeidsgiverIndeks
                );

                const nyÅrslønn = oppdaterÅrslønn(beregning, arbeidsgiverIndeks, 0);

                return {
                    ...beregning,
                    arbeidsgivere: nyeArbeidsgivere,
                    årslønn: nyÅrslønn,
                };
            });

            const oppdatertAvvik: Beregning[] = oppdatertBeregninger.map((beregning) => ({
                ...beregning,
                avvik: finnAvvik(beregning),
            }));

            const oppdatertBeregnetFra = oppdaterBeregnetfra(oppdatertAvvik);

            return oppdatertBeregnetFra;
        });
    };

    if (erTogglet === false) {
        return (
            <Heading as="h1" size="medium">
                Ikke togglet på
            </Heading>
        );
    }

    return (
        <VStack gap="8">
            <HStack gap={'space-128'}>
                <DatePickerMedTittel
                    tittel="Periode"
                    periode={periode}
                    settPeriode={settPeriode}
                    lagBeregninger={handleLagBeregninger}
                />

                <TabellGjennomsnitt periode={periode} beregninger={beregninger} />
            </HStack>

            {beregninger.length > 0 && (
                <Table size="small">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell scope="col">Periode</Table.HeaderCell>

                            <ArbeidsgivereKolonner
                                beregninger={beregninger}
                                slettKolonne={slettKolonne}
                            />

                            <Table.HeaderCell
                                scope="col"
                                style={{ width: '1px', whiteSpace: 'nowrap' }}
                            >
                                <Button
                                    icon={<PlusIcon />}
                                    onClick={() => {
                                        leggTilArbeidsgiver();
                                    }}
                                    size="small"
                                    title="Legg til arbeidsgiver for alle perioder"
                                >
                                    Legg til
                                </Button>
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col">Årslønn</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Redusert etter</Table.HeaderCell>
                            <Table.HeaderCell scope="col">10% avvik i inntekt</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Ny beregning</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Har mottatt</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Feilutbetaling</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {beregninger.map((beregning, beregningIndeks) => (
                            <Table.Row
                                key={`${beregning.periode.årstall}-${beregning.periode.måned}`}
                                style={{
                                    backgroundColor: beregning.beregnetfra
                                        ? 'var(--a-gray-50)'
                                        : 'inherit',
                                }}
                            >
                                <Table.DataCell>
                                    {`${mapMånedTallTilNavn(
                                        beregning.periode.måned
                                    )} ${beregning.periode.årstall}`}
                                    {beregning.beregnetfra && ' - Beregnet fra'}
                                </Table.DataCell>

                                <ArbeidsgivereRader
                                    beregninger={beregninger}
                                    beregning={beregning}
                                    beregningIndeks={beregningIndeks}
                                    oppdaterArbeidsgiver={oppdaterArbeidsgiver}
                                />

                                <Table.DataCell></Table.DataCell>
                                <Table.DataCell>
                                    {formaterTallMedTusenSkille(beregning.årslønn)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    <HStack gap="2">
                                        <TextField
                                            label="Redusert etter"
                                            hideLabel
                                            value={beregning.redusertEtter}
                                            onChange={(e) =>
                                                oppdaterRedusertEtter(
                                                    beregningIndeks,
                                                    Number(e.target.value) || 0
                                                )
                                            }
                                            size="small"
                                            placeholder="0"
                                        />
                                        {beregningIndeks < beregninger.length - 1 && (
                                            <KopierNedKnapp
                                                beregningIndeks={beregningIndeks}
                                                kopierRedusertEtterTilBeregningerUnder={
                                                    kopierRedusertEtterTilBeregningerUnder
                                                }
                                            />
                                        )}
                                    </HStack>
                                </Table.DataCell>
                                <Table.DataCell>
                                    {utledAvvikTag(finnAvvik(beregning))}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {formaterTallMedTusenSkille(regnUtNyBeregning(beregning))}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {formaterTallMedTusenSkille(regnUtHarMottatt(beregning))}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {utledFeilutbetalingTag(regnUtFeilutbetaling(beregning))}
                                </Table.DataCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            )}
        </VStack>
    );
};

const ArbeidsgivereKolonner: React.FC<{
    beregninger: Beregning[];
    slettKolonne: (arbeidsgiverIndeks: number) => void;
}> = ({ beregninger, slettKolonne }) => {
    const erFørsteKolonne = (indeks: number) => indeks === 0;
    return (
        <>
            {Array.from(
                {
                    length: Math.max(
                        ...beregninger.map((beregning) => beregning.arbeidsgivere.length)
                    ),
                },
                (_, indeks) => (
                    <Table.HeaderCell key={indeks} scope="col">
                        <HStack align={'center'} gap="2" style={{ margin: '0' }}>
                            <TextField
                                style={{
                                    marginTop: '-0.5rem', // TextField er ikke sentrert
                                }}
                                size="small"
                                label={undefined}
                                placeholder={`Arbeidsgiver ${indeks + 1}`}
                            />

                            {!erFørsteKolonne(indeks) && (
                                <SlettKolonneKnapp
                                    arbeidsgiverIndeks={indeks}
                                    slettKolonne={slettKolonne}
                                />
                            )}
                        </HStack>
                    </Table.HeaderCell>
                )
            )}
        </>
    );
};

const ArbeidsgivereRader: React.FC<{
    beregninger: Beregning[];
    beregning: Beregning;
    beregningIndeks: number;
    oppdaterArbeidsgiver: (
        beregningIndeks: number,
        arbeidsgiverIndeks: number,
        nyVerdi: number
    ) => void;
}> = ({ beregninger, beregning, beregningIndeks, oppdaterArbeidsgiver }) => {
    return (
        <>
            {Array.from(
                {
                    length: Math.max(
                        ...beregninger.map((beregning) => beregning.arbeidsgivere.length)
                    ),
                },
                (_, agIndeks) => {
                    const arbeidsgivere = beregning.arbeidsgivere[agIndeks];

                    return (
                        <Table.DataCell key={agIndeks}>
                            <HStack gap="2">
                                <TextField
                                    label={`Arbeidsgiver ${agIndeks + 1}`}
                                    hideLabel
                                    value={arbeidsgivere.verdi}
                                    onChange={(e) =>
                                        oppdaterArbeidsgiver(
                                            beregningIndeks,
                                            agIndeks,
                                            Number(e.target.value) || 0
                                        )
                                    }
                                    size="small"
                                    placeholder="0"
                                />
                            </HStack>
                        </Table.DataCell>
                    );
                }
            )}
        </>
    );
};

export const utledAvvikTag = (avvik: AvvikEnum) => {
    switch (avvik) {
        case AvvikEnum.OPP:
            return <Tag variant="error">{avvik}</Tag>;
        case AvvikEnum.NED:
            return <Tag variant="info">{avvik}</Tag>;
        case AvvikEnum.UNDER_HALV_G:
            return <Tag variant="alt2">{avvik}</Tag>;
        case AvvikEnum.NEI:
            return <Tag variant="neutral">{avvik}</Tag>;
        default:
            return <Tag variant="neutral">UKJENT</Tag>;
    }
};

const utledFeilutbetalingTag = (feilutbetaling: number) => {
    if (feilutbetaling > 0) {
        return <Tag variant="error-moderate">{formaterTallMedTusenSkille(feilutbetaling)}</Tag>;
    } else if (feilutbetaling < 0) {
        return <Tag variant="info-moderate">{formaterTallMedTusenSkille(feilutbetaling)}</Tag>;
    } else {
        return <Tag variant="neutral-moderate">{formaterTallMedTusenSkille(feilutbetaling)}</Tag>;
    }
};
