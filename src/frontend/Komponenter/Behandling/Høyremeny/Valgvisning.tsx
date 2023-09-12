import * as React from 'react';
import styled from 'styled-components';
import { Høyremenyvalg } from './Høyremeny';
import { Folder, ClockFilled } from '@navikt/ds-icons';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import { ABlue400, ABlue500, AGray100, ABorderDivider } from '@navikt/ds-tokens/dist/tokens';

const StyledIkonWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-top: ${ABorderDivider} solid 2px;
    border-bottom: ${ABorderDivider} solid 2px;
    text-align: center;

    .navds-body-short {
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

    background-color: ${ABlue500};
    color: ${ABlue500};

    :hover {
        cursor: pointer;
        svg {
            fill: ${ABlue400};
        }
        border-bottom: 5px solid ${ABlue400};
    }

    background-color: ${(props) => (props.erAktiv ? AGray100 : 'white')};
    border-bottom: 5px solid ${(props) => (props.erAktiv ? ABlue500 : 'white')};
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
                <BodyShortSmall>Historikk</BodyShortSmall>
            </StyledIkon>
            <StyledIkon
                role={'button'}
                erAktiv={aktiv === Høyremenyvalg.Mappe}
                onClick={() => settAktiv(Høyremenyvalg.Mappe)}
            >
                <Folder />
                <BodyShortSmall>Dokumenter</BodyShortSmall>
            </StyledIkon>
        </StyledIkonWrapper>
    );
};

export default Valgvisning;
