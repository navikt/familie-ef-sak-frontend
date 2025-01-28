import React, { ChangeEvent, useState } from 'react';
import {
    BodyShort,
    Checkbox,
    CheckboxGroup,
    HStack,
    Label,
    Select,
    VStack,
} from '@navikt/ds-react';
import styled from 'styled-components';

const Div = styled.div`
    height: 1.25rem;
`;

const Filler = styled.div`
    height: 1.5rem;
`;

const Flexbox = styled.div`
    display: flex;
    justify-self: center;
    width: 2.5rem;
`;

const Valgmuligheter = styled(VStack)`
    margin-right: 2rem;
`;

const PeriodeSelect = styled(Select)`
    width: 10rem;
`;

interface SamværState {
    periode: Samværsperiode;
    periodeSamvær: number[][];
}

export const SamværKalkulator: React.FC = () => {
    const [samværState, settSamværState] = useState<SamværState>(
        initierSamværState(Samværsperiode.TO_UKER)
    );

    const oppdaterSamværState = (uke: number, dag: number, samvær: number) => {
        settSamværState((prevState) => {
            return {
                ...prevState,
                periodeSamvær: [
                    ...prevState.periodeSamvær.slice(0, uke),
                    [
                        ...prevState.periodeSamvær[uke].slice(0, dag),
                        samvær,
                        ...prevState.periodeSamvær[uke].slice(dag + 1),
                    ],
                    ...prevState.periodeSamvær.slice(uke + 1),
                ],
            };
        });
    };

    return (
        <VStack gap="2">
            <PeriodeSelect
                label="Velg periode"
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    settSamværState(initierSamværState(event.target.value as Samværsperiode))
                }
            >
                {Object.values(Samværsperiode).map((samværsperiode) => (
                    <option key={samværsperiode} value={samværsperiode}>
                        {samværsperiodeTilTekst[samværsperiode]}
                    </option>
                ))}
            </PeriodeSelect>
            {samværState.periodeSamvær.map((ukeSamvær, index) => (
                <Uke
                    key={index}
                    ukeSamvær={ukeSamvær}
                    oppdaterSamværState={(dag: number, samvær: number) =>
                        oppdaterSamværState(index, dag, samvær)
                    }
                    visValgmuligheter={true}
                />
            ))}
        </VStack>
    );
};

const Uke: React.FC<{
    ukeSamvær: number[];
    oppdaterSamværState: (uke: number, samvær: number) => void;
    visValgmuligheter: boolean;
}> = ({ ukeSamvær, oppdaterSamværState, visValgmuligheter }) => {
    return (
        <HStack gap="2">
            {visValgmuligheter && (
                <Valgmuligheter gap="6">
                    <Div />
                    {valgmuligheter.map((valgmulighet) => (
                        <Label key={valgmulighet.label}>{valgmulighet.label}</Label>
                    ))}
                </Valgmuligheter>
            )}
            {ukeSamvær.map((dagSamvær, index) => {
                const ukedag = ukedager[index];

                return (
                    <Ukedag
                        key={ukedag + index}
                        identifier={ukedag + index}
                        dagSamvær={dagSamvær}
                        ukedag={ukedag}
                        oppdaterSamværState={(samvær: number) => oppdaterSamværState(index, samvær)}
                    />
                );
            })}
        </HStack>
    );
};

const Ukedag: React.FC<{
    identifier: string;
    dagSamvær: number;
    ukedag: string;
    oppdaterSamværState: (samvær: number) => void;
}> = ({ dagSamvær, ukedag, identifier, oppdaterSamværState }) => {
    const oppdaterSamvær = (samvær: { id: number; value: number }[]) => {
        const samværForUkedag = utledSamværForUkedag(samvær);
        oppdaterSamværState(samværForUkedag);
    };

    return (
        <VStack>
            <CheckboxGroup legend={ukedag} onChange={oppdaterSamvær}>
                {valgmuligheter.map((valgOption, index) => (
                    <Checkbox key={identifier + index} value={valgOption.value}>
                        {''}
                    </Checkbox>
                ))}
            </CheckboxGroup>
            <Flexbox>{dagSamvær > 0 ? <BodyShort>{dagSamvær}</BodyShort> : <Filler />}</Flexbox>
        </VStack>
    );
};

const utledSamværForUkedag = (verdier: { id: number; value: number }[]): number => {
    if (verdier.length === 0) {
        return 0;
    }
    return verdier.map((verdi) => Number(verdi.value)).reduce((acc, verdi) => acc + verdi);
};

enum Samværsperiode {
    TO_UKER = 'TO_UKER',
    FIRE_UKER = 'FIRE_UKER',
    SEKS_UKER = 'SEKS_UKER',
    ÅTTE_UKER = 'ÅTTE_UKER',
    TOLV_UKER = 'TOLV_UKER',
}

const initierSamværState = (periode: Samværsperiode): SamværState => {
    const antallUker = samværsperiodeTilAntallUker[periode];
    return {
        periode: periode,
        periodeSamvær: new Array(antallUker).fill(0).map((): number[] => new Array(7).fill(0)),
    };
};

const samværsperiodeTilAntallUker: Record<Samværsperiode, number> = {
    TO_UKER: 2,
    FIRE_UKER: 4,
    SEKS_UKER: 6,
    ÅTTE_UKER: 8,
    TOLV_UKER: 12,
};

const samværsperiodeTilTekst: Record<Samværsperiode, string> = {
    TO_UKER: 'To uker',
    FIRE_UKER: 'Fire uker',
    SEKS_UKER: 'Seks uker',
    ÅTTE_UKER: 'Åtte uker',
    TOLV_UKER: 'Tolv uker',
};

const ukedager = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

const valgmuligheter = [
    { label: 'Morgen før bhg/skole (1/8)', value: { id: 1, value: 1 } },
    { label: 'Tiden i bhg/skole (2/8)', value: { id: 2, value: 2 } },
    { label: 'Ettermiddag etter bhg/skole (1/8)', value: { id: 3, value: 1 } },
    { label: 'Kveld/natt (4/8)', value: { id: 4, value: 4 } },
];
