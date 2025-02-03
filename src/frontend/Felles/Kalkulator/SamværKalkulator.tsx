import React, { ChangeEvent, useState } from 'react';
import {
    BodyShort,
    Button,
    Checkbox,
    CheckboxGroup,
    Heading,
    HStack,
    Label,
    Select,
    VStack,
} from '@navikt/ds-react';
import styled from 'styled-components';
import { ABorderDivider, ASurfaceInfoSubtle } from '@navikt/ds-tokens/dist/tokens';
import { TrashIcon } from '@navikt/aksel-icons';

const Div = styled.div`
    height: 1.25rem;
`;

const Valgmuligheter = styled(VStack)`
    margin-right: 0.5rem;
`;

const StyledSelect = styled(Select)`
    width: 10rem;
`;

const SelectContainer = styled(HStack)`
    padding: 1rem 1.5rem 1.5rem 1.5rem;
    background: ${ASurfaceInfoSubtle};
`;

const OppsummeringContainer = styled.div`
    padding: 1rem 1.5rem 1.5rem 1.5rem;
    background: ${ASurfaceInfoSubtle};
`;

const UkeContainer = styled(HStack)<{ $border: boolean }>`
    border-right: ${(props) => props.$border && `2px solid ${ABorderDivider}`};
    margin-bottom: 2rem;
`;

const CheckboxGruppe = styled(CheckboxGroup)`
    width: 2.5rem;
`;

const IkonKnapp = styled(Button)`
    height: fit-content;
`;

interface Props {
    className?: string;
    onClose?: () => void;
}

export const SamværKalkulator: React.FC<Props> = ({ className, onClose }) => {
    const [samværsandelerPerUke, settSamværsandelerPerUke] = useState<number[][]>(
        initierSamværState(2)
    );

    const oppdaterSamværsandeler = (uke: number, dag: number, samvær: number) => {
        settSamværsandelerPerUke((prevState) => [
            ...prevState.slice(0, uke),
            [...prevState[uke].slice(0, dag), samvær, ...prevState[uke].slice(dag + 1)],
            ...prevState.slice(uke + 1),
        ]);
    };

    const oppdaterBeregningsperiode = (periode: number) => {
        const antallUkerForNåværendeBeregningsperiode = samværsandelerPerUke.length;
        const antallUkerForNyBeregningsperiode = periode;

        if (antallUkerForNyBeregningsperiode > antallUkerForNåværendeBeregningsperiode) {
            settSamværsandelerPerUke((prevState) => [
                ...prevState.slice(0, antallUkerForNåværendeBeregningsperiode),
                ...new Array(
                    antallUkerForNyBeregningsperiode - antallUkerForNåværendeBeregningsperiode
                )
                    .fill(0)
                    .map((): number[] => new Array(7).fill(0)),
            ]);
        } else {
            settSamværsandelerPerUke((prevState) => [
                ...prevState.slice(0, antallUkerForNyBeregningsperiode),
            ]);
        }
    };

    return (
        <VStack className={className} gap="4">
            <BeregningslengdeSelect
                oppdaterBeregningsperiode={oppdaterBeregningsperiode}
                onClose={onClose}
            />
            <HStack gap="4">
                {samværsandelerPerUke.map((ukeSamvær, index) => (
                    <Uke
                        key={index}
                        index={index}
                        ukeSamvær={ukeSamvær}
                        oppdaterSamværState={(dag: number, samvær: number) =>
                            oppdaterSamværsandeler(index, dag, samvær)
                        }
                        visValgmuligheter={index % 4 === 0}
                    />
                ))}
            </HStack>
            <Oppsummering samværsandelerPerUke={samværsandelerPerUke} />
        </VStack>
    );
};

