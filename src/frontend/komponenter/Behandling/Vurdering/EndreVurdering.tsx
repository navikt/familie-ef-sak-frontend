import * as React from 'react';
import { FC, useState } from 'react';
import { IVilkårGrunnlag, IVurdering, Redigeringsmodus } from '../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { Feilmelding } from 'nav-frontend-typografi';
import { VurderingConfig } from '../Inngangsvilkår/config/VurderingConfig';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import EndreVurderingComponent from './EndreVurderingComponent';
import { useBehandling } from '../../../context/BehandlingContext';

const StyledEndreVurdering = styled.div`
    > *:not(:first-child) {
        margin-top: 10px;
    }
`;

interface Props {
    data: IVurdering;
    inngangsvilkårgrunnlag: IVilkårGrunnlag;
    lagreVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
    settRedigeringsmodus: (verdi: Redigeringsmodus) => void;
    feilmelding: string | undefined;
}

const EndreVurdering: FC<Props> = ({
    data,
    lagreVurdering,
    feilmelding,
    inngangsvilkårgrunnlag,
    settRedigeringsmodus,
}) => {
    const { regler } = useBehandling();
    const [vurdering, settVurdering] = useState<IVurdering>(data);
    const [oppdatererVurdering, settOppdatererVurdering] = useState<boolean>(false);

    const oppdaterVurdering: () => void = () => {
        if (!oppdatererVurdering) {
            settOppdatererVurdering(true);
            lagreVurdering(vurdering).then((response) => {
                settOppdatererVurdering(false);
                if (response.status === RessursStatus.SUKSESS) {
                    settRedigeringsmodus(Redigeringsmodus.VISNING);
                }
            });
        }
    };

    const config = VurderingConfig[vurdering.vilkårType];
    if (!config) {
        return <div>Mangler config for {vurdering.vilkårType}</div>;
    }

    return (
        <StyledEndreVurdering>
            {config.renderVurdering({
                config,
                vurdering,
                settVurdering,
                oppdaterVurdering,
                inngangsvilkårgrunnlag,
                lagreknappDisabled: oppdatererVurdering,
            })}
            {feilmelding && <Feilmelding>Oppdatering av vilkår feilet: {feilmelding}</Feilmelding>}
            {regler.status === RessursStatus.SUKSESS && (
                <EndreVurderingComponent
                    oppdaterVurdering={oppdaterVurdering}
                    vilkårType={vurdering.vilkårType}
                    regler={regler.data.vilkårsregler[vurdering.vilkårType].regler}
                    rotregler={regler.data.vilkårsregler[vurdering.vilkårType].rotregler}
                />
            )}
        </StyledEndreVurdering>
    );
};
export default EndreVurdering;
