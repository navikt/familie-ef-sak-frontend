import * as React from 'react';
import { FC, useState } from 'react';
import { IVurdering } from '../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { Ressurs } from '@navikt/familie-typer';
import { IVilkårConfig } from '../Inngangsvilkår/config/VurderingConfig';

const StyledEndreVurdering = styled.div`
    > *:not(:first-child) {
        margin-top: 10px;
    }
`;

interface Props {
    config: IVilkårConfig;
    data: IVurdering;
    oppdaterVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
    settRedigeringsmodus: (erRedigeringsmodus: boolean) => void;
}

const EndreVurdering: FC<Props> = ({ config, data, oppdaterVurdering, settRedigeringsmodus }) => {
    const [vurdering, settVurdering] = useState<IVurdering>(data);
    return (
        <StyledEndreVurdering>
            {config.vurdering({
                config,
                vurdering,
                settVurdering,
                oppdaterVurdering,
                settRedigeringsmodus,
            })}
        </StyledEndreVurdering>
    );
};
export default EndreVurdering;
