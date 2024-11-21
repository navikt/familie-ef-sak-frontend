import * as React from 'react';
import { FC, useCallback, useEffect, useState } from 'react';
import { BegrunnelseRegel, Regler, Svarsalternativ } from './typer';
import {
    IDelvilkår,
    IVurdering,
    SvarPåVilkårsvurdering,
    VilkårType,
    Vurdering,
} from '../Inngangsvilkår/vilkår';
import {
    begrunnelseErPåkrevdOgUtfyllt,
    erAlleDelvilkårBesvarte,
    filtrerHistoriskeDelvilkår,
    hentSvarsalternativ,
    kanHaBegrunnelse,
    kopierBegrunnelse,
    leggTilNesteIdHvis,
    oppdaterSvarIListe,
} from './utils';
import Begrunnelse from './Begrunnelse';
import Delvilkår from './Delvilkår';
import { useApp } from '../../../App/context/AppContext';
import { Button, VStack } from '@navikt/ds-react';
import styled from 'styled-components';
import {
    EkspandertTilstand,
    useEkspanderbareVilkårpanelContext,
} from '../../../App/context/EkspanderbareVilkårpanelContext';
import { GjenbrukInngangsvilkår } from '../Inngangsvilkår/GjenbrukInngangsvilkår';
import { RessursStatus } from '../../../App/typer/ressurs';
import { Behandling } from '../../../App/typer/fagsak';

const LagreKnapp = styled(Button)`
    margin-top: 1rem;
`;

const DelvilkårContainer = styled(VStack)`
    margin-bottom: 1rem;
`;

