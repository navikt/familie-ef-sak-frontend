import * as React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { ISide, SideNavn } from './sider';
import { useApp } from '../../../App/context/AppContext';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import {
    NavdsGlobalColorBlue400,
    NavdsGlobalColorBlue500,
    NavdsGlobalColorGray100,
    NavdsGlobalColorGray300,
    NavdsSemanticColorLink,
} from '@navikt/ds-tokens/dist/tokens';

const StyledNavLink = styled(NavLink)`
    border-bottom: 5px solid white;
    color: inherit;
    text-align: center;
    text-decoration: none;
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;

    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    padding-left: 5px;
    padding-right: 5px;

    :hover {
        border-bottom: 5px solid ${NavdsGlobalColorBlue400};

        .navds-body-short {
            color: ${NavdsSemanticColorLink};
        }
    }

    &.active {
        background-color: ${NavdsGlobalColorGray100};
        border-bottom: 5px solid ${NavdsGlobalColorBlue500};

        .navds-body-short {
            font-weight: bold;
        }
    }
`;

const StyledLenketekst = styled(BodyShortSmall)`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const StyledTekst = styled(BodyShortSmall)`
    border-bottom: 5px solid white;
    color: ${NavdsGlobalColorGray300};
    text-align: center;
    text-decoration: none;
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    padding-left: 5px;
    padding-right: 5px;
`;

interface Props {
    side: ISide;
    behandlingId: string;
    index: number;
    deaktivert: boolean;
}

const Fane: React.FC<Props> = ({ side, behandlingId, index, deaktivert }) => {
    const { gåTilUrl } = useApp();
    const fanenavn = side.navn === SideNavn.KORRIGERING_UTEN_BREV ? SideNavn.BREV : side.navn;
    return (
        <>
            {deaktivert && (
                <StyledTekst>
                    {index + 1}. {fanenavn}
                </StyledTekst>
            )}
            {!deaktivert && (
                <StyledNavLink
                    key={side.navn}
                    to={`/behandling/${behandlingId}/${side.href}`}
                    onClick={(e) => {
                        e.preventDefault();
                        gåTilUrl(`/behandling/${behandlingId}/${side.href}`);
                    }}
                >
                    <StyledLenketekst>
                        {index + 1}. {fanenavn}
                    </StyledLenketekst>
                </StyledNavLink>
            )}
        </>
    );
};

export default Fane;
