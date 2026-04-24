import React from 'react';
import styled from 'styled-components';
import { Link } from '@navikt/ds-react';
import { BodyShortSmall } from '../Visningskomponenter/Tekster';
import VisittKortKomponent from './VisittkortKomponent';
import { FontWeightBold } from '@navikt/ds-tokens/js';

const ResponsivLenke = styled(Link)`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const VisittKortContainer = styled.div`
    width: max-content;
`;

const Visningsnavn = styled(BodyShortSmall)`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-weight: ${FontWeightBold};
`;

interface Props {
    fagsakPersonId: string;
    ident: string;
    visningsnavn: string;
    borderBottom?: boolean;
}

const Visittkort: React.FC<Props> = ({
    fagsakPersonId,
    ident,
    visningsnavn,
    borderBottom = true,
}) => {
    return (
        <VisittKortContainer>
            <VisittKortKomponent
                alder={20}
                ident={ident}
                navn={
                    <ResponsivLenke
                        role={'link'}
                        href={fagsakPersonId ? `/person/${fagsakPersonId}` : '#'}
                    >
                        <Visningsnavn>{visningsnavn}</Visningsnavn>
                    </ResponsivLenke>
                }
                borderBottom={borderBottom}
            />
        </VisittKortContainer>
    );
};

export default Visittkort;