const Uke: React.FC<{
    ukeSamvær: number[];
    index: number;
    oppdaterSamværState: (uke: number, samvær: number) => void;
    visValgmuligheter: boolean;
}> = ({ ukeSamvær, index, oppdaterSamværState, visValgmuligheter }) => {
    return (
        <UkeContainer gap="1" $border={(index + 1) % 4 !== 0}>
            {visValgmuligheter && (
                <Valgmuligheter gap="6">
                    <Div />
                    {valgmuligheter.map((valgmulighet) => (
                        <Label key={valgmulighet.label}>{valgmulighet.label}</Label>
                    ))}
                </Valgmuligheter>
            )}
            {ukeSamvær.map((_, index) => {
                const ukedag = UKEDAGER[index];

                return (
                    <Ukedag
                        key={ukedag + index}
                        identifier={ukedag + index}
                        ukedag={ukedag}
                        oppdaterSamværState={(samvær: number) => oppdaterSamværState(index, samvær)}
                    />
                );
            })}
        </UkeContainer>
    );
};

const Ukedag: React.FC<{
    identifier: string;
    ukedag: string;
    oppdaterSamværState: (samvær: number) => void;
}> = ({ ukedag, identifier, oppdaterSamværState }) => {
    const oppdaterSamvær = (samvær: { id: number; value: number }[]) => {
        const samværForUkedag = utledSamværForUkedag(samvær);
        oppdaterSamværState(samværForUkedag);
    };

    return (
        <VStack>
            <CheckboxGruppe legend={ukedag} onChange={oppdaterSamvær}>
                {valgmuligheter.map((valgOption, index) => (
                    <Checkbox key={identifier + index} value={valgOption.value}>
                        {''}
                    </Checkbox>
                ))}
            </CheckboxGruppe>
        </VStack>
    );
};

const BeregningslengdeSelect: React.FC<{
    oppdaterBeregningsperiode: (periode: number) => void;
    onClose?: () => void;
}> = ({ oppdaterBeregningsperiode, onClose }) => (
    <SelectContainer justify="space-between">
        <StyledSelect
            label="Beregningslengde"
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                oppdaterBeregningsperiode(Number(event.target.value))
            }
        >
            {SAMVÆRSPERIODELENGDER.map((periodelengde) => (
                <option key={periodelengde} value={periodelengde}>
                    {periodelengde === 1 ? `${periodelengde} uke` : `${periodelengde} uker`}
                </option>
            ))}
        </StyledSelect>
        {onClose && <IkonKnapp icon={<TrashIcon />} onClick={onClose} />}
    </SelectContainer>
);

const Oppsummering: React.FC<{ samværsandelerPerUke: number[][] }> = ({ samværsandelerPerUke }) => {
    const summertSamvær = samværsandelerPerUke
        .flatMap((andeler) => andeler)
        .reduce((acc, andel) => acc + andel);

    const maksimalSamværsandel = samværsandelerPerUke.length * 7 * 8;

    const antallHeleDagerMedSamvær = Math.floor(summertSamvær / 8);

    const rest = summertSamvær % 8;
    const restSuffix = rest === 0 ? '' : '/8';

    const prosentandel = summertSamvær / maksimalSamværsandel;

    const visningstekstAntallDager = `${antallHeleDagerMedSamvær} dager og ${rest}${restSuffix} deler`;
    const visningstekstProsentandel = `${Math.round(prosentandel * 1000) / 10}%`;

    return (
        <OppsummeringContainer>
            <Heading size="medium">Total:</Heading>
            <BodyShort size="large">{visningstekstAntallDager}</BodyShort>
            <BodyShort size="large">{visningstekstProsentandel}</BodyShort>
        </OppsummeringContainer>
    );
};

const utledSamværForUkedag = (verdier: { id: number; value: number }[]): number => {
    if (verdier.length === 0) {
        return 0;
    }
    return verdier.map((verdi) => Number(verdi.value)).reduce((acc, verdi) => acc + verdi);
};

const initierSamværState = (antallUker: number): number[][] =>
    new Array(antallUker).fill(0).map((): number[] => new Array(7).fill(0));

const SAMVÆRSPERIODELENGDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

const UKEDAGER = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

const valgmuligheter = [
    { label: 'Kveld/natt (4/8)', value: { id: 4, value: 4 } },
    { label: 'Morgen før bhg/skole (1/8)', value: { id: 1, value: 1 } },
    { label: 'Tiden i bhg/skole (2/8)', value: { id: 2, value: 2 } },
    { label: 'Ettermiddag etter bhg/skole (1/8)', value: { id: 3, value: 1 } },
];
