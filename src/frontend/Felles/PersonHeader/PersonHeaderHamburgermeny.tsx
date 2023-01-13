import React from 'react';
import { useBehandling } from '../../App/context/BehandlingContext';
import { Hamburgermeny } from '../Hamburgermeny/Hamburgermeny';

export const PersonHeaderHamburgermeny = () => {
    const { settVisHenleggModal, settVisSettpåVentModal } = useBehandling();

    return (
        <Hamburgermeny
            items={[
                {
                    tekst: 'Henlegg',
                    onClick: () => settVisHenleggModal(true),
                },
                {
                    tekst: 'Sett på vent',
                    onClick: () => settVisSettpåVentModal(true),
                },
            ]}
        />
    );
};
