import React, { useEffect, useState } from 'react';
import ToKolonnerLayout from '../../../Felles/Visningskomponenter/ToKolonnerLayout';
import IkkeVurdert from '../../../Felles/Ikoner/IkkeVurdert';
import Oppfylt from '../../../Felles/Ikoner/Oppfylt';
import { Undertittel } from 'nav-frontend-typografi';
import styled from 'styled-components';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Revurderingsinformasjon } from './typer';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useApp } from '../../../App/context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import { ÅrsakRevurdering } from './ÅrsakRevurdering';

interface Props {
    behandlingId: string;
}

const FlexDiv = styled.div`
    display: flex;
    gap: 0.5rem;
`;

export const ÅrsakRevurderingSide: React.FC<Props> = ({ behandlingId }) => {
    const { behandling } = useBehandling();
    const { axiosRequest } = useApp();

    const [revurderingsinformasjon, settRevurderingsinformasjon] = useState<
        Ressurs<Revurderingsinformasjon>
    >(byggTomRessurs());

    useEffect(() => {
        axiosRequest<Revurderingsinformasjon, null>({
            url: `/familie-ef-sak/api/revurdering/informasjon/${behandlingId}`,
            method: 'GET',
        }).then(settRevurderingsinformasjon);
    }, [axiosRequest, behandlingId]);

    return (
        <ToKolonnerLayout skillelinje={false}>
            {{
                venstre: (
                    <FlexDiv>
                        <ÅrsakRevurderingIkon oppfylt={true} />
                        <Undertittel>Årsak til revurdering</Undertittel>
                    </FlexDiv>
                ),
                høyre: (
                    <DataViewer response={{ revurderingsinformasjon, behandling }}>
                        {({ revurderingsinformasjon, behandling }) => (
                            <ÅrsakRevurdering
                                revurderingsinformasjon={revurderingsinformasjon}
                                behandling={behandling}
                            />
                        )}
                    </DataViewer>
                ),
            }}
        </ToKolonnerLayout>
    );
};

const ÅrsakRevurderingIkon: React.FC<{ oppfylt: boolean }> = ({ oppfylt }) =>
    oppfylt ? <Oppfylt heigth={23} width={21} /> : <IkkeVurdert heigth={23} width={21} />;
