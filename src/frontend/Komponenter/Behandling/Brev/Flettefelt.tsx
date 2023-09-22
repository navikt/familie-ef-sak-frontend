import { erFlettefeltFritektsfelt, finnFlettefeltNavnOgBeskrivelseFraRef } from './BrevUtils';
import React from 'react';
import { BrevStruktur, FlettefeltMedVerdi, Flettefeltreferanse } from './BrevTyper';
import styled from 'styled-components';
import { BodyShort, HelpText, Label, Textarea, TextField } from '@navikt/ds-react';

const StyledInput = styled(({ ...props }) => (
    <TextField label={props.label} autoComplete="off" {...props} />
))`
    padding-top: 0.5rem;
`;

const TekstMedHjelpetekstWrapper = styled.div`
    display: flex;
    gap: 1rem;
`;

interface Props {
    fetLabel: boolean;
    flettefelt: Flettefeltreferanse;
    dokument: BrevStruktur;
    flettefelter: FlettefeltMedVerdi[];
    handleFlettefeltInput: (verdi: string, flettefelt: Flettefeltreferanse) => void;
}

export const Flettefelt: React.FC<Props> = ({
    fetLabel,
    flettefelt,
    dokument,
    flettefelter,
    handleFlettefeltInput,
}) => {
    const flettefeltMedVerdi = flettefelter?.find((felt) => felt._ref === flettefelt._ref);
    const { flettefeltNavn, flettefeltBeskrivelse } = finnFlettefeltNavnOgBeskrivelseFraRef(
        dokument,
        flettefelt._ref
    );

    if (erFlettefeltFritektsfelt(dokument, flettefelt._ref)) {
        return (
            <Textarea
                label={flettefeltNavn}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    handleFlettefeltInput(e.target.value, flettefelt);
                }}
                value={flettefeltMedVerdi?.verdi || ''}
                maxLength={0}
            />
        );
    } else {
        return flettefeltMedVerdi?.automatiskUtfylt ? (
            <div>
                <Label>{flettefeltNavn}</Label>
                <TekstMedHjelpetekstWrapper>
                    <BodyShort>{flettefeltMedVerdi.verdi}</BodyShort>
                    {flettefeltBeskrivelse && <HelpText>{flettefeltBeskrivelse}</HelpText>}
                </TekstMedHjelpetekstWrapper>
            </div>
        ) : (
            <StyledInput
                fetLabel={fetLabel}
                description={flettefeltBeskrivelse}
                label={flettefeltNavn}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleFlettefeltInput(e.target.value, flettefelt);
                }}
                value={flettefeltMedVerdi?.verdi || ''}
            />
        );
    }
};
