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
}

export const InngangsvilkårHeader: React.FC<Props> = ({
    oppdatertDato,
    behandlingErRedigerbar,
    oppdaterGrunnlagsdata,
    behandlingId,
    behandling,
}) => {
    const [behandlingForVilkårsgjenbruk, settbehandlingForVilkårsgjenbruk] = useState<
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
                settbehandlingForVilkårsgjenbruk(respons);
            });
        },
        [axiosRequest]
    );

    useEffect(() => {
        finnBehandlingForGjenbrukAvVilkår(behandling.id);
    }, [behandling, finnBehandlingForGjenbrukAvVilkår]);

    return (
        <Container>
            <OppdaterOpplysninger
                oppdatertDato={oppdatertDato}
                behandlingErRedigerbar={behandlingErRedigerbar}
                oppdaterGrunnlagsdata={oppdaterGrunnlagsdata}
                behandlingId={behandlingId}
            />
            {toggles[ToggleName.visGjenbrukAvVilkår] && behandlingErRedigerbar && (
                <DataViewer response={{ behandlingForVilkårsgjenbruk }}>
                    {({ behandlingForVilkårsgjenbruk }) =>
                        behandlingForVilkårsgjenbruk.length > 0 ? (
                            <KopierInngangsvilkår behandlinger={behandlingForVilkårsgjenbruk} />
                        ) : (
                            <></>
                        )
                    }
                </DataViewer>
            )}
        </Container>
    );
};
