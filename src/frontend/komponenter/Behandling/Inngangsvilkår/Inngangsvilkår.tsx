import React, { FC, useState } from 'react';
import { IInngangsvilkår, IVurdering, VilkårGruppe } from './vilkår';
import { byggTomRessurs, Ressurs, RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';
import styled from 'styled-components';
import Vurdering from '../Vurdering/Vurdering';

const StyledInngangsvilkår = styled.div`
    margin: 2rem;
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-auto-rows: auto;
    grid-gap: 3rem;
`;

interface Props {
    behandlingId: string;
}

const oppdaterInngangsvilkårMedVurdering = (
    inngangsvilkår: RessursSuksess<IInngangsvilkår>,
    vurdering: IVurdering
) => ({
    ...inngangsvilkår,
    data: {
        ...inngangsvilkår.data,
        vurderinger: inngangsvilkår.data.vurderinger.map((tidligereVurdering) =>
            tidligereVurdering.id === vurdering.id ? vurdering : tidligereVurdering
        ),
    },
});

const Inngangsvilkår: FC<Props> = ({ behandlingId }) => {
    const [inngangsvilkår, settInngangsvilkår] = useState<Ressurs<IInngangsvilkår>>(
        byggTomRessurs()
    );
    const { axiosRequest } = useApp();

    const hentInngangsvilkår = (behandlingId: string) => {
        axiosRequest<IInngangsvilkår, void>({
            method: 'GET',
            url: `/familie-ef-sak/api/vurdering/${behandlingId}/inngangsvilkar`,
        }).then((hentetInngangsvilkår: Ressurs<IInngangsvilkår>) => {
            settInngangsvilkår(hentetInngangsvilkår);
        });
    };

    const lagreVurdering = (vurdering: IVurdering): Promise<Ressurs<string>> => {
        return axiosRequest<string, IVurdering>({
            method: 'POST',
            url: `/familie-ef-sak/api/vurdering/inngangsvilkar`,
            data: vurdering,
        }).then((respons: Ressurs<string>) => {
            if (respons.status === RessursStatus.SUKSESS) {
                settInngangsvilkår((prevInngangsvilkår: Ressurs<IInngangsvilkår>) =>
                    oppdaterInngangsvilkårMedVurdering(
                        prevInngangsvilkår as RessursSuksess<IInngangsvilkår>, // prevInngangsvilkår kan ikke være != SUKESS her
                        vurdering
                    )
                );
            }
            return respons;
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
                <StyledInngangsvilkår>
                    {Object.keys(VilkårGruppe).map((vilkårGruppe) => (
                        <Vurdering
                            key={vilkårGruppe}
                            vilkårGruppe={vilkårGruppe as VilkårGruppe}
                            inngangsvilkår={inngangsvilkår.data}
                            lagreVurdering={lagreVurdering}
                        />
                    ))}
                </StyledInngangsvilkår>
            )}
        </>
    );
};

export default Inngangsvilkår;
