import * as React from 'react';
import Dialog from '../../Felles/Ikoner/Dialog';
import Mappe from '../../Felles/Ikoner/Mappe';
import Logg from '../../Felles/Ikoner/Logg';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import { Høyremenyvalg } from './Høyremeny';

const StyledIkonWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-bottom: ${navFarger.navGra40} solid 2px;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface IkonProps {
    erAktiv: boolean;
}
const StyledIkon = styled.div<IkonProps>`
    flex: 1;
    padding-top: 1rem;
    padding-bottom: 0.62rem;

    :hover {
        cursor: pointer;
        svg {
            fill: ${navFarger.navBlaLighten20};
        }
        border-bottom: 5px solid ${navFarger.navBlaLighten20};
    }
    svg {
        width: 100%;
        fill: ${(props) => (props.erAktiv ? navFarger.navBla : navFarger.navMorkGra)};
    }
    background-color: ${(props) => (props.erAktiv ? navFarger.navLysGra : 'white')};
    border-bottom: 5px solid ${(props) => (props.erAktiv ? navFarger.navBla : 'white')};
`;

interface ValgvisningProps {
    settAktiv: (aktivtValg: Høyremenyvalg) => void;
    aktiv: Høyremenyvalg;
}

const Valgvisning: React.FC<ValgvisningProps> = ({ aktiv, settAktiv }) => {
    return (
        <StyledIkonWrapper>
            <StyledIkon
                role={'button'}
                erAktiv={aktiv === Høyremenyvalg.Logg}
                onClick={() => settAktiv(Høyremenyvalg.Logg)}
            >
                <Logg />
            </StyledIkon>
            <StyledIkon
                role={'button'}
                erAktiv={aktiv === Høyremenyvalg.Dialog}
                onClick={() => settAktiv(Høyremenyvalg.Dialog)}
            >
                <Dialog />
            </StyledIkon>
            <StyledIkon
                role={'button'}
                erAktiv={aktiv === Høyremenyvalg.Mappe}
                onClick={() => settAktiv(Høyremenyvalg.Mappe)}
            >
                <Mappe />
            </StyledIkon>
        </StyledIkonWrapper>
    );
};

export default Valgvisning;
