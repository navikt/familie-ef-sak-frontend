import { erFlettefeltFritektsfelt, finnFlettefeltVisningsnavnFraRef } from './BrevUtils';
import { Input, Textarea } from 'nav-frontend-skjema';
import React from 'react';
import { BrevStruktur, FlettefeltMedVerdi, Flettefeltreferanse } from './BrevTyper';
import styled from 'styled-components';

const StyledInput = styled(Input)<{ fetLabel: boolean }>`
    padding-top: 0.5rem;
    .skjemaelement__label {
        font-weight: ${(props) => (props.fetLabel ? 600 : 300)};
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
    if (erFlettefeltFritektsfelt(dokument, flettefelt._ref)) {
        return (
            <Textarea
                label={finnFlettefeltVisningsnavnFraRef(dokument, flettefelt._ref)}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    handleFlettefeltInput(e.target.value, flettefelt);
                }}
                value={flettefelter?.find((felt) => felt._ref === flettefelt._ref)?.verdi || ''}
                maxLength={0}
            />
        );
    } else {
        return (
            <StyledInput
                fetLabel={fetLabel}
                label={finnFlettefeltVisningsnavnFraRef(dokument, flettefelt._ref)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleFlettefeltInput(e.target.value, flettefelt);
                }}
                value={flettefelter?.find((felt) => felt._ref === flettefelt._ref)?.verdi || ''}
            />
        );
    }
};
