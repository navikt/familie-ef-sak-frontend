import React, { ChangeEvent } from 'react';
import {
    BodyShort,
    Button,
    Checkbox,
    CheckboxGroup,
    HStack,
    Label,
    Select,
    VStack,
} from '@navikt/ds-react';
import styled from 'styled-components';
import { ABorderDivider, ASurfaceInfoSubtle } from '@navikt/ds-tokens/dist/tokens';
import {
    Samværsandel,
    samværsandelTilTekst,
    samværsandelTilVerdi,
    Samværsdag,
    Samværsuke,
} from '../../App/typer/samværsavtale';
import { formaterStrengMedStorForbokstav } from '../../App/utils/formatter';
import { CalculatorIcon, TrashIcon } from '@navikt/aksel-icons';

const Div = styled.div`
    height: 3.25rem;
`;

const StyledSelect = styled(Select)`
    width: 10rem;
`;

const SelectContainer = styled(HStack)`
    padding: 1rem 1.5rem 1.5rem 1.5rem;
    background: ${ASurfaceInfoSubtle};
`;

const OppsummeringContainer = styled(HStack)`
    padding: 1rem 1.5rem 1rem 1.5rem;
    background: ${ASurfaceInfoSubtle};
`;

const CheckboxGruppe = styled(CheckboxGroup)`
    width: 2.5rem;
`;

const LegendKnapp = styled(Button)`
    padding: 0;
`;

const IkonKnapp = styled(Button)`
    width: fit-content;
    height: fit-content;
`;

const UkeTittel = styled(Label)`
    text-decoration: underline;
    text-decoration-thickness: 0.125rem;
    text-underline-offset: 0.25rem;
`;

const Grid = styled.div`
    display: grid;
    row-gap: 1rem;
    column-gap: 1rem;
    overflow: hidden;

    // Styler slik at første element på hver rad er beskrivelsestekster
    // Støtter fra to kolonner ved smal skjerm og opp til fem kolonner ved bred skjerm
    span {
        display: none;
    }

    @media screen and (max-width: 1409px) {
        grid-template-columns: repeat(2, 305px);
        span {
            display: block;
        }
    }
    @media screen and (min-width: 1410px) and (max-width: 1739px) {
        grid-template-columns: repeat(3, 305px);
        span:nth-of-type(2n + 1) {
            display: block;
        }
    }
    @media screen and (min-width: 1740px) and (max-width: 2059px) {
        grid-template-columns: repeat(4, 305px);
        span:nth-of-type(3n + 1) {
            display: block;
        }
    }
    @media screen and (min-width: 2060px) {
        grid-template-columns: repeat(5, 305px);
        span:nth-of-type(4n + 1) {
            display: block;
        }
    }

    // Styler interne borders mellom elementene
    .gridItem {
        position: relative;
    }

    .gridItem::before,
    .gridItem::after {
        content: '';
        position: absolute;
        background-color: ${ABorderDivider};
        z-index: 1;
    }

    .gridItem::before {
        inline-size: 2px;
        block-size: 17rem;
        inset-block-start: 0;
        inset-inline-start: -1rem;
    }

    .gridItem::after {
        inline-size: 20.075rem;
        block-size: 2px;
        inset-inline-start: 0;
        inset-block-start: -1rem;
    }
`;

const VARIGHETER_SAMVÆRSAVTALE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export const kalkulerSamværsandeler = (samværsuker: Samværsuke[]) => {
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
    return [visningstekstAntallDager, visningstekstProsentandel];
};

interface Props {
    className?: string;
    onSave: () => void;
    onClose: () => void;
    onDelete: () => void;
    samværsuker: Samværsuke[];
    oppdaterSamværsuke: (ukeIndex: number, ukedag: string, samversandeler: Samværsandel[]) => void;
    oppdaterVarighet: (varighet: number) => void;
    erLesevisning: boolean;
}

export const Samværskalkulator: React.FC<Props> = ({
    className,
    onSave,
    onClose,
    onDelete,
    samværsuker,
    oppdaterSamværsuke,
    oppdaterVarighet,
    erLesevisning,
}) => {
    const samværsandeler = Object.keys(Samværsandel);

    return (
        <VStack className={className} gap="4">
            <VarighetSelect
                oppdaterVarighet={oppdaterVarighet}
                onDelete={onDelete}
                samværsuker={samværsuker}
                erLesevisning={erLesevisning}
            />
            <Grid>
                {samværsuker.map((samværsuke, index) => (
                    <>
                        <span className="gridItem">
                            <VStack gap="6">
                                <Div />
                                {samværsandeler.map((andel) => (
                                    <Label key={andel}>
                                        {samværsandelTilTekst[andel as Samværsandel]}
                                    </Label>
                                ))}
                            </VStack>
                        </span>
                        <Uke
                            key={index}
                            ukenummer={index + 1}
                            samværsuke={samværsuke}
                            oppdaterSamværsdag={(dag: string, samværsandeler: Samværsandel[]) =>
                                oppdaterSamværsuke(index, dag, samværsandeler)
                            }
                            erLesevisning={erLesevisning}
                        />
                    </>
                ))}
            </Grid>
            <Oppsummering
                samværsuker={samværsuker}
                onSave={onSave}
                onClose={onClose}
                erLesevisning={erLesevisning}
            />
        </VStack>
    );
};

