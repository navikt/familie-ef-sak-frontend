import * as React from 'react';
import { FC, useState } from 'react';
import { BegrunnelseRegel, Regler } from './typer';
import { IDelvilkår, IVurdering, VilkårType, Vurdering } from '../Inngangsvilkår/vilkår';
import {
    begrunnelseErPåkrevdOgUtfyllt,
    erAllaDelvilkårBesvarte,
    hentSvarsalternativ,
    leggTilNesteIdHvis,
    oppdaterSvarIListe,
} from './utils';

import hiddenIf from '../../Felleskomponenter/HiddenIf/hiddenIf';
import { Hovedknapp } from 'nav-frontend-knapper';
import Begrunnelse from './Begrunnelse';
import Delvilkår from './Delvilkår';

const Lagreknapp = hiddenIf(Hovedknapp);
/**
 * Skal resette undervilkår, men ikke rootnivå hvis en tidligere endrer seg
 */

const EndreVurderingComponent: FC<{
    vilkårType: VilkårType;
    regler: Regler;
    oppdaterVurdering: (vurdering: any) => void;
    vurdering: IVurdering;
}> = ({ regler, oppdaterVurdering, vurdering }) => {
    const [delvilkårsvurderinger, settDelvilkårsvurderinger] = useState<IDelvilkår[]>(
        vurdering.delvilkårsvurderinger
    );

    const oppdateterVilkårsvar = (index: number, nySvarArray: Vurdering[]) => {
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

    const oppdaterBegrunnelse = (vurderinger: Vurdering[], index: number) => {
        return (nyttSvar: Vurdering) => {
            const { begrunnelse } = nyttSvar;

            const nySvarArray = oppdaterSvarIListe(nyttSvar, vurderinger, true);

            const svarsalternativ = hentSvarsalternativ(regler, nyttSvar)!;
            const nesteStegId = svarsalternativ.regelId;

            const leggTilNesteRegelHvis = () => {
                const nestStegErLagtTil = vurderinger.find((v) => v.regelId === nesteStegId);
                return (
                    nesteStegId !== 'SLUTT_NODE' &&
                    begrunnelseErPåkrevdOgUtfyllt(svarsalternativ, begrunnelse) &&
                    !nestStegErLagtTil
                );
            };

            const maybeLeggTilNesteNodIVilkårsvar = leggTilNesteIdHvis(
                nesteStegId,
                nySvarArray,
                () => leggTilNesteRegelHvis()
            );

            oppdateterVilkårsvar(index, maybeLeggTilNesteNodIVilkårsvar);
        };
    };

    const oppdaterSvar = (vurderinger: Vurdering[], index: number) => {
        return (nyttSvar: Vurdering) => {
            const nySvarArray = oppdaterSvarIListe(nyttSvar, vurderinger);
            const svarsalternativer = hentSvarsalternativ(regler, nyttSvar)!;
            const maybeLeggTilNesteNodIVilkårsvar = leggTilNesteIdHvis(
                svarsalternativer.regelId,
                nySvarArray,
                () =>
                    svarsalternativer.regelId !== 'SLUTT_NODE' &&
                    svarsalternativer.begrunnelseType !== BegrunnelseRegel.PÅKREVD
            );

            oppdateterVilkårsvar(index, maybeLeggTilNesteNodIVilkårsvar);
        };
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
            {delvilkårsvurderinger.map((delvikår, index) => {
                const oppdaterSvarINod = oppdaterSvar(delvikår.vurderinger, index);
                const oppdaterBegrunnelseINod = oppdaterBegrunnelse(delvikår.vurderinger, index);
                return delvikår.vurderinger.map((svar) => {
                    const regel = regler[svar.regelId];
                    return (
                        <React.Fragment key={regel.regelId}>
                            <Delvilkår
                                vurdering={svar}
                                regel={regel}
                                settVurdering={oppdaterSvarINod}
                            />
                            <Begrunnelse
                                onChange={(begrunnelse) =>
                                    oppdaterBegrunnelseINod({ ...svar, begrunnelse })
                                }
                                svar={svar}
                                regel={regel}
                            />
                        </React.Fragment>
                    );
                });
            })}
            <Lagreknapp
                htmlType="submit"
                style={{ marginTop: '1rem' }}
                mini
                hidden={!erAllaDelvilkårBesvarte(delvilkårsvurderinger, regler)}
            >
                Lagre
            </Lagreknapp>
        </form>
    );
};
export default EndreVurderingComponent;
