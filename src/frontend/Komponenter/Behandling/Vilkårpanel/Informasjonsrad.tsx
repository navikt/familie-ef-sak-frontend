import * as React from 'react';
import { Label } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import styled from 'styled-components';
import { mapIkon, TabellIkon } from './TabellVisning';
import { FC, ReactNode } from 'react';

interface Props {
    ikon: TabellIkon;
    label: string;
    verdi: ReactNode;
    verdiSomString?: boolean;
}

const InformasjonsradContainer = styled.div`
    display: grid;
    grid-template-columns: 21px 250px auto;
    grid-gap: 0.5rem;
`;

const Informasjonsrad: FC<Props> = ({ ikon, label, verdi, verdiSomString = true }) => {
    return (
        <InformasjonsradContainer>
            {mapIkon(ikon)}
            <Label size="small" as="h3">
                {label}
            </Label>
            {verdiSomString ? <BodyShortSmall>{verdi}</BodyShortSmall> : verdi}
        </InformasjonsradContainer>
    );
};

export default Informasjonsrad;
