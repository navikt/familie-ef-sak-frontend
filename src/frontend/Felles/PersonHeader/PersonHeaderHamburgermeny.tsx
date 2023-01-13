import React from 'react';
import { useBehandling } from '../../App/context/BehandlingContext';
import { ToggleName } from '../../App/context/toggles';
import { useToggles } from '../../App/context/TogglesContext';
import { Hamburgermeny } from '../Hamburgermeny/Hamburgermeny';

export const PersonHeaderHamburgermeny = () => {
    const { settVisHenleggModal, settVisSettpåVentModal } = useBehandling();
    const { toggles } = useToggles();

    const skalViseSettPåVentKnapp = toggles[ToggleName.visSettPåVentKnapp];

    const menyvalg = [
        {
            tekst: 'Henlegg',
            onClick: () => settVisHenleggModal(true),
        },
    ];

    if (skalViseSettPåVentKnapp) {
        menyvalg.push({
            tekst: 'Sett på vent',
            onClick: () => settVisSettpåVentModal(true),
        });
    }

    return <Hamburgermeny items={menyvalg} />;
};
