import * as React from 'react';
import { Label, Tag } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import styled from 'styled-components';
import { mapIkon, TabellIkon } from './TabellVisning';
import { FC } from 'react';

interface Props {
    ikon: TabellIkon;
    label: string;
    verdi: string;
    verdiSomTag?: boolean;
}

const InformasjonsradContainer = styled.div`
    display: grid;
    grid-template-columns: 21px 250px auto;
    grid-gap: 0.5rem;
`;

const TagMedTilpassetBredde = styled(Tag)`
    width: fit-content;
`;

const Informasjonsrad: FC<Props> = ({ ikon, label, verdi, verdiSomTag = false }) => {
    return (
        <InformasjonsradContainer>
            {mapIkon(ikon)}
            <Label size="small" as="h3">
                {label}
            </Label>
            {verdiSomTag ? (
                <TagMedTilpassetBredde variant={'warning'} size="small">
                    Innslag funnet
                </TagMedTilpassetBredde>
            ) : (
                <BodyShortSmall>{verdi}</BodyShortSmall>
            )}
        </InformasjonsradContainer>
    );
};

export default Informasjonsrad;
