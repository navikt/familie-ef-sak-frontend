import { FrittståendeBrevtype } from './BrevTyper';
import React from 'react';
import styled from 'styled-components';
import { Alert } from '@navikt/ds-react';

const Varsel = styled(Alert)`
    margin-top: 1rem;
    width: 95%;
`;

export const VarselFyllInn: React.FC<{ brevtype: FrittståendeBrevtype }> = ({ brevtype }) => (
    <Varsel variant={'warning'}>
        {brevtype === FrittståendeBrevtype.BREV_OM_FORLENGET_SVARTID_KLAGE && (
            <>
                Husk å fylle ut antall uker forventet svartid i{' '}
                <span style={{ fontWeight: 'bold' }}>[antall]</span> i avsnittet under
            </>
        )}
        {brevtype === FrittståendeBrevtype.BREV_OM_FORLENGET_SVARTID && (
            <>
                Husk å fylle ut hvilken stønad det gjelder og antall uker forventet svartid i
                avsnittet under.
            </>
        )}
    </Varsel>
);
