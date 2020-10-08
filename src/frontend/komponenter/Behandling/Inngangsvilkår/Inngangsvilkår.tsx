import React, { FC, useState } from 'react';
import { IInngangsvilkår, IVurdering } from './vilkår';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';
import styled from 'styled-components';
import Vurdering from '../Vurdering/Vurdering';
import { VilkårDel } from '../Vurdering/VurderingConfig';
import MedlemskapVisning from './Medlemskap/MedlemskapVisning';

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

    const oppdaterVurdering = (vurdering: IVurdering) => {
        return axiosRequest<string, IVurdering>({
            method: 'POST',
            url: `/familie-ef-sak/api/vurdering/inngangsvilkar`,
            data: vurdering,
        }).then((respons: Ressurs<string>) => {
            if (
                inngangsvilkår.status === RessursStatus.SUKSESS &&
                respons.status === RessursStatus.SUKSESS
            ) {
                settInngangsvilkår((prevInngangsvilkår) => {
                    if (prevInngangsvilkår.status === RessursStatus.SUKSESS) {
                        return {
                            ...prevInngangsvilkår,
                            data: {
                                ...prevInngangsvilkår.data,
                                vurderinger: prevInngangsvilkår.data.vurderinger.map(
                                    (tidligereVurdering) => {
                                        return tidligereVurdering.id === vurdering.id
                                            ? vurdering
                                            : tidligereVurdering;
                                    }
                                ),
                            },
                        };
                    } else {
                        return prevInngangsvilkår;
                    }
                });
            } else if (
                respons.status === RessursStatus.IKKE_TILGANG ||
                respons.status === RessursStatus.FEILET
            ) {
                throw new Error(respons.frontendFeilmelding);
            } else throw new Error(`Response fra servern: ${respons.status}`);
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
                    <Vurdering
                        vilkårDel={VilkårDel.MEDLEMSKAP}
                        vurderinger={inngangsvilkår.data.vurderinger}
                        oppdaterVurdering={oppdaterVurdering}
                        visning={(erOppfylt: boolean) => (
                            <MedlemskapVisning
                                medlemskap={inngangsvilkår.data.medlemskap}
                                erOppfylt={erOppfylt}
                            />
                        )}
                    />
                    <Vurdering
                        vilkårDel={VilkårDel.MEDLEMSKAP}
                        vurderinger={inngangsvilkår.data.vurderinger}
                        oppdaterVurdering={oppdaterVurdering}
                        visning={(erOppfylt: boolean) => (
                            <MedlemskapVisning
                                medlemskap={inngangsvilkår.data.medlemskap}
                                erOppfylt={erOppfylt}
                            />
                        )}
                    />
                </StyledInngangsvilkår>
            )}
        </>
    );
};

export default Inngangsvilkår;
