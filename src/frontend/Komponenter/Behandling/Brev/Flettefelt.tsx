import { erFlettefeltFritektsfelt, finnFlettefeltVisningsnavnFraRef } from './BrevUtils';
import React from 'react';
import { BrevStruktur, FlettefeltMedVerdi, Flettefeltreferanse } from './BrevTyper';
import styled from 'styled-components';
import { BodyShort, Label, Textarea, TextField } from '@navikt/ds-react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledInput = styled(({ fetLabel, ...props }) => <TextField autoComplete="off" {...props} />)`
    padding-top: 0.5rem;
    .skjemaelement__label {
        font-weight: ${(fetLabel) => (fetLabel ? 600 : 300)};
    }
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

    if (erFlettefeltFritektsfelt(dokument, flettefelt._ref)) {
        return (
            <Textarea
                label={finnFlettefeltVisningsnavnFraRef(dokument, flettefelt._ref)}
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
                <Label>{finnFlettefeltVisningsnavnFraRef(dokument, flettefelt._ref)}</Label>
                <BodyShort>{flettefeltMedVerdi.verdi}</BodyShort>
            </div>
        ) : (
            <StyledInput
                fetLabel={fetLabel}
                label={finnFlettefeltVisningsnavnFraRef(dokument, flettefelt._ref)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleFlettefeltInput(e.target.value, flettefelt);
                }}
                value={flettefeltMedVerdi?.verdi || ''}
                disabled={flettefeltMedVerdi?.automatiskUtfylt}
            />
        );
    }
};
