import VisittKort from '@navikt/familie-visittkort';
import React from 'react';
import styled from 'styled-components';
import { kjønnType } from '@navikt/familie-typer';
import { Link } from '@navikt/ds-react';
import { BodyShortSmall } from '../Visningskomponenter/Tekster';
import { AFontWeightBold } from '@navikt/ds-tokens/dist/tokens';

const ResponsivLenke = styled(Link)`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const VisittKortContainer = styled.div`
    width: 26.5rem;
`;

const Visningsnavn = styled(BodyShortSmall)`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-weight: ${AFontWeightBold};
`;

interface Props {
    fagsakPersonId: string;
    kjønn: kjønnType;
    ident: string;
    visningsnavn: string;
}

const Visittkort: React.FC<Props> = ({ fagsakPersonId, kjønn, ident, visningsnavn }) => {
    return (
        <VisittKortContainer>
            <VisittKort
                alder={20}
                ident={ident}
                kjønn={kjønn}
                navn={
                    <ResponsivLenke
                        role={'link'}
                        href={fagsakPersonId ? `/person/${fagsakPersonId}` : '#'}
                    >
                        <Visningsnavn>{visningsnavn}</Visningsnavn>
                    </ResponsivLenke>
                }
            />
        </VisittKortContainer>
    );
};

export default Visittkort;
