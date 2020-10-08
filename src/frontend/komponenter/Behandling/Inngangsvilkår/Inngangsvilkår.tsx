import React, { FC, useState } from 'react';
import Vilkårsvisning from './Vilkårsvisning';
import { IInngangsvilkår } from './vilkår';
import { byggFeiletRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';
import { AxiosError } from 'axios';
import { useApp } from '../../../context/AppContext';
import AnyData from '../../Sak/AnyData';

interface Props {
    behandlingId: string;
}

const Inngangsvilkår: FC<Props> = ({ behandlingId }) => {
    const [inngangsvilkår, settInngangsvilkår] = useState<Ressurs<IInngangsvilkår>>(
        byggTomRessurs()
    );
    const { axiosRequest } = useApp();

    const hentInngangsvilkår = (behandlingId: string) => {
        axiosRequest<IInngangsvilkår, void>({
            method: 'GET',
            url: `/familie-ef-sak/api/vurdering/${behandlingId}/inngangsvilkar`,
        })
            .then((hentetInngangsvilkår: Ressurs<IInngangsvilkår>) => {
                settInngangsvilkår(hentetInngangsvilkår);
            })
            .catch((error: AxiosError) => {
                settInngangsvilkår(
                    byggFeiletRessurs('Ukjent ved innhenting av inngangsvilkår', error)
                );
            });
    };

    React.useEffect(() => {
        if (behandlingId !== undefined) {
            if (inngangsvilkår.status !== RessursStatus.SUKSESS) {
                hentInngangsvilkår(behandlingId);
            }
        }
    }, [behandlingId]);

    return (
        <>
            {inngangsvilkår.status === RessursStatus.SUKSESS && (
                <>
                    <Vilkårsvisning inngangsvilkår={inngangsvilkår.data} />
                    <AnyData data={inngangsvilkår.data} />
                </>
            )}
        </>
    );
};

export default Inngangsvilkår;
