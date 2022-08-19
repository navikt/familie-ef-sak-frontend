import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { filtrerSiderEtterBehandlingstype, ISide, SideNavn } from './sider';
import { useBehandling } from '../../../App/context/BehandlingContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Sticky } from '../../../Felles/Visningskomponenter/Sticky';
import navFarger from 'nav-frontend-core';
import { Steg } from '../Høyremeny/Steg';
import Fane from './Fane';
import { useApp } from '../../../App/context/AppContext';

const StickyMedBoxShadow = styled(Sticky)`
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
    top: 6.5rem;
`;

const StyledFanemeny = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-bottom: ${navFarger.navGra40} solid 2px;
    background-color: ${navFarger.white};
`;
interface Props {
    behandlingId: string;
}

const Fanemeny: FC<Props> = ({ behandlingId }) => {
    const { behandling, behandlingErRedigerbar } = useBehandling();
    const { erSaksbehandler } = useApp();
    const låsendeSteg = [Steg.VILKÅR, Steg.BEREGNE_YTELSE];
    const fanerSomKanLåses = [SideNavn.SIMULERING, SideNavn.BREV, SideNavn.KORRIGERING_UTEN_BREV];
    const fanerSomErLåstForVeilederUnderArbeid = [
        SideNavn.VEDTAK_OG_BEREGNING,
        SideNavn.SIMULERING,
        SideNavn.BREV,
        SideNavn.KORRIGERING_UTEN_BREV,
    ];
    const faneErLåst = (side: ISide, steg: Steg): boolean => {
        if (behandlingErRedigerbar && !erSaksbehandler) {
            return fanerSomErLåstForVeilederUnderArbeid.includes(side.navn as SideNavn);
        }
        return fanerSomKanLåses.includes(side.navn as SideNavn) && låsendeSteg.includes(steg);
    };

    return (
        <DataViewer response={{ behandling }}>
            {({ behandling }) => (
                <>
                    <StickyMedBoxShadow>
                        <StyledFanemeny>
                            {filtrerSiderEtterBehandlingstype(behandling).map((side, index) => (
                                <Fane
                                    side={side}
                                    behandlingId={behandlingId}
                                    index={index}
                                    deaktivert={faneErLåst(side, behandling.steg)}
                                    key={index}
                                />
                            ))}
                        </StyledFanemeny>
                    </StickyMedBoxShadow>
                </>
            )}
        </DataViewer>
    );
};

export default Fanemeny;
