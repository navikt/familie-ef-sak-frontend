import * as React from 'react';
import { FC, useState } from 'react';
import { BegrunnelseRegel, Regler } from './typer';
import {
    IDelvilkår,
    IVurdering,
    OppdaterVilkårsvurdering,
    VilkårType,
    Vurdering,
} from '../Inngangsvilkår/vilkår';
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
    oppdaterVurdering: (vurdering: OppdaterVilkårsvurdering) => void;
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

    const oppdaterBegrunnelse = (vurderinger: Vurdering[], index: number, nyttSvar: Vurdering) => {
        const { begrunnelse } = nyttSvar;

        const oppdaterteSvar = oppdaterSvarIListe(nyttSvar, vurderinger, true);

        const svarsalternativ = hentSvarsalternativ(regler, nyttSvar)!;
        const nesteStegId = svarsalternativ.regelId;

        const maybeLeggTilNesteNodIVilkårsvar = leggTilNesteIdHvis(
            nesteStegId,
            oppdaterteSvar,
            () =>
                nesteStegId !== 'SLUTT_NODE' &&
                begrunnelseErPåkrevdOgUtfyllt(svarsalternativ, begrunnelse) &&
                !vurderinger.find((v) => v.regelId === nesteStegId)
        );

        oppdateterVilkårsvar(index, maybeLeggTilNesteNodIVilkårsvar);
    };

    const oppdaterSvar = (vurderinger: Vurdering[], index: number, nyttSvar: Vurdering) => {
        const oppdaterteSvar = oppdaterSvarIListe(nyttSvar, vurderinger);
        const svarsalternativer = hentSvarsalternativ(regler, nyttSvar)!;
        const maybeLeggTilNesteNodIVilkårsvar = leggTilNesteIdHvis(
            svarsalternativer.regelId,
            oppdaterteSvar,
            () =>
                svarsalternativer.regelId !== 'SLUTT_NODE' &&
                svarsalternativer.begrunnelseType !== BegrunnelseRegel.PÅKREVD
        );

        oppdateterVilkårsvar(index, maybeLeggTilNesteNodIVilkårsvar);
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
                return delvikår.vurderinger.map((svar) => {
                    const regel = regler[svar.regelId];
                    return (
                        <React.Fragment key={regel.regelId}>
                            <Delvilkår
                                vurdering={svar}
                                regel={regel}
                                settVurdering={(nyVurdering) =>
                                    oppdaterSvar(delvikår.vurderinger, index, nyVurdering)
                                }
                            />
                            <Begrunnelse
                                onChange={(begrunnelse) =>
                                    oppdaterBegrunnelse(delvikår.vurderinger, index, {
                                        ...svar,
                                        begrunnelse,
                                    })
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
