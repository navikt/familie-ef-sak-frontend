import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { OppdaterOpplysninger } from './OppdaterOpplysninger';
import { KopierInngangsvilkår } from './KopierInngangsvilkår';
import { byggTomRessurs, Ressurs } from '../../../../App/typer/ressurs';
import { Behandling } from '../../../../App/typer/fagsak';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { useApp } from '../../../../App/context/AppContext';
import { utledVilkårsgjenbruk } from '../utils';
import { Button } from '@navikt/ds-react';
import { Collapse, Expand } from '@navikt/ds-icons';

const Container = styled.div`
    margin: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const FlexRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const KnappeContainer = styled.div``;

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

    const skalViseGjenbrukVilkår = utledVilkårsgjenbruk(behandlingErRedigerbar, behandling);

    return (
        <Container>
            <FlexRow>
                <OppdaterOpplysninger
                    oppdatertDato={oppdatertDato}
                    behandlingErRedigerbar={behandlingErRedigerbar}
                    oppdaterGrunnlagsdata={oppdaterGrunnlagsdata}
                    behandlingId={behandlingId}
                />
                <KnappeContainer>
                    <Button variant="tertiary" icon={<Collapse />} size="small">
                        Lukk alle
                    </Button>
                    <Button variant="tertiary" icon={<Expand />} size="small">
                        Åpne alle
                    </Button>
                </KnappeContainer>
            </FlexRow>
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
