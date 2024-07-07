import VisittKort from '@navikt/familie-visittkort';
import React from 'react';
import styled from 'styled-components';
import { Link } from '@navikt/ds-react';
import { BodyShortSmall } from '../Visningskomponenter/Tekster';
import { AFontWeightBold } from '@navikt/ds-tokens/dist/tokens';
import { Kjønn } from '../../App/typer/personopplysninger';

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
    font-weight: ${AFontWeightBold};
`;

interface Props {
    fagsakPersonId: string;
    kjønn: Kjønn;
    ident: string;
    visningsnavn: string;
    borderBottom?: boolean;
}

const Visittkort: React.FC<Props> = ({
    fagsakPersonId,
    kjønn,
    ident,
    visningsnavn,
    borderBottom = true,
}) => {
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
                borderBottom={borderBottom}
            />
        </VisittKortContainer>
    );
};

export default Visittkort;
