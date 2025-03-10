import React, { FC } from 'react';
import styled from 'styled-components';
import { ModalWrapper } from '../../Felles/Modal/ModalWrapper';
import { SøkPersonTODO } from './SøkPersonTODO';

const GridContainer = styled.div`
    display: grid;
    column-gap: 2rem;
`;

export const EndrePersonModal: FC<{
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
            </GridContainer>
        </ModalWrapper>
    );
};
