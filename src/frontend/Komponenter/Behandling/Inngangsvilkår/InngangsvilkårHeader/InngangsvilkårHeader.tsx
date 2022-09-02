import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { OppdaterOpplysninger } from './OppdaterOpplysninger';
import { KopierInngangsvilkår } from './KopierInngangsvilkår';
import { ToggleName } from '../../../../App/context/toggles';
import { useToggles } from '../../../../App/context/TogglesContext';
import { byggTomRessurs, Ressurs } from '../../../../App/typer/ressurs';
import { Behandling } from '../../../../App/typer/fagsak';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { useApp } from '../../../../App/context/AppContext';
import { utledVilkårsgjenbruk } from '../utils';

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

interface Props {
    oppdatertDato: string;
    behandlingErRedigerbar: boolean;
    oppdaterGrunnlagsdata: (behandlingId: string) => void;
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
    const [behandlingerForVilkårsgjenbruk, settbehandlingerForVilkårsgjenbruk] = useState<
        Ressurs<Behandling[]>
    >(byggTomRessurs());
    const { toggles } = useToggles();
    const { axiosRequest } = useApp();

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

    const skalViseGjenbrukVilkår = utledVilkårsgjenbruk(
        toggles[ToggleName.visGjenbrukAvVilkår],
        behandlingErRedigerbar,
        behandling
    );

    return (
        <Container>
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
        </Container>
    );
};
