import React, { FC } from 'react';
import UIModalWrapper from '../../../Felles/Modal/UIModalWrapper';
import { Knapp } from 'nav-frontend-knapper';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../../../App/context/AppContext';

const StyledKnapp = styled(Knapp)`
    margin-left: 3rem;
`;

const UlagretDataModal: FC = () => {
    const {
        nullstillIkkePersisterteKomponenter,
        visUlagretDataModal,
        valgtSide,
        settVisUlagretDataModal,
    } = useApp();
    const navigate = useNavigate();

    return (
        <UIModalWrapper
            modal={{
                tittel: 'Du har ikke lagret dine siste endringer og vil miste disse om du forlater siden.',
                lukkKnapp: false,
                visModal: visUlagretDataModal,
                onClose: () => settVisUlagretDataModal(false),
                className: 'cake',
            }}
        >
            <Knapp
                key={'Forlat siden'}
                type={'standard'}
                onClick={() => {
                    if (valgtSide) {
                        nullstillIkkePersisterteKomponenter();
                        navigate(valgtSide);
                    }
                    settVisUlagretDataModal(false);
                }}
            >
                Forlat siden
            </Knapp>
            <StyledKnapp
                key={'Gå tilbake'}
                type={'hoved'}
                onClick={() => {
                    settVisUlagretDataModal(false);
                }}
            >
                Gå tilbake for å lagre
            </StyledKnapp>
        </UIModalWrapper>
    );
};

export default UlagretDataModal;
