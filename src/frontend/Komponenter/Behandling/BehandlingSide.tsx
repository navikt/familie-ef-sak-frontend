import * as React from 'react';
import { FC, useEffect } from 'react';
import Høyremeny from './Høyremeny/Høyremeny';
import BehandlingRoutes from './BehandlingRoutes';
import { BehandlingProvider, useBehandling } from '../../App/context/BehandlingContext';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { Behandling, Fagsak } from '../../App/typer/fagsak';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import { HenleggModal } from './Modal/HenleggModal';
import { useSetValgtFagsakId } from '../../App/hooks/useSetValgtFagsakId';
import { useSetPersonIdent } from '../../App/hooks/useSetPersonIdent';
import { InfostripeUtestengelse } from './InfostripeUtestengelse';
import { EkspanderbareVilkårpanelProvider } from '../../App/context/EkspanderbareVilkårpanelContext';
import Personopplysningsendringer from './Endring/EndringPersonopplysninger';
import { SettPåVent } from './SettPåVent/SettPåVent';
import { NyEierModal } from './Modal/NyEierModal';
import { Fanemeny } from './Fanemeny/Fanemeny';
import { PersonHeader } from '../../Felles/PersonHeader/PersonHeader';
import clsx from 'clsx';
import styles from './BehandlingSide.module.css';

export const BehandlingSide: FC = () => (
    <BehandlingProvider>
        <Side />
    </BehandlingProvider>
);

const Side: FC = () => {
    const { behandling, fagsak, personopplysningerResponse } = useBehandling();

    useEffect(() => {
        document.title = 'Behandling';
    }, []);

    return (
        <DataViewer response={{ personopplysningerResponse, behandling, fagsak }}>
            {({ personopplysningerResponse, behandling, fagsak }) => (
                <SideInnhold
                    behandling={behandling}
                    fagsak={fagsak}
                    personopplysninger={personopplysningerResponse}
                />
            )}
        </DataViewer>
    );
};

interface Props {
    behandling: Behandling;
    fagsak: Fagsak;
    personopplysninger: IPersonopplysninger;
}

const SideInnhold: FC<Props> = ({ behandling, personopplysninger, fagsak }) => {
    useSetValgtFagsakId(behandling.fagsakId);
    useSetPersonIdent(personopplysninger.personIdent);
    const { åpenHøyremeny } = useBehandling();

    return (
        <>
            <PersonHeader
                personopplysninger={personopplysninger}
                behandling={behandling}
                fagsak={fagsak}
            />
            <div className={styles.container}>
                <div
                    className={clsx(styles.innholdWrapper, {
                        [styles.innholdWrapperAapenHoyremeny]: åpenHøyremeny,
                    })}
                    id="scroll-topp"
                >
                    <Fanemeny behandling={behandling} />
                    <SettPåVent behandling={behandling} />
                    <InfostripeUtestengelse />
                    <Personopplysningsendringer behandlingId={behandling.id} />
                    <EkspanderbareVilkårpanelProvider>
                        <BehandlingRoutes behandling={behandling} />
                    </EkspanderbareVilkårpanelProvider>
                    <HenleggModal behandling={behandling} personopplysninger={personopplysninger} />
                    <NyEierModal />
                </div>
                <div
                    className={clsx(styles.hoyreMenyWrapper, {
                        [styles.hoyreMenyWrapperAapen]: åpenHøyremeny,
                    })}
                >
                    <Høyremeny behandling={behandling} åpenHøyremeny={åpenHøyremeny} />
                </div>
            </div>
        </>
    );
};
