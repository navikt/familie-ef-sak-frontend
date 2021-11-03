import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { NavLink, useParams } from 'react-router-dom';
import { IBehandlingParams } from '../../../App/typer/routing';
import { filtrerSiderEtterBehandlingstype, sider } from './sider';
import { Normaltekst } from 'nav-frontend-typografi';
import { useBehandling } from '../../../App/context/BehandlingContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Sticky } from '../../../Felles/Visningskomponenter/Sticky';
import navFarger from 'nav-frontend-core';
import { useApp } from '../../../App/context/AppContext';

const StickyMedBoxShadow = styled(Sticky)`
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
    top: 96px;
`;

const StyledFanemeny = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-bottom: ${navFarger.navGra40} solid 2px;
    background-color: ${navFarger.white};
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
    const { behandling } = useBehandling();
    const { gåTilUrl } = useApp();

    return (
        <DataViewer response={{ behandling }}>
            {({ behandling }) => (
                <>
                    <StickyMedBoxShadow>
                        <StyledFanemeny>
                            {filtrerSiderEtterBehandlingstype(sider, behandling).map(
                                (side, index) => (
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
                                )
                            )}
                        </StyledFanemeny>
                    </StickyMedBoxShadow>
                </>
            )}
        </DataViewer>
    );
};

export default Fanemeny;
