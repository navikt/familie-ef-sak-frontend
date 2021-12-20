import React, { FC } from 'react';
import styled from 'styled-components';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useBehandling } from '../../../App/context/BehandlingContext';

const PaddingTop = styled.div`
    padding-top: 1rem;
`;

export const SettBrevmottakere: FC = () => {
    const { settVisBrevmottakereModal } = useBehandling();
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
};
