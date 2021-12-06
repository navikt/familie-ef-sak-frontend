import React from 'react';
import styled from 'styled-components';
import { Undertekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import { Refresh } from '@navikt/ds-icons';
import { FamilieKnapp } from '@navikt/familie-form-elements';

const Container = styled.div`
    display: flex;
    margin: 2rem;
    align-items: center;
    .knapp__spinner {
        margin: 0 !important;
    }
`;

const Oppdateringstekst = styled(Undertekst)`
    color: ${navFarger.navGra60};
`;

type Props = { visningstekst: string };

export const OppdaterOpplysninger: React.FC<Props> = ({ visningstekst }) => {
    return (
        <Container>
            <Oppdateringstekst children={visningstekst} />
            <FamilieKnapp
                aria-label={'Oppdater registeropplysninger'}
                title={'Oppdater'}
                onClick={() => {
                    console.log('klikk');
                }}
                spinner={false}
                type={'flat'}
                mini={true}
                kompakt={true}
                erLesevisning={false}
            >
                <Refresh role="img" focusable="false" />
            </FamilieKnapp>
        </Container>
    );
};
