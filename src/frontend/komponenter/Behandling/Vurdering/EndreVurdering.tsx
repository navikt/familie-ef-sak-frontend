import * as React from 'react';
import { FC, useState } from 'react';
import { IVurdering, OppdaterVilkårsvurdering } from '../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { Feilmelding } from 'nav-frontend-typografi';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import EndreVurderingComponent from './EndreVurderingComponent';
import { useBehandling } from '../../../context/BehandlingContext';
import { Redigeringsmodus } from './VisEllerEndreVurdering';

const StyledEndreVurdering = styled.div`
    > *:not(:first-child) {
        margin-top: 10px;
    }
`;

interface Props {
    data: IVurdering;
    lagreVurdering: (vurdering: OppdaterVilkårsvurdering) => Promise<Ressurs<IVurdering>>;
    settRedigeringsmodus: (verdi: Redigeringsmodus) => void;
    feilmelding: string | undefined;
}

const EndreVurdering: FC<Props> = ({ data, lagreVurdering, feilmelding, settRedigeringsmodus }) => {
    const { regler, hentBehandling } = useBehandling();
    const vurdering = data;
    const [oppdatererVurdering, settOppdatererVurdering] = useState<boolean>(false);

    const oppdaterVurdering = (vurdering: OppdaterVilkårsvurdering) => {
        if (!oppdatererVurdering) {
            settOppdatererVurdering(true);
            lagreVurdering(vurdering).then((response: any) => {
                settOppdatererVurdering(false);
                if (response.status === RessursStatus.SUKSESS) {
                    settRedigeringsmodus(Redigeringsmodus.VISNING);
                    hentBehandling.rerun();
                }
            });
        }
    };
    return (
        <StyledEndreVurdering>
            {feilmelding && <Feilmelding>Oppdatering av vilkår feilet: {feilmelding}</Feilmelding>}
            {regler.status === RessursStatus.SUKSESS && (
                <EndreVurderingComponent
                    oppdaterVurdering={oppdaterVurdering}
                    vilkårType={vurdering.vilkårType}
                    regler={regler.data.vilkårsregler[vurdering.vilkårType].regler}
                    vurdering={vurdering}
                />
            )}
        </StyledEndreVurdering>
    );
};
export default EndreVurdering;
