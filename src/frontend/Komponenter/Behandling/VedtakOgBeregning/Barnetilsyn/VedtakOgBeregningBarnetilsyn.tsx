import React, { FC } from 'react';
import { Behandling } from '../../../../App/typer/fagsak';
import { IVilkår } from '../../Inngangsvilkår/vilkår';

interface Props {
    behandling?: Behandling;
    vilkår?: IVilkår;
}

const VedtakOgBeregningBarnetilsyn: FC<Props> = () => {
    return <p>TODO</p>;
};

export default VedtakOgBeregningBarnetilsyn;
