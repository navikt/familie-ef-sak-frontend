import * as React from 'react';
import { FC } from 'react';
import { useParams } from 'react-router';
import Inngangsvilkår from './Inngangsvilkår/Inngangsvilkår';
import Vilkårsvisning from './Inngangsvilkår/Vilkårsvisning';

const BehandlingContainer: FC = () => {
    const { behandlingId } = useParams();

    console.log(behandlingId);
    return (
        <>
            cake
            <Vilkårsvisning />
            <Inngangsvilkår behandlingId={behandlingId} />
        </>
    );
};

export default BehandlingContainer;
