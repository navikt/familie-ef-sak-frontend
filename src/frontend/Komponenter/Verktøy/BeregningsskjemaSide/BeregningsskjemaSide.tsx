import { Button, HStack, Table, Tag, TextField, VStack } from '@navikt/ds-react';
import React, { useState } from 'react';
import DatePickerMedTittel from './DatePickerMedTittel';
import { PlusIcon } from '@navikt/aksel-icons';
import {
    formaterStrengMedStorForbokstav,
    formaterTallMedTusenSkille,
} from '../../../App/utils/formatter';
import { finnTiProsentAvvik, lagBeregninger, oppdaterBeregnetfra, oppdaterÅrslønn } from './utils';
import { KopierNedKnapp } from './KopierNedKnapp';
import { Periode, Beregninger, TiProsentAvvik, Beregning } from './typer';

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

const initialBeregninger: Beregninger = [];

export const BeregningsskjemaSide: React.FC = () => {
    const [beregninger, settBeregninger] = useState<Beregninger>(initialBeregninger);
    const [periode, settPeriode] = useState<Periode>(tomPeriode);

    const tiProsentAvvikTilTag = (avvik: TiProsentAvvik) => {
        switch (avvik) {
            case TiProsentAvvik.OPP:
                return <Tag variant="error">{avvik}</Tag>;
            case TiProsentAvvik.NED:
                return <Tag variant="info">{avvik}</Tag>;
            case TiProsentAvvik.UNDER_HALV_G:
                return <Tag variant="alt2">{avvik}</Tag>;
            case TiProsentAvvik.NEI:
                return <Tag variant="neutral">{avvik}</Tag>;
            default:
                return <Tag variant="neutral">UKJENT</Tag>;
        }
    };

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
                avvik: finnTiProsentAvvik(beregning),
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
                avvik: finnTiProsentAvvik(beregning),
            }));

            const oppdatertBeregnetFra = oppdaterBeregnetfra(oppdatertAvvik);

            return oppdatertBeregnetFra;
        });
    };

    const handleLeggTilArbeidsgiver = () => {
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
                avvik: finnTiProsentAvvik(beregning),
            }));

            const oppdatertBeregnetFra: Beregning[] = oppdaterBeregnetfra(oppdatertAvvik);

            return oppdatertBeregnetFra;
        });
    };

    return (
        <VStack gap="8">
            <HStack gap={'8'}>
                <DatePickerMedTittel
                    tittel="Periode"
                    periode={periode}
                    settPeriode={settPeriode}
                    lagBeregninger={handleLagBeregninger}
                />
            </HStack>

            {beregninger.length > 0 && (
                <Table size="small">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell scope="col">Periode</Table.HeaderCell>

                            <LagArbeidsgivereKolonner beregninger={beregninger} />

                            <Table.HeaderCell
                                scope="col"
                                style={{ width: '1px', whiteSpace: 'nowrap' }}
                            >
                                <Button
                                    icon={<PlusIcon />}
                                    onClick={() => {
                                        handleLeggTilArbeidsgiver();
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
                                    {`${formaterStrengMedStorForbokstav(
                                        beregning.periode.måned
                                    )} ${beregning.periode.årstall}`}
                                    {beregning.beregnetfra && ' - Beregnet fra'}
                                </Table.DataCell>

                                <LagArbeidsgivereRader
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
                                    {tiProsentAvvikTilTag(finnTiProsentAvvik(beregning))}
                                </Table.DataCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            )}
        </VStack>
    );
};

const LagArbeidsgivereKolonner: React.FC<{ beregninger: Beregning[] }> = ({ beregninger }) => {
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
                        Arbeidsgiver {indeks + 1}
                    </Table.HeaderCell>
                )
            )}
        </>
    );
};

const LagArbeidsgivereRader: React.FC<{
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
