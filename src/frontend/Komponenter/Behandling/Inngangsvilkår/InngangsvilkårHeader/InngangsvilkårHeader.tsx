import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { OppdaterOpplysninger } from './OppdaterOpplysninger';
import { KopierInngangsvilkår } from './KopierInngangsvilkår';
import { byggTomRessurs, Ressurs } from '../../../../App/typer/ressurs';
import { Behandling } from '../../../../App/typer/fagsak';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { useApp } from '../../../../App/context/AppContext';
import { utledVilkårsgjenbruk } from '../utils';
import { ÅpneOgLukkePanelKnapper } from './ÅpneOgLukkePanelKnapper';
import {
    EVilkårstyper,
    useEkspanderbareVilkårpanelContext,
} from '../../../../App/context/EkspanderbareVilkårpanelContext';

const FlexRow = styled.div`
    margin: 1rem 2rem;
    display: flex;
    justify-content: space-between;
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const AlignBottom = styled.div`
    align-self: end;
`;

interface Props {
    oppdatertDato: string;
    behandlingErRedigerbar: boolean;
    oppdaterGrunnlagsdata: (behandlingId: string) => Promise<void>;
    behandlingId: string;
    behandling: Behandling;
    gjenbrukInngangsvilkår: (behandlingId: string, kopierBehandlingId: string) => void;
}

export const InngangsvilkårHeader: React.FC<Props> = ({
    oppdatertDato,
    behandlingErRedigerbar,
    oppdaterGrunnlagsdata,
    behandlingId,
    behandling,
    gjenbrukInngangsvilkår,
}) => {
    const [behandlingerForVilkårsgjenbruk, settbehandlingerForVilkårsgjenbruk] =
        useState<Ressurs<Behandling[]>>(byggTomRessurs());
    const { axiosRequest } = useApp();

    const { lukkAlle, åpneAlle } = useEkspanderbareVilkårpanelContext();

    const finnBehandlingForGjenbrukAvVilkår = useCallback(
        (behandlingId: string) => {
            axiosRequest<Behandling[], null>({
                method: 'GET',
                url: `/familie-ef-sak/api/behandling/gjenbruk/${behandlingId}`,
            }).then((respons: Ressurs<Behandling[]>) => {
                settbehandlingerForVilkårsgjenbruk(respons);
            });
        },
        [axiosRequest]
    );

    useEffect(() => {
        finnBehandlingForGjenbrukAvVilkår(behandling.id);
    }, [behandling, finnBehandlingForGjenbrukAvVilkår]);

    const skalViseGjenbrukVilkår = utledVilkårsgjenbruk(behandlingErRedigerbar, behandling);

    return (
        <FlexRow>
            <FlexColumn>
                <OppdaterOpplysninger
                    oppdatertDato={oppdatertDato}
                    behandlingErRedigerbar={behandlingErRedigerbar}
                    oppdaterGrunnlagsdata={oppdaterGrunnlagsdata}
                    behandlingId={behandlingId}
                />
                {skalViseGjenbrukVilkår && (
                    <DataViewer response={{ behandlingerForVilkårsgjenbruk }}>
                        {({ behandlingerForVilkårsgjenbruk }) =>
                            behandlingerForVilkårsgjenbruk.length > 0 ? (
                                <KopierInngangsvilkår
                                    behandlinger={behandlingerForVilkårsgjenbruk}
                                    behandlingId={behandlingId}
                                    gjenbrukInngangsvilkår={gjenbrukInngangsvilkår}
                                />
                            ) : (
                                <></>
                            )
                        }
                    </DataViewer>
                )}
            </FlexColumn>
            <AlignBottom>
                <ÅpneOgLukkePanelKnapper
                    lukkAlle={() => lukkAlle(EVilkårstyper.INNGANGSVILKÅR)}
                    åpneAlle={() => åpneAlle(EVilkårstyper.INNGANGSVILKÅR)}
                />
            </AlignBottom>
        </FlexRow>
    );
};
