import React from 'react';
import { useBehandling } from '../../App/context/BehandlingContext';
import { Hamburgermeny } from '../Hamburgermeny/Hamburgermeny';

export const PersonHeaderHamburgermeny = () => {
    const { settVisHenleggModal, settVisSettPåVent } = useBehandling();

    const menyvalg = [
        {
            tekst: 'Henlegg',
            onClick: () => settVisHenleggModal(true),
        },
        {
            tekst: 'Sett på vent',
            onClick: () => settVisSettPåVent(true),
        },
    ];

    return <Hamburgermeny items={menyvalg} />;
};
