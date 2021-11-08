import React from 'react';
import styled from 'styled-components';
import { FamilieTextarea, IFamilieTextareaProps } from '@navikt/familie-form-elements';
import { SkjemaelementFeilmelding } from 'nav-frontend-skjema';

const StyledFamilieTextArea: React.FC<IFamilieTextareaProps> = styled(FamilieTextarea)`
    white-space: pre-wrap;
    word-wrap: break-word;
    max-width: 60rem;
    .typo-element {
        padding-bottom: 0.5rem;
    }
`;

type Props = { feilmelding?: string } & IFamilieTextareaProps;

export const EnsligTextArea: React.FC<Props> = ({
    value,
    onChange,
    label,
    maxLength,
    erLesevisning,
    feilmelding,
}) => {
    return (
        <>
            <StyledFamilieTextArea
                value={value}
                onChange={(e) => onChange(e)}
                label={label}
                maxLength={maxLength}
                erLesevisning={erLesevisning}
            />
            <SkjemaelementFeilmelding>{feilmelding}</SkjemaelementFeilmelding>
        </>
    );
};
