import * as React from 'react';
import { FC } from 'react';
import { useParams } from 'react-router';
import Inngangsvilkår from './Inngangsvilkår/Inngangsvilkår';

interface Params {
    behandlingId: string;
}

const BehandlingContainer: FC = () => {
    const { behandlingId } = useParams<Params>();

    return (
        <>
            <Inngangsvilkår behandlingId={behandlingId} />
        </>
    );
};

export default BehandlingContainer;
