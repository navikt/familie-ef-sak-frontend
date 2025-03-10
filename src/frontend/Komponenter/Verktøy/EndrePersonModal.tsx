import React, { FC } from 'react';
import styled from 'styled-components';
import { ModalWrapper } from '../../Felles/Modal/ModalWrapper';
import { Button } from '@navikt/ds-react';
import { SøkPersonTODO } from './SøkPersonTODO';

const GridContainer = styled.div`
    display: grid;
    column-gap: 2rem;
`;

const SentrerKnapper = styled.div`
    display: flex;
    justify-content: center;

    > button {
        margin-left: 1rem;
        margin-right: 1rem;
    }
`;

const HorisontalLinje = styled.div`
    height: 0;

    border: 2px solid #f3f3f3;

    margin-top: 2rem;
    margin-bottom: 1.5rem;
`;

export const EndrePersonModal: FC<{
    personIdent: string;
    settPersonIdent: React.Dispatch<React.SetStateAction<string>>;
    settVisEndrePersonModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ settVisEndrePersonModal, settPersonIdent }) => {
    return (
        <ModalWrapper
            tittel={'Velg person'}
            visModal={true}
            onClose={() => {
                settVisEndrePersonModal(false);
            }}
            maxWidth={40}
            ariaLabel={'Velg person'}
        >
            <GridContainer>
                <SøkPersonTODO
                    settPersonIdent={settPersonIdent}
                    settVisEndrePersonModal={settVisEndrePersonModal}
                />
                <HorisontalLinje />
            </GridContainer>
            <SentrerKnapper>
                <Button variant="tertiary" onClick={() => settVisEndrePersonModal(false)}>
                    Avbryt
                </Button>
            </SentrerKnapper>
        </ModalWrapper>
    );
};
