import React from 'react';
import { ModalWrapper } from './ModalWrapper';
import { BodyLong } from '@navikt/ds-react';
import styled from 'styled-components';

const Innhold = styled(BodyLong)`
    margin-top: 2rem;
    margin-bottom: 2rem;
`;

const UgyldigSesjon: React.FC = () => {
    return (
        <ModalWrapper
            tittel={'Ugyldig sesjon'}
            visModal={true}
            closeButton={false}
            aksjonsknapper={false}
            ariaLabel={'Sesjonen har utløpt. Prøv å last inn siden på nytt.'}
        >
            <Innhold>Prøv å last siden på nytt</Innhold>
        </ModalWrapper>
    );
};

export default UgyldigSesjon;
