import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../App/context/AppContext';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';

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
            hovedKnappClick={() => settVisUlagretDataModal(false)}
            hovedKnappTekst={'Gå tilbake for å lagre'}
            lukkKnappClick={() => {
                if (valgtSide) {
                    nullstillIkkePersisterteKomponenter();
                    navigate(valgtSide);
                }
                settVisUlagretDataModal(false);
            }}
            lukkKnappTekst={'Forlat siden'}
        />
    );
};

export default UlagretDataModal;
