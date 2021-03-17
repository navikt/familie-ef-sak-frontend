import * as React from 'react';
import { FC, useState } from 'react';
import {
    RegelId,
    Regler,
    RootVilkårsvar,
    Vilkårsvar,
} from './typer';
import { RegelComponent } from './RegelComponent';
import { VilkårType } from '../Inngangsvilkår/vilkår';
import {begrunnelseErPåkrevdOgSavnes, leggTilRegelIdISvarliste} from "./utils";
/**
 * Skal resette undervilkår, men ikke rootnivå hvis en tidligere endrer seg
 */

const EndreVurderingComponent: FC<{
    vilkårType: VilkårType;
    regler: Regler;
    rotregler: string[];
}> = ({ regler, rotregler }) => {
    const [svar, settSvar] = useState<RootVilkårsvar>(
        rotregler.reduce((acc, rootregel) => {
            return leggTilRegelIdISvarliste(acc, rootregel);
        }, {} as RootVilkårsvar)
    );

    const oppdaterBegrunnelse = (rootRegelId: RegelId, nyttSvar: Vilkårsvar) => {
        const { svarId } = nyttSvar;
        const svarsliste = svar[rootRegelId];

        const nySvarArray = svarsliste.map((v) => {
            if (v.svarId === svarId) {
                return nyttSvar;
            } else {
                return v;
            }
        });
        settSvar((prevSvar) => ({ ...prevSvar, [rootRegelId]: nySvarArray }));
    };

    // TODO att man ikke resetter andre svar hvis man kun oppdaterer begrunnelse
    const oppdaterSvar = (rootRegelId: RegelId, nyttSvar: Vilkårsvar) => {
        const { regelId, svarId, begrunnelse } = nyttSvar;
        const svarsliste = svar[rootRegelId];
        const svarIndex = svarsliste.findIndex((s) => s.regelId === regelId);
        const nySvarArray = svarsliste.slice(0, svarIndex);
        const regel = regler[regelId];

        if (!svarId) {
            return;
        }
        const svarsalternativ = regel.svarMapping[svarId];

        if (begrunnelseErPåkrevdOgSavnes(svarsalternativ, begrunnelse)) {
            settSvar(Object.assign({}, svar, { [rootRegelId]: [...nySvarArray, nyttSvar] }));
            return;
        }
        const nesteStegId = svarsalternativ.regelId;
        if (nesteStegId === 'SLUTT_NODE') {
            //TODO Done
            settSvar(Object.assign({}, svar, { [rootRegelId]: [...nySvarArray, nyttSvar] }));
        } else {
            settSvar(
                Object.assign({}, svar, {
                    [rootRegelId]: [...nySvarArray, nyttSvar, { regelId: nesteStegId }],
                })
            );
        }
    };

    return (
        <div>
            {rotregler.map((rootRegel) => {
                const vilkårsvar = svar[rootRegel];
                return vilkårsvar.map((svar) => {
                    const regelId = svar.regelId;
                    return (
                        <RegelComponent
                            key={regelId}
                            regel={regler[regelId]}
                            svar={svar}
                            oppdaterSvar={(svarId) => oppdaterSvar(rootRegel, { regelId, svarId })}
                            opppdaterBegrunnelse={(begrunnelse) =>
                                oppdaterBegrunnelse(rootRegel, { ...svar, begrunnelse })
                            }
                        />
                    );
                });
            })}
        </div>
    );
};
export default EndreVurderingComponent;
