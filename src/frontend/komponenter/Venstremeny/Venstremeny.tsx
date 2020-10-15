import * as React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router';
import { IBehandlingParams } from '../../typer/routing';
import { sider } from './sider';
import { NavLink } from 'react-router-dom';
import { styles } from '../../typer/styles';
import { Normaltekst } from 'nav-frontend-typografi';

const StyledVenstremeny = styled.nav`
    display: flex;
    flex: 1;
    flex-direction: column;
`;

const StyledNavLink = styled(NavLink)`
    border-left: 5px solid white;
    padding: 0.5rem 4rem 0.5rem 2rem;
    text-decoration: none;
    color: inherit;

    :hover {
        border-left: 5px solid ${styles.farger.navBlaLighten20};
        .typo-normal {
            color: ${styles.farger.navBla};
        }
    }

    &.aktiv {
        background-color: ${styles.farger.navLysGra};
        border-left: 5px solid ${styles.farger.navBla};

        .typo-normal {
            font-weight: bold;
        }
    }
`;

const Venstremeny: React.FC = () => {
    const { behandlingId } = useParams<IBehandlingParams>();
    return (
        <StyledVenstremeny>
            {sider.map((side) => (
                <StyledNavLink
                    to={`/behandling/${behandlingId}/${side.href}`}
                    activeClassName="aktiv"
                >
                    <Normaltekst>{side.navn}</Normaltekst>
                </StyledNavLink>
            ))}
        </StyledVenstremeny>
    );
};

export default Venstremeny;
