import * as React from 'react';
import { FC, useState } from 'react';
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
}> = ({ regler, oppdaterVurdering, vurdering }) => {
    const { nullstillIkkePersistertKomponent, settIkkePersistertKomponent } = useApp();
    const { settPanelITilstand } = useEkspanderbareVilkårpanelContext();

    const [delvilkårsvurderinger, settDelvilkårsvurderinger] = useState<IDelvilkår[]>(
        filtrerHistoriskeDelvilkår(vurdering.delvilkårsvurderinger, regler)
    );

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
            {/* {skalGjenbrukeVilkår && vilkårGjenbruk && <GjenbrukInngangsvilkår />} */}
            {delvilkårsvurderinger.map((delvilkår, delvilkårIndex) => {
                return delvilkår.vurderinger.map((svar) => {
                    const regel = regler[svar.regelId];

                    return (
                        <DelvilkårContainer key={regel.regelId} gap="3">
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
