import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { filtrerSiderEtterBehandlingstype, ISide, SideNavn } from './sider';
import { useBehandling } from '../../../App/context/BehandlingContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Sticky } from '../../../Felles/Visningskomponenter/Sticky';
import { Steg } from '../Høyremeny/Steg';
import Fane from './Fane';
import { useApp } from '../../../App/context/AppContext';
import { AWhite, ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

const StickyMedBoxShadow = styled(Sticky)`
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
    top: 6.5rem;
    z-index: 22;
`;

const StyledFanemeny = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-bottom: ${ABorderDefault} solid 2px;
    background-color: ${AWhite};
`;

const Fanemeny: FC = () => {
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
                                    behandling={behandling}
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
