import { Button, HStack, Table, Tag, TextField, VStack } from '@navikt/ds-react';
import React, { useState } from 'react';
import DatePickerMedTittel from './DatePickerMedTittel';
import { ArrowRedoIcon, PlusIcon } from '@navikt/aksel-icons';
import {
    formaterStrengMedStorForbokstav,
    formaterTallMedTusenSkille,
} from '../../../App/utils/formatter';
import { finnTiProsentAvvik, oppdaterBeregnetFra, oppdaterÅrslønn } from './utils';

export enum TiProsentAvvik {
    INGEN_VERDI = '',
    OPP = '10% avvik opp',
    NED = '10% avvik ned',
    NEI = 'Ikke 10% avvik',
    UNDER_HALV_G = 'Under halv G',
}

export type Beregning = {
    periode: {
        årstall: string;
        måned: string;
    };
    arbeidsgivere: { navn: string; verdi: number }[];
    årslønn: number;
    redusertEtter: number;
    avvik: TiProsentAvvik;
    beregnetfra: boolean;
};

type Beregninger = Beregning[];

const initialBeregninger: Beregninger = [];

export const BeregningsskjemaSide: React.FC = () => {
    const [beregninger, settBeregninger] = useState<Beregninger>(initialBeregninger);
    const [periode, settPeriode] = useState<{
        fra: { årstall: string; måned: string };
        til: { årstall: string; måned: string };
    }>({
        fra: {
            årstall: '',
            måned: '',
        },
        til: {
            årstall: '',
            måned: '',
        },
    });

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

    const lagBeregninger = (
        fra: {
            årstall: string;
            måned: string;
        },
        til: {
            årstall: string;
            måned: string;
        }
    ) => {
        if (!periode || !periode.fra.årstall || !periode.til.årstall) {
            return;
        }

        settBeregninger([]);

        const mapMåned: { [key: string]: number } = {
            januar: 1,
            februar: 2,
            mars: 3,
            april: 4,
            mai: 5,
            juni: 6,
            juli: 7,
            august: 8,
            september: 9,
            oktober: 10,
            november: 11,
            desember: 12,
        };

        const fraMåned = mapMåned[fra.måned.toLowerCase()] || 1;
        const tilMåned = mapMåned[til.måned.toLowerCase()] || 12;

        const fraÅr = parseInt(fra.årstall);
        const tilÅr = parseInt(til.årstall);

        const antallPerioder = (tilÅr - fraÅr) * 12 + (tilMåned - fraMåned) + 1;

        const nyeBeregninger: Beregninger = [];

        for (let i = 0; i < antallPerioder; i++) {
            const årstall = fraÅr + Math.floor((fraMåned - 1 + i) / 12);
            const månedNummer = ((fraMåned - 1 + i) % 12) + 1;

            const månedNavn =
                Object.keys(mapMåned).find((key) => mapMåned[key] === månedNummer) || 'januar';

            nyeBeregninger.push({
                periode: { årstall: årstall.toString(), måned: månedNavn },
                arbeidsgivere: [{ navn: `Arbeidsgiver ${i + 1}`, verdi: 0 }],
                årslønn: 0,
                redusertEtter: 0,
                avvik: TiProsentAvvik.INGEN_VERDI,
                beregnetfra: false,
            });
        }

        settBeregninger(nyeBeregninger);
    };

    const oppdaterArbeidsgiver = (
        beregningIndeks: number,
        arbeidsgiverIndeks: number,
        nyVerdi: number
    ) => {
        settBeregninger((prev) =>
            prev.map((beregning, bIndeks) =>
                bIndeks === beregningIndeks
                    ? {
                          ...beregning,
                          arbeidsgivere: beregning.arbeidsgivere.map((ag, agIndeks) =>
                              agIndeks === arbeidsgiverIndeks ? { ...ag, verdi: nyVerdi } : ag
                          ),
                          årslønn: oppdaterÅrslønn(beregning, arbeidsgiverIndeks, nyVerdi),
                      }
                    : beregning
            )
        );
    };

    const oppdaterRedusertEtter = (beregningIndeks: number, nyVerdi: number) => {
        settBeregninger((prev) => {
            const oppdatertRedusertEtter = prev.map((beregning, bIndeks) =>
                bIndeks === beregningIndeks ? { ...beregning, redusertEtter: nyVerdi } : beregning
            );

            const oppdatertAvvik = oppdatertRedusertEtter.map((beregning) => ({
                ...beregning,
                avvik: finnTiProsentAvvik(beregning),
            }));

            const oppdatertBeregnetFra = oppdaterBeregnetFra(
                oppdatertAvvik,
                oppdatertAvvik[beregningIndeks]
            );
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
        settBeregninger((prev) => {
            const redusertEtterSomSkalKopieres = prev[beregningIndeks].redusertEtter;

            return prev.map((beregning, indeks) => {
                if (indeks > beregningIndeks) {
                    return {
                        ...beregning,
                        redusertEtter: redusertEtterSomSkalKopieres,
                    };
                }
                return beregning;
            });
        });
    };

    const kopierArbeidsgiverTilBeregningerUnder = (
        beregningIndeks: number,
        arbeidsgiverIndeks: number
    ) => {
        settBeregninger((prev) => {
            const arbeidsgiverSomSkalKopieres =
                prev[beregningIndeks].arbeidsgivere[arbeidsgiverIndeks].verdi;

            return prev.map((beregning, indeks) => {
                const kopiArbeidsgivere = [...beregning.arbeidsgivere];
                if (indeks > beregningIndeks) {
                    kopiArbeidsgivere[arbeidsgiverIndeks] = {
                        ...kopiArbeidsgivere[arbeidsgiverIndeks],
                        verdi: arbeidsgiverSomSkalKopieres,
                    };

                    return {
                        ...beregning,
                        arbeidsgivere: kopiArbeidsgivere,
                        årslønn: oppdaterÅrslønn(
                            beregning,
                            arbeidsgiverIndeks,
                            arbeidsgiverSomSkalKopieres
                        ),
                    };
                }
                return beregning;
            });
        });
    };

    return (
        <>
            <VStack gap="8">
                <HStack gap={'8'}>
                    <DatePickerMedTittel
                        tittel="Periode"
                        periode={periode}
                        settPeriode={settPeriode}
                        lagBeregninger={lagBeregninger}
                    />
                </HStack>

                {beregninger.length > 0 && (
                    <div>
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
                                    <Table.HeaderCell scope="col">
                                        10% avvik i inntekt
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {beregninger.map((beregning, beregningIndeks) => (
                                    <Table.Row
                                        key={`${beregning.periode.årstall}-${beregning.periode.måned}`}
                                    >
                                        <Table.DataCell
                                            style={{
                                                backgroundColor: beregning.beregnetfra
                                                    ? 'yellow'
                                                    : '',
                                            }}
                                        >
                                            {`${formaterStrengMedStorForbokstav(
                                                beregning.periode.måned
                                            )} ${beregning.periode.årstall}`}
                                        </Table.DataCell>

                                        <LagArbeidsgivereRader
                                            beregninger={beregninger}
                                            beregning={beregning}
                                            beregningIndeks={beregningIndeks}
                                            oppdaterArbeidsgiver={oppdaterArbeidsgiver}
                                            kopierArbeidsgiverTilBeregningerUnder={
                                                kopierArbeidsgiverTilBeregningerUnder
                                            }
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
                                                    <Button
                                                        onClick={() =>
                                                            kopierRedusertEtterTilBeregningerUnder(
                                                                beregningIndeks
                                                            )
                                                        }
                                                        style={{
                                                            transform: 'rotate(90deg)',
                                                        }}
                                                        size="small"
                                                        icon={
                                                            <ArrowRedoIcon
                                                                title="kopier ned"
                                                                fontSize="1.5rem"
                                                            />
                                                        }
                                                        variant="tertiary-neutral"
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
                    </div>
                )}
            </VStack>
        </>
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
    kopierArbeidsgiverTilBeregningerUnder: (
        beregningIndeks: number,
        arbeidsgiverIndeks: number
    ) => void;
}> = ({
    beregninger,
    beregning,
    beregningIndeks,
    oppdaterArbeidsgiver,
    kopierArbeidsgiverTilBeregningerUnder,
}) => {
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
                                {beregningIndeks < beregninger.length - 1 && (
                                    <Button
                                        onClick={() =>
                                            kopierArbeidsgiverTilBeregningerUnder(
                                                beregningIndeks,
                                                agIndeks
                                            )
                                        }
                                        style={{
                                            transform: 'rotate(90deg)',
                                        }}
                                        size="small"
                                        icon={
                                            <ArrowRedoIcon title="kopier ned" fontSize="1.5rem" />
                                        }
                                        variant="tertiary-neutral"
                                    />
                                )}
                            </HStack>
                        </Table.DataCell>
                    );
                }
            )}
        </>
    );
};
