import React, { FC } from 'react';
import { useApp } from '../../App/context/AppContext';
import { ModalWrapper } from './ModalWrapper';
import ReactRouterPrompt from 'react-router-prompt';

export const UlagretDataModal: FC = () => {
    const { nullstillIkkePersisterteKomponenter, ulagretData } = useApp();
    return (
        <ReactRouterPrompt when={ulagretData}>
            {({ isActive, onConfirm, onCancel }) => (
                <ModalWrapper
                    tittel={
                        'Du har ikke lagret dine siste endringer og vil miste disse om du forlater siden'
                    }
                    visModal={isActive}
                    onClose={onCancel}
                    aksjonsknapper={{
                        hovedKnapp: {
                            onClick: onCancel,
                            tekst: 'Gå tilbake for å lagre',
                        },
                        lukkKnapp: {
                            onClick: () => {
                                onConfirm();
                                setTimeout(nullstillIkkePersisterteKomponenter, 10);
                            },
                            tekst: 'Forlat siden',
                        },
                        marginTop: 4,
                    }}
                />
            )}
        </ReactRouterPrompt>
    );
};
