import React, { FC } from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import AktivitetsVilkårOvergangsstønad from './AktivitetsvilkårOvergangsstønad';
import AktivitetsVilkårBarnetilsyn from './AktivitetsvilkårBarnetilsyn';

const AktivitetsVilkår: FC = () => {
    const { behandling } = useBehandling();

    return (
        <DataViewer response={{ behandling }}>
            {({ behandling }) => {
                switch (behandling.stønadstype) {
                    case Stønadstype.OVERGANGSSTØNAD:
                        return <AktivitetsVilkårOvergangsstønad behandling={behandling} />;
                    case Stønadstype.BARNETILSYN:
                        return <AktivitetsVilkårBarnetilsyn behandling={behandling} />;
                    case Stønadstype.SKOLEPENGER:
                        return null;
                }
            }}
        </DataViewer>
    );
};

export default AktivitetsVilkår;
