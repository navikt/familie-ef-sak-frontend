import * as React from 'react';
import { FC, useState } from 'react';
import { IInngangsvilkårGrunnlag, IVurdering, Redigeringsmodus } from '../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { Feilmelding } from 'nav-frontend-typografi';
import { VurderingConfig } from '../Inngangsvilkår/config/VurderingConfig';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';

const StyledEndreVurdering = styled.div`
    > *:not(:first-child) {
        margin-top: 10px;
    }
`;

interface Props {
    data: IVurdering;
    inngangsvilkårgrunnlag: IInngangsvilkårGrunnlag;
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
        </StyledEndreVurdering>
    );
};
export default EndreVurdering;
