import * as React from 'react';
import { FC, useState } from 'react';
import { IInngangsvilkår, IVurdering } from '../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { Feilmelding } from 'nav-frontend-typografi';
import { VurderingConfig } from '../Inngangsvilkår/config/VurderingConfig';
import { Ressurs } from '../../../typer/ressurs';

const StyledEndreVurdering = styled.div`
    > *:not(:first-child) {
        margin-top: 10px;
    }
`;

interface Props {
    data: IVurdering;
    inngangsvilkår: IInngangsvilkår;
    lagreVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
    feilmelding: string | undefined;
}

const EndreVurdering: FC<Props> = ({ data, lagreVurdering, feilmelding, inngangsvilkår }) => {
    const [vurdering, settVurdering] = useState<IVurdering>(data);
    const [oppdatererVurdering, settOppdatererVurdering] = useState<boolean>(false);

    const oppdaterVurdering: () => void = () => {
        if (!oppdatererVurdering) {
            settOppdatererVurdering(true);
            lagreVurdering(vurdering).then(() => {
                settOppdatererVurdering(false);
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
                inngangsvilkår,
                lagreknappDisabled: oppdatererVurdering,
            })}
            {feilmelding && <Feilmelding>Oppdatering av vilkår feilet: {feilmelding}</Feilmelding>}
        </StyledEndreVurdering>
    );
};
export default EndreVurdering;