const EndreVurderingComponent: FC<{
    vilkårType: VilkårType;
    regler: Regler;
    oppdaterVurdering: (vurdering: SvarPåVilkårsvurdering) => void;
    vurdering: IVurdering;
    skalGjenbrukeVilkår: boolean;
    vilkårGjenbruk: IVurdering | null;
}> = ({ regler, oppdaterVurdering, vurdering, skalGjenbrukeVilkår, vilkårGjenbruk }) => {
    const { nullstillIkkePersistertKomponent, settIkkePersistertKomponent } = useApp();
    const { settPanelITilstand } = useEkspanderbareVilkårpanelContext();

    const [delvilkårsvurderinger, settDelvilkårsvurderinger] = useState<IDelvilkår[]>([]);

    useEffect(() => {
        const skallBrukeGjenbruk = skalGjenbrukeVilkår && vilkårGjenbruk !== null;
        settDelvilkårsvurderinger(
            filtrerHistoriskeDelvilkår(
                skallBrukeGjenbruk
                    ? vilkårGjenbruk!.delvilkårsvurderinger
                    : vurdering.delvilkårsvurderinger,
                regler
            )
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skalGjenbrukeVilkår, vilkårGjenbruk]);

    const oppdaterVilkårsvar = (index: number, nySvarArray: Vurdering[]) => {
        settDelvilkårsvurderinger((prevSvar) => {
            const prevDelvilkårsvurdering = prevSvar[index];
            return [
                ...prevSvar.slice(0, index),
                {
                    ...prevDelvilkårsvurdering,
                    vurderinger: nySvarArray,
                },
                ...prevSvar.slice(index + 1),
            ];
        });
    };

    const oppdaterBegrunnelse = (
        vurderinger: Vurdering[],
        delvilkårIndex: number,
        nyttSvar: Vurdering
    ) => {
        const { begrunnelse } = nyttSvar;
        const svarsalternativ: Svarsalternativ | undefined = hentSvarsalternativ(regler, nyttSvar);
        if (!svarsalternativ) {
            return;
        }

        const oppdaterteSvar = oppdaterSvarIListe(nyttSvar, vurderinger, true);

        const oppdaterteSvarMedNesteRegel = leggTilNesteIdHvis(
            svarsalternativ.regelId,
            oppdaterteSvar,
            () => begrunnelseErPåkrevdOgUtfyllt(svarsalternativ, begrunnelse)
        );
        oppdaterVilkårsvar(delvilkårIndex, oppdaterteSvarMedNesteRegel);
        settIkkePersistertKomponent(vurdering.id);
    };

    const oppdaterSvar = (
        vurderinger: Vurdering[],
        delvilkårIndex: number,
        nyttSvar: Vurdering
    ) => {
        const svarsalternativer: Svarsalternativ | undefined = hentSvarsalternativ(
            regler,
            nyttSvar
        );
        if (!svarsalternativer) {
            return;
        }
        const oppdaterteSvar = oppdaterSvarIListe(
            nyttSvar,
            vurderinger,
            false,
            kanHaBegrunnelse(svarsalternativer)
        );

        const oppdaterteSvarMedNesteRegel = leggTilNesteIdHvis(
            svarsalternativer.regelId,
            oppdaterteSvar,
            () => svarsalternativer.begrunnelseType !== BegrunnelseRegel.PÅKREVD
        );
        const oppdaterteSvarMedKopiertBegrunnelse = kopierBegrunnelse(
            vurderinger,
            oppdaterteSvarMedNesteRegel,
            nyttSvar,
            svarsalternativer,
            regler
        );
        oppdaterVilkårsvar(delvilkårIndex, oppdaterteSvarMedKopiertBegrunnelse);
        settIkkePersistertKomponent(vurdering.id);
    };

    const skalViseLagreKnapp = erAlleDelvilkårBesvarte(delvilkårsvurderinger, regler);

    const håndterTrykkPåLagre = () => {
        nullstillIkkePersistertKomponent(vurdering.id);
        settPanelITilstand(vurdering.vilkårType, EkspandertTilstand.EKSPANDERT);
    };

    const [behandlingerForVilkårsgjenbruk, settbehandlingerForVilkårsgjenbruk] = useState<
        Behandling[]
    >([]);
    const { axiosRequest } = useApp();

    const finnBehandlingForGjenbrukAvVilkår = useCallback(
        async (behandlingId: string): Promise<Behandling[] | null> => {
            try {
                const respons = await axiosRequest<Behandling[], { behandlingId: string }>({
                    method: 'GET',
                    url: `/familie-ef-sak/api/behandling/gjenbruk/${behandlingId}`,
                });
                if (respons.status === RessursStatus.SUKSESS) {
                    settbehandlingerForVilkårsgjenbruk(respons.data);
                }
                return null;
            } catch {
                return null;
            }
        },
        [axiosRequest]
    );

    useEffect(() => {
        if (vilkårGjenbruk) {
            finnBehandlingForGjenbrukAvVilkår(vilkårGjenbruk?.behandlingId);
        }
    }, [vilkårGjenbruk, finnBehandlingForGjenbrukAvVilkår]);

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                oppdaterVurdering({
                    id: vurdering.id,
                    behandlingId: vurdering.behandlingId,
                    delvilkårsvurderinger,
                });
            }}
        >
            {delvilkårsvurderinger.map((delvilkår, delvilkårIndex) => {
                return delvilkår.vurderinger.map((svar) => {
                    const regel = regler[svar.regelId];

                    return (
                        <DelvilkårContainer key={regel.regelId} gap="3">
                            {skalGjenbrukeVilkår && vilkårGjenbruk && (
                                <GjenbrukInngangsvilkår
                                    behandlinger={behandlingerForVilkårsgjenbruk}
                                />
                            )}
                            <Delvilkår
                                vurdering={svar}
                                regel={regel}
                                settVurdering={(nyVurdering) =>
                                    oppdaterSvar(delvilkår.vurderinger, delvilkårIndex, nyVurdering)
                                }
                            />
                            <Begrunnelse
                                onChange={(begrunnelse) =>
                                    oppdaterBegrunnelse(delvilkår.vurderinger, delvilkårIndex, {
                                        ...svar,
                                        begrunnelse,
                                    })
                                }
                                svar={svar}
                                regel={regel}
                            />
                        </DelvilkårContainer>
                    );
                });
            })}
            {skalViseLagreKnapp && (
                <LagreKnapp onClick={håndterTrykkPåLagre} type={'submit'}>
                    Lagre
                </LagreKnapp>
            )}
        </form>
    );
};

export default EndreVurderingComponent;
