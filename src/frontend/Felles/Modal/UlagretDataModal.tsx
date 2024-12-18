import React, { FC, useCallback } from 'react';
import { useApp } from '../../App/context/AppContext';
import { ModalWrapper } from './ModalWrapper';
import { BlockerFunction, useBeforeUnload, useBlocker } from 'react-router-dom';

export const UlagretDataModal: FC = () => {
    const { nullstillIkkePersisterteKomponenter, ulagretData } = useApp();
    const skalBlokkere = React.useCallback<BlockerFunction>(
        ({ currentLocation, nextLocation }) =>
            ulagretData && currentLocation.pathname !== nextLocation.pathname,
        [ulagretData]
    );
    const blocker = useBlocker(skalBlokkere);

    React.useEffect(() => {
        if (blocker.state === 'blocked' && ulagretData === false) {
            blocker.reset();
        }
    }, [blocker, ulagretData]);

    const onAvbryt = () => blocker.state === 'blocked' && blocker.reset();
    const onForlatSiden = () => blocker.state === 'blocked' && blocker.proceed();

    /**
     * Denne trengs for å fange opp når noen refresher siden eller prøver å gå ut av selve siden.
     * Da kommer nettleserens innebygde prompt opp
     */
    useBeforeUnload(
        useCallback(
            (event) => {
                if (ulagretData) {
                    event.preventDefault();
                }
            },
            [ulagretData]
        ),
        { capture: true }
    );

    return (
        blocker.state === 'blocked' && (
            <ModalWrapper
                tittel={
                    'Du har ikke lagret dine siste endringer og vil miste disse om du forlater siden'
                }
                visModal={true}
                onClose={onAvbryt}
                aksjonsknapper={{
                    hovedKnapp: {
                        onClick: onAvbryt,
                        tekst: 'Gå tilbake for å lagre',
                    },
                    lukkKnapp: {
                        onClick: () => {
                            onForlatSiden();
                            setTimeout(nullstillIkkePersisterteKomponenter, 10);
                        },
                        tekst: 'Forlat siden',
                    },
                    marginTop: 4,
                }}
            />
        )
    );
};
