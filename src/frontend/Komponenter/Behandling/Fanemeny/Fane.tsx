import * as React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Normaltekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import { ISide } from './sider';
import { useApp } from '../../../App/context/AppContext';

const StyledNavLink = styled(NavLink)`
    border-bottom: 5px solid white;
    color: inherit;
    text-align: center;
    text-decoration: none;
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;

    :hover {
        border-bottom: 5px solid ${navFarger.navBlaLighten20};

        .typo-normal {
            color: ${navFarger.navBla};
        }
    }

    &.aktiv {
        background-color: ${navFarger.navLysGra};
        border-bottom: 5px solid ${navFarger.navBla};

        .typo-normal {
            font-weight: bold;
        }
    }
`;

const StyledTekst = styled(Normaltekst)`
    border-bottom: 5px solid white;
    color: ${navFarger.navGra20};
    text-align: center;
    text-decoration: none;
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;
`;

interface Props {
    side: ISide;
    behandlingId: string;
    index: number;
    deaktivert: boolean;
}

const Fane: React.FC<Props> = ({ side, behandlingId, index, deaktivert }) => {
    const { gåTilUrl } = useApp();

    return (
        <>
            {deaktivert && (
                <StyledTekst>
                    {index + 1}. {side.navn}
                </StyledTekst>
            )}
            {!deaktivert && (
                <StyledNavLink
                    key={side.navn}
                    to={`/behandling/${behandlingId}/${side.href}`}
                    activeClassName="aktiv"
                    onClick={(e) => {
                        e.preventDefault();
                        gåTilUrl(`/behandling/${behandlingId}/${side.href}`);
                    }}
                >
                    <Normaltekst>
                        {index + 1}. {side.navn}
                    </Normaltekst>
                </StyledNavLink>
            )}
        </>
    );
};

export default Fane;
