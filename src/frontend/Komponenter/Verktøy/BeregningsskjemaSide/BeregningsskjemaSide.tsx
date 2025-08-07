import { Button, HStack, Table, Tag, TextField, VStack } from '@navikt/ds-react';
import React, { useState } from 'react';
import DatePickerMedTittel from './DatePickerMedTittel';
import { PlusIcon } from '@navikt/aksel-icons';
import { formaterTallMedTusenSkille } from '../../../App/utils/formatter';

enum TiProsentAvvik {
    INGEN_VERDI = '',
    OPP = '10% avvik opp',
    NED = '10% avvik ned',
    NEI = 'Ikke 10% avvik',
    UNDER_HALV_G = 'Under halv G',
}

type Beregning = {
    periode: {
        årstall: string;
        måned: string;
    };
    arbeidsgivere: { navn: string; verdi: number }[];
    årslønn: number;
    redusertEtter: number;
    avvik: TiProsentAvvik;
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

    const finnTiProsentAvvik = (beregning: Beregning): TiProsentAvvik => {
        const GRUNNBELØP = 130160; // Grunnbeløp for 2025
        const { årslønn, redusertEtter } = beregning;

        if (årslønn < redusertEtter && årslønn < redusertEtter * 0.9) {
            return TiProsentAvvik.NED;
        } else if (
            årslønn > GRUNNBELØP / 2 &&
            årslønn > redusertEtter &&
            årslønn > redusertEtter * 1.1
        ) {
            return TiProsentAvvik.OPP;
        } else if (
            årslønn < GRUNNBELØP / 2 &&
            årslønn > redusertEtter &&
            årslønn > redusertEtter * 1.1
        ) {
            return TiProsentAvvik.UNDER_HALV_G;
        } else {
            return TiProsentAvvik.NEI;
        }
    };

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
            });
        }

        settBeregninger(nyeBeregninger);
    };

    const oppdaterArbeidsgiver = (
        beregningIndex: number,
        arbeidsgiverIndex: number,
        nyVerdi: number
    ) => {
        settBeregninger((prev) =>
            prev.map((beregning, bIndex) =>
                bIndex === beregningIndex
                    ? {
                          ...beregning,
                          arbeidsgivere: beregning.arbeidsgivere.map((ag, agIndex) =>
                              agIndex === arbeidsgiverIndex ? { ...ag, verdi: nyVerdi } : ag
                          ),
                          årslønn: oppdaterÅrslønn(beregning, arbeidsgiverIndex, nyVerdi),
                      }
                    : beregning
            )
        );
    };

    const oppdaterÅrslønn = (beregning: Beregning, arbeidsgiverIndex: number, nyVerdi: number) => {
        return rundTilNærmesteTusen(
            beregning.arbeidsgivere
                .map((ag, agIndex) => (agIndex === arbeidsgiverIndex ? nyVerdi : ag.verdi))
                .reduce((sum, verdi) => sum + verdi, 0) * 12
        );
    };

    const rundTilNærmesteTusen = (årslønn: number): number => {
        return Math.round(årslønn / 1000) * 1000;
    };

    const oppdaterRedusertEtter = (beregningIndex: number, nyVerdi: number) => {
        settBeregninger((prev) =>
            prev.map((beregning, bIndex) =>
                bIndex === beregningIndex ? { ...beregning, redusertEtter: nyVerdi } : beregning
            )
        );
        oppdaterTiProsentAvvik(beregningIndex);
    };

    const oppdaterTiProsentAvvik = (beregningIndex: number) => {
        settBeregninger((prev) =>
            prev.map((beregning, bIndex) =>
                bIndex === beregningIndex
                    ? {
                          ...beregning,
                          avvik: finnTiProsentAvvik(beregning),
                      }
                    : beregning
            )
        );
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
                                    <Table.HeaderCell scope="col">Årstall</Table.HeaderCell>
                                    <Table.HeaderCell scope="col">Måned</Table.HeaderCell>

                                    <LagArbeidsgivereKolonner beregninger={beregninger} />

                                    <Table.HeaderCell scope="col">
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
                                {beregninger.map((beregning, beregningIndex) => (
                                    <Table.Row
                                        key={`${beregning.periode.årstall}-${beregning.periode.måned}`}
                                    >
                                        <Table.DataCell>{beregning.periode.årstall}</Table.DataCell>
                                        <Table.DataCell>{beregning.periode.måned}</Table.DataCell>

                                        <LagArbeidsgivereRader
                                            beregninger={beregninger}
                                            beregning={beregning}
                                            beregningIndex={beregningIndex}
                                            oppdaterArbeidsgiver={oppdaterArbeidsgiver}
                                        />

                                        <Table.DataCell></Table.DataCell>
                                        <Table.DataCell>
                                            {formaterTallMedTusenSkille(beregning.årslønn)}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            <TextField
                                                label="Redusert etter"
                                                hideLabel
                                                value={beregning.redusertEtter}
                                                onChange={(e) =>
                                                    oppdaterRedusertEtter(
                                                        beregningIndex,
                                                        Number(e.target.value) || 0
                                                    )
                                                }
                                                size="small"
                                                placeholder="0"
                                            />
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
                (_, index) => (
                    <Table.HeaderCell key={index} scope="col">
                        Arbeidsgiver {index + 1}
                    </Table.HeaderCell>
                )
            )}
        </>
    );
};

const LagArbeidsgivereRader: React.FC<{
    beregninger: Beregning[];
    beregning: Beregning;
    beregningIndex: number;
    oppdaterArbeidsgiver: (
        beregningIndex: number,
        arbeidsgiverIndex: number,
        nyVerdi: number
    ) => void;
}> = ({ beregninger, beregning, beregningIndex, oppdaterArbeidsgiver }) => {
    return (
        <>
            {Array.from(
                {
                    length: Math.max(
                        ...beregninger.map((beregning) => beregning.arbeidsgivere.length)
                    ),
                },
                (_, agIndex) => {
                    const arbeidsgivere = beregning.arbeidsgivere[agIndex];

                    return (
                        <Table.DataCell key={agIndex}>
                            <VStack gap="1">
                                <TextField
                                    label={`Arbeidsgiver ${agIndex + 1}`}
                                    hideLabel
                                    value={arbeidsgivere.verdi}
                                    onChange={(e) =>
                                        oppdaterArbeidsgiver(
                                            beregningIndex,
                                            agIndex,
                                            Number(e.target.value) || 0
                                        )
                                    }
                                    size="small"
                                    placeholder="0"
                                />
                            </VStack>
                        </Table.DataCell>
                    );
                }
            )}
        </>
    );
};
