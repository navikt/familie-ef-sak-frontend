import React, { FC } from 'react';
import styled from 'styled-components';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { ToggleName } from '../../../App/context/toggles';
import { useToggles } from '../../../App/context/TogglesContext';

const PaddingTop = styled.div`
    padding-top: 1rem;
`;

export const SettBrevmottakere: FC = () => {
    const { settVisBrevmottakereModal } = useBehandling();
    const { toggles } = useToggles();
    const skalViseSettBrevmottakereKnapp = toggles[ToggleName.visSettBrevmottakereKnapp] || false;

    if (skalViseSettBrevmottakereKnapp) {
        return (
            <>
                <PaddingTop>
                    <h4>Brevmottakere</h4>
                    <Hovedknapp
                        onClick={() => {
                            settVisBrevmottakereModal(true);
                        }}
                    >
                        Sett Verge/Fullmakt mottakere
                    </Hovedknapp>
                </PaddingTop>
            </>
        );
    } else {
        return null;
    }
};
