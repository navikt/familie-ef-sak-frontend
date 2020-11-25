import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router';
import { IBehandlingParams } from '../../typer/routing';
import { sider } from './sider';
import { Normaltekst } from 'nav-frontend-typografi';
import { NavLink } from 'react-router-dom';
import navFarger from 'nav-frontend-core';

const StyledFanemeny = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`;

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
const Fanemeny: FC = () => {
    const { behandlingId } = useParams<IBehandlingParams>();

    return (
        <StyledFanemeny>
            {sider.map((side) => (
                <StyledNavLink
                    to={`/behandling/${behandlingId}/${side.href}`}
                    activeClassName="aktiv"
                >
                    <Normaltekst>{side.navn}</Normaltekst>
                </StyledNavLink>
            ))}
        </StyledFanemeny>
    );
};

export default Fanemeny;