const Uke: React.FC<{
    samværsuke: Samværsuke;
    ukenummer: number;
    oppdaterSamværsdag: (dag: string, samværsandeler: Samværsandel[]) => void;
    erLesevisning: boolean;
}> = ({ samværsuke, ukenummer, oppdaterSamværsdag, erLesevisning }) => (
    <VStack gap="2" className="gridItem">
        <UkeTittel>{`Uke ${ukenummer}`}</UkeTittel>
        <HStack gap="1">
            {Object.entries(samværsuke).map(([ukedag, samvær]: [string, Samværsdag], index) => (
                <Ukedag
                    key={ukedag + index}
                    ukedag={ukedag}
                    oppdaterSamværsandeler={(samværsandeler: Samværsandel[]) =>
                        oppdaterSamværsdag(ukedag, samværsandeler)
                    }
                    samværsandeler={samvær.andeler}
                    erLesevisning={erLesevisning}
                />
            ))}
        </HStack>
    </VStack>
);

const Ukedag: React.FC<{
    ukedag: string;
    oppdaterSamværsandeler: (samværsandeler: Samværsandel[]) => void;
    samværsandeler: Samværsandel[];
    erLesevisning: boolean;
}> = ({ ukedag, oppdaterSamværsandeler, samværsandeler, erLesevisning }) => {
    const alleSamværsandeler = Object.values(Samværsandel);
    const samværsandelerEllerTomListe =
        samværsandeler.length === alleSamværsandeler.length ? [] : alleSamværsandeler;

    const visningstekstLegend = formaterStrengMedStorForbokstav(ukedag.slice(0, 3));
    const legend = erLesevisning ? (
        visningstekstLegend
    ) : (
        <LegendKnapp
            variant="tertiary"
            onClick={() => oppdaterSamværsandeler(samværsandelerEllerTomListe)}
            disabled={erLesevisning}
        >
            {visningstekstLegend}
        </LegendKnapp>
    );

    return (
        <VStack>
            <CheckboxGruppe
                legend={legend}
                onChange={oppdaterSamværsandeler}
                value={samværsandeler}
            >
                <Checkbox readOnly={erLesevisning} value={Samværsandel.KVELD_NATT}>
                    {''}
                </Checkbox>
                <Checkbox readOnly={erLesevisning} value={Samværsandel.MORGEN}>
                    {''}
                </Checkbox>
                <Checkbox readOnly={erLesevisning} value={Samværsandel.BARNEHAGE_SKOLE}>
                    {''}
                </Checkbox>
                <Checkbox readOnly={erLesevisning} value={Samværsandel.ETTERMIDDAG}>
                    {''}
                </Checkbox>
            </CheckboxGruppe>
        </VStack>
    );
};

const VarighetSelect: React.FC<{
    oppdaterVarighet: (varighet: number) => void;
    onDelete: () => void;
    samværsuker: Samværsuke[];
    erLesevisning: boolean;
}> = ({ oppdaterVarighet, onDelete, samværsuker, erLesevisning }) => (
    <SelectContainer justify="space-between">
        <StyledSelect
            label="Beregningslengde"
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                oppdaterVarighet(Number(event.target.value))
            }
            value={samværsuker.length}
            readOnly={erLesevisning}
        >
            {VARIGHETER_SAMVÆRSAVTALE.map((varighet) => (
                <option key={varighet} value={varighet}>
                    {varighet === 1 ? `${varighet} uke` : `${varighet} uker`}
                </option>
            ))}
        </StyledSelect>
        {onDelete && !erLesevisning && (
            <IkonKnapp
                size="small"
                icon={<TrashIcon title="Slett" />}
                variant="tertiary"
                type="button"
                onClick={onDelete}
            >
                <span>Slett</span>
            </IkonKnapp>
        )}
    </SelectContainer>
);

const Oppsummering: React.FC<{
    samværsuker: Samværsuke[];
    onSave: () => void;
    onClose: () => void;
    erLesevisning: boolean;
}> = ({ samværsuker, onSave, onClose, erLesevisning }) => {
    const [samværsandelerDagVisning, samværsandelProsentVisning] =
        kalkulerSamværsandeler(samværsuker);
    const visningstekstAvbrytKnapp = erLesevisning ? 'Lukk' : 'Avbryt';

    return (
        <OppsummeringContainer justify="space-between" align="center">
            <HStack align="center" gap="4">
                <HStack gap="2" align="center">
                    <CalculatorIcon aria-hidden />
                    <Label>Samvær:</Label>
                </HStack>
                <BodyShort size="medium">{`${samværsandelerDagVisning} = ${samværsandelProsentVisning}`}</BodyShort>
            </HStack>
            <HStack gap="4">
                <Button size="small" variant="tertiary" onClick={onClose}>
                    {visningstekstAvbrytKnapp}
                </Button>
                {!erLesevisning && (
                    <Button size="small" type="button" onClick={onSave} disabled={erLesevisning}>
                        Lagre
                    </Button>
                )}
            </HStack>
        </OppsummeringContainer>
    );
};
