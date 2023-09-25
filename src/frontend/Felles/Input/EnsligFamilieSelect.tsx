import React from 'react';
import { IFamilieSelectProps } from '@navikt/familie-form-elements';
import styled from 'styled-components';
import { FamilieSelect } from '@navikt/familie-form-elements';

const FamilieSelectMedFeilmeldingUtenPrikk = styled(FamilieSelect)`
    .navds-error-message::before {
        content: none;
    }
`;
export const EnsligFamilieSelect: React.FC<IFamilieSelectProps> = (props) => {
    return <FamilieSelectMedFeilmeldingUtenPrikk {...props} />;
};
