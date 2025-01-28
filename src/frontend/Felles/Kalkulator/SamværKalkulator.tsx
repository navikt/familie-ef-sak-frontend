import React, { ChangeEvent, SetStateAction, useState } from 'react';
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
import { ASurfaceInfoSubtle } from '@navikt/ds-tokens/dist/tokens';

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

const StyledSelect = styled(Select)`
    width: 10rem;
`;

const BeregningslengdeContainer = styled.div`
    padding: 1rem 1.5rem 1.5rem 1.5rem;
    background: ${ASurfaceInfoSubtle};
`;

export const SamværKalkulator: React.FC = () => {
    const [samværsandelerPerUke, settSamværsandelerPerUke] = useState<number[][]>(
        initierSamværState(Beregningsperiode.TO_UKER)
    );

    const oppdaterSamværsandeler = (uke: number, dag: number, samvær: number) => {
        settSamværsandelerPerUke((prevState) => [
            ...prevState.slice(0, uke),
            [...prevState[uke].slice(0, dag), samvær, ...prevState[uke].slice(dag + 1)],
            ...prevState.slice(uke + 1),
        ]);
    };

    return (
        <VStack gap="2">
            <BeregningslengdeSelect settSamværsandeler={settSamværsandelerPerUke} />
            <HStack gap="4">
                {samværsandelerPerUke.map((ukeSamvær, index) => (
                    <Uke
                        key={index}
                        ukeSamvær={ukeSamvær}
                        oppdaterSamværState={(dag: number, samvær: number) =>
                            oppdaterSamværsandeler(index, dag, samvær)
                        }
                        visValgmuligheter={index % 4 === 0}
                    />
                ))}
            </HStack>
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

const BeregningslengdeSelect: React.FC<{
    settSamværsandeler: (andeler: SetStateAction<number[][]>) => void;
}> = ({ settSamværsandeler }) => (
    <BeregningslengdeContainer>
        <StyledSelect
            label="Beregningslengde"
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                settSamværsandeler(initierSamværState(event.target.value as Beregningsperiode))
            }
        >
            {Object.values(Beregningsperiode).map((samværsperiode) => (
                <option key={samværsperiode} value={samværsperiode}>
                    {samværsperiodeTilTekst[samværsperiode]}
                </option>
            ))}
        </StyledSelect>
    </BeregningslengdeContainer>
);

const utledSamværForUkedag = (verdier: { id: number; value: number }[]): number => {
    if (verdier.length === 0) {
        return 0;
    }
    return verdier.map((verdi) => Number(verdi.value)).reduce((acc, verdi) => acc + verdi);
};

enum Beregningsperiode {
    TO_UKER = 'TO_UKER',
    FIRE_UKER = 'FIRE_UKER',
    SEKS_UKER = 'SEKS_UKER',
    ÅTTE_UKER = 'ÅTTE_UKER',
    TOLV_UKER = 'TOLV_UKER',
}

const initierSamværState = (periode: Beregningsperiode): number[][] => {
    const antallUker = samværsperiodeTilAntallUker[periode];
    return new Array(antallUker).fill(0).map((): number[] => new Array(7).fill(0));
};

const samværsperiodeTilAntallUker: Record<Beregningsperiode, number> = {
    TO_UKER: 2,
    FIRE_UKER: 4,
    SEKS_UKER: 6,
    ÅTTE_UKER: 8,
    TOLV_UKER: 12,
};

const samværsperiodeTilTekst: Record<Beregningsperiode, string> = {
    TO_UKER: '2 uker',
    FIRE_UKER: '4 uker',
    SEKS_UKER: '6 uker',
    ÅTTE_UKER: '8 uker',
    TOLV_UKER: '12 uker',
};

const ukedager = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

const valgmuligheter = [
    { label: 'Morgen før bhg/skole (1/8)', value: { id: 1, value: 1 } },
    { label: 'Tiden i bhg/skole (2/8)', value: { id: 2, value: 2 } },
    { label: 'Ettermiddag etter bhg/skole (1/8)', value: { id: 3, value: 1 } },
    { label: 'Kveld/natt (4/8)', value: { id: 4, value: 4 } },
];
