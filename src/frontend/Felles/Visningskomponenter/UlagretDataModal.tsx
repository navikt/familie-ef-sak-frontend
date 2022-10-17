import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../App/context/AppContext';
import { ModalWrapper } from '../Modal/ModalWrapper';

const UlagretDataModal: FC = () => {
    const {
        nullstillIkkePersisterteKomponenter,
        visUlagretDataModal,
        valgtSide,
        settVisUlagretDataModal,
    } = useApp();
    const navigate = useNavigate();

    return (
        <ModalWrapper
            tittel={
                'Du har ikke lagret dine siste endringer og vil miste disse om du forlater siden'
            }
            visModal={visUlagretDataModal}
            onClose={() => settVisUlagretDataModal(false)}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => settVisUlagretDataModal(false),
                    tekst: 'Gå tilbake for å lagre',
                },
                lukkKnapp: {
                    onClick: () => {
                        if (valgtSide) {
                            nullstillIkkePersisterteKomponenter();
                            navigate(valgtSide);
                        }
                        settVisUlagretDataModal(false);
                    },
                    tekst: 'Forlat siden',
                },
                marginTop: 4,
            }}
        />
    );
};

export default UlagretDataModal;
