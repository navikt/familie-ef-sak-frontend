import React, { FC } from 'react';
import UIModalWrapper from '../Modal/UIModalWrapper';
import { Button } from '@navikt/ds-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../../App/context/AppContext';

const SentrerKnapper = styled.div`
    display: flex;
    justify-content: center;

    > button {
        margin-left: 1rem;
        margin-right: 1rem;
    }
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
            <SentrerKnapper>
                <Button
                    variant="tertiary"
                    onClick={() => {
                        if (valgtSide) {
                            nullstillIkkePersisterteKomponenter();
                            navigate(valgtSide);
                        }
                        settVisUlagretDataModal(false);
                    }}
                >
                    Forlat siden
                </Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        settVisUlagretDataModal(false);
                    }}
                >
                    Gå tilbake for å lagre
                </Button>
            </SentrerKnapper>
        </UIModalWrapper>
    );
};

export default UlagretDataModal;
