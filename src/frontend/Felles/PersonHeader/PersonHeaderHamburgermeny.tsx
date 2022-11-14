import React from 'react';
import { useBehandling } from '../../App/context/BehandlingContext';
import { Hamburgermeny } from '../Hamburgermeny/Hamburgermeny';

export const PersonHeaderHamburgermeny = () => {
    const { settVisHenleggModal } = useBehandling();

    return (
        <Hamburgermeny
            items={[
                {
                    tekst: 'Henlegg',
                    onClick: () => settVisHenleggModal(true),
                },
            ]}
        />
    );
};
