import React, { FC } from 'react';
import { IPersonopplysninger } from '../../typer/personopplysninger';
import Visittkort from '@navikt/familie-visittkort';
import styled from 'styled-components';

export const VisittkortWrapper = styled.div`
    .visittkort {
        padding: 0 1.5rem;
    }
`;

const VisittkortComponent: FC<{ data: IPersonopplysninger }> = ({ data }) => {
    return (
        <VisittkortWrapper>
            <Visittkort
                alder={20}
                ident={data.personIdent}
                kjønn={data.kjønn}
                navn={data.navn.visningsnavn}
            />
        </VisittkortWrapper>
    );
};

export default VisittkortComponent;
