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

export type ModalTekst = {
    tittel: string;
    innhold: string;
};

const UlagretDataModal: FC = () => {
    const {
        nullstillIkkePersisterteKomponenter,
        visUlagretDataModal,
        valgtSide,
        settVisUlagretDataModal,
    } = useApp();
    const navigate = useNavigate();

    const utledModalTekst = (type: string): ModalTekst => {
        switch (type) {
            case 'person':
                return {
                    tittel: 'Vil du forlate siden?',
                    innhold:
                        'Du har angitt at en eller flere verger eller fullmektige skal motta brev ved utsending. Forlater du denne siden mister du dette og må evt gjøre dette på nytt ved utsending.',
                };
            default:
                return {
                    tittel: 'Du har ikke lagret dine siste endringer og vil miste disse om du forlater siden.',
                    innhold: '',
                };
        }
    };

    const gjeldendeUrl = window.location.href;
    const modalTekst = utledModalTekst(gjeldendeUrl.split('/')[3]);

    return (
        <UIModalWrapper
            modal={{
                tittel: modalTekst.tittel,
                lukkKnapp: false,
                visModal: visUlagretDataModal,
                onClose: () => settVisUlagretDataModal(false),
                className: 'cake',
            }}
        >
            {modalTekst.innhold}
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
