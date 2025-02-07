import React, { ChangeEvent } from 'react';
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
import {
    Samværsandel,
    samværsandelTilTekst,
    samværsandelTilVerdi,
    Samværsdag,
    Samværsuke,
} from '../../App/typer/samværsavtale';
import { formaterStrengMedStorForbokstav } from '../../App/utils/formatter';

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

const VARIGHETER_SAMVÆRSAVTALE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

interface Props {
    className?: string;
    onSave?: () => void;
    onClose?: () => void;
    onDelete?: () => void;
    samværsuker: Samværsuke[];
    oppdaterSamværsuke: (ukeIndex: number, ukedag: string, samversandeler: Samværsandel[]) => void;
    oppdaterVarighet: (varighet: number) => void;
}

export const Samværskalkulator: React.FC<Props> = ({
    className,
    onSave,
    samværsuker,
    oppdaterSamværsuke,
    oppdaterVarighet,
}) => (
    <VStack className={className} gap="4">
        <VarighetSelect oppdaterVarighet={oppdaterVarighet} onClose={onSave} />
        <HStack gap="4">
            {samværsuker.map((samværsuke, index) => (
                <Uke
                    key={index}
                    index={index}
                    samværsuke={samværsuke}
                    oppdaterSamværsdag={(dag: string, samværsandeler: Samværsandel[]) =>
                        oppdaterSamværsuke(index, dag, samværsandeler)
                    }
                    visValgmuligheter={index % 4 === 0}
                />
            ))}
        </HStack>
        <Oppsummering samværsuker={samværsuker} />
    </VStack>
);

const Uke: React.FC<{
    samværsuke: Samværsuke;
    index: number;
    oppdaterSamværsdag: (dag: string, samværsandeler: Samværsandel[]) => void;
    visValgmuligheter: boolean;
}> = ({ samværsuke, index, oppdaterSamværsdag, visValgmuligheter }) => (
    <UkeContainer gap="1" $border={(index + 1) % 4 !== 0}>
        {visValgmuligheter && (
            <Valgmuligheter gap="6">
                <Div />
                {Object.keys(Samværsandel).map((andel) => (
                    <Label key={andel}>{samværsandelTilTekst[andel as Samværsandel]}</Label>
                ))}
            </Valgmuligheter>
        )}
        {Object.entries(samværsuke).map(([ukedag, samvær]: [string, Samværsdag], index) => {
            return (
                <UkeDag
                    key={ukedag + index}
                    ukedag={ukedag}
                    oppdaterSamværsandeler={(samværsandeler: Samværsandel[]) =>
                        oppdaterSamværsdag(ukedag, samværsandeler)
                    }
                    samværsandeler={samvær.andeler}
                />
            );
        })}
    </UkeContainer>
);

const UkeDag: React.FC<{
    ukedag: string;
    oppdaterSamværsandeler: (samværsandeler: Samværsandel[]) => void;
    samværsandeler: Samværsandel[];
}> = ({ ukedag, oppdaterSamværsandeler, samværsandeler }) => (
    <VStack>
        <CheckboxGruppe
            legend={formaterStrengMedStorForbokstav(ukedag.slice(0, 3))}
            onChange={oppdaterSamværsandeler}
            value={samværsandeler}
        >
            <Checkbox value={Samværsandel.KVELD_NATT}>{''}</Checkbox>
            <Checkbox value={Samværsandel.MORGEN}>{''}</Checkbox>
            <Checkbox value={Samværsandel.BARNEHAGE_SKOLE}>{''}</Checkbox>
            <Checkbox value={Samværsandel.ETTERMIDDAG}>{''}</Checkbox>
        </CheckboxGruppe>
    </VStack>
);

const VarighetSelect: React.FC<{
    oppdaterVarighet: (varighet: number) => void;
    onClose?: () => void;
}> = ({ oppdaterVarighet, onClose }) => (
    <SelectContainer justify="space-between">
        <StyledSelect
            label="Beregningslengde"
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                oppdaterVarighet(Number(event.target.value))
            }
        >
            {VARIGHETER_SAMVÆRSAVTALE.map((varighet) => (
                <option key={varighet} value={varighet}>
                    {varighet === 1 ? `${varighet} uke` : `${varighet} uker`}
                </option>
            ))}
        </StyledSelect>
        {onClose && <IkonKnapp icon={<TrashIcon />} onClick={onClose} />}
    </SelectContainer>
);

const Oppsummering: React.FC<{ samværsuker: Samværsuke[] }> = ({ samværsuker }) => {
    const summertSamvær = samværsuker
        .flatMap((samværsuke) =>
            Object.values(samværsuke).flatMap((samværsdag: Samværsdag) => samværsdag.andeler)
        )
        .map((andel) => samværsandelTilVerdi[andel])
        .reduce((acc, andel) => acc + andel, 0);

    const maksimalSamværsandel = samværsuker.length * 7 * 8;

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
