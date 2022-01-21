import * as React from 'react';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import { Høyremenyvalg } from './Høyremeny';
import { Folder, ClockFilled } from '@navikt/ds-icons';
import { Normaltekst } from 'nav-frontend-typografi';

const StyledIkonWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-bottom: ${navFarger.navGra40} solid 2px;
    text-align: center;

    .typo-normal {
        font-size: 12px;
        margin-top: -5px;
    }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface IkonProps {
    erAktiv: boolean;
}
const StyledIkon = styled.div<IkonProps>`
    flex: 1;
    padding-top: 1rem;
    padding-bottom: 0.62rem;

    background-color: ${navFarger.navBla};
    color: ${navFarger.navBla};

    :hover {
        cursor: pointer;
        svg {
            fill: ${navFarger.navBlaLighten20};
        }
        border-bottom: 5px solid ${navFarger.navBlaLighten20};
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
                <ClockFilled aria-label="Historikk" />
                <Normaltekst>Historikk</Normaltekst>
            </StyledIkon>
            <StyledIkon
                role={'button'}
                erAktiv={aktiv === Høyremenyvalg.Mappe}
                onClick={() => settAktiv(Høyremenyvalg.Mappe)}
            >
                <Folder />
                <Normaltekst>Dokumenter</Normaltekst>
            </StyledIkon>
        </StyledIkonWrapper>
    );
};

export default Valgvisning;
