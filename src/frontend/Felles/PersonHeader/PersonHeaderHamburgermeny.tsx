import React from 'react';
import { useApp } from '../../App/context/AppContext';
import { useBehandling } from '../../App/context/BehandlingContext';
import { Hamburgermeny } from '../Hamburgermeny/Hamburgermeny';

export const PersonHeaderHamburgermeny = () => {
    const { settVisBrevmottakereModal } = useApp();
    const { settVisHenleggModal } = useBehandling();

    return (
        <Hamburgermeny
            items={[
                {
                    tekst: 'Sett Verge/Fullmakt mottakere',
                    onClick: () => settVisBrevmottakereModal(true),
                },
                {
                    tekst: 'Henlegg',
                    onClick: () => settVisHenleggModal(true),
                },
            ]}
        />
    );
};
