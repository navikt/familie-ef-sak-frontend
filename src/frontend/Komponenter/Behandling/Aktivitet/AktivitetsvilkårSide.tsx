import React, { FC } from 'react';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import AktivitetsVilkårBarnetilsyn from './AktivitetsvilkårBarnetilsyn';
import AktivitetsVilkårSkolepenger from './AktivitetsvilkårSkolepenger';
import { AktivitetsvilkårHeader } from './AktivitetsvilkårHeader';
import { Behandling } from '../../../App/typer/fagsak';
import AktivitetsVilkårOvergangsstønad from './AktivitetsvilkårOvergangsstønad';

interface Props {
    behandling: Behandling;
}

export const AktivitetsvilkårSide: FC<Props> = ({ behandling }) => (
    <>
        <AktivitetsvilkårHeader />
        <AktivitetsVilkår behandling={behandling} />
    </>
);

const AktivitetsVilkår: FC<Props> = ({ behandling }) => {
    switch (behandling.stønadstype) {
        case Stønadstype.OVERGANGSSTØNAD:
            return <AktivitetsVilkårOvergangsstønad behandling={behandling} />;
        case Stønadstype.BARNETILSYN:
            return <AktivitetsVilkårBarnetilsyn behandling={behandling} />;
        case Stønadstype.SKOLEPENGER:
            return <AktivitetsVilkårSkolepenger behandling={behandling} />;
    }
};
