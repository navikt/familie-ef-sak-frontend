import * as React from 'react';
import { FC, useState } from 'react';
import { VilkårType } from '../Inngangsvilkår/vilkår';
import {
    Begrunnelse,
    BegrunnelseRegel,
    RegelId,
    Regler,
    RootVilkårsvar,
    Svarsalternativ,
    Vilkårsvar,
} from './typer';
import { RegelComponent } from './RegelComponent';

function begrunnelseErPåkrevdOgSavnes(svarsalternativ: Svarsalternativ, begrunnelse: Begrunnelse) {
    if (svarsalternativ.begrunnelse === BegrunnelseRegel.PÅKREVD) {
        return begrunnelse && begrunnelse.trim().length > 0;
    }
    return false;
}

/**
 * Skal resette undervilkår, men ikke rootnivå hvis en tidligere endrer seg
 */
const EndreVurderingComponent: FC<{
    vilkårType: VilkårType;
    regler: Regler;
    rotregler: string[];
}> = ({ vilkårType, regler, rotregler }) => {
    const [svar, settSvar] = useState<RootVilkårsvar>(
        Object.values(rotregler).reduce((acc: any, r) => {
            acc[r] = [...(acc[r] || []), { regelId: r }];
            return acc;
        }, {})
    );

    // TODO att man ikke resetter andre svar hvis man kun oppdaterer begrunnelse
    const oppdaterSvar = (rootRegelId: RegelId, nyttSvar: Vilkårsvar) => {
        const { regelId, svarId, begrunnelse } = nyttSvar;
        const svarsliste = svar[rootRegelId];
        const svarIndex = svarsliste.findIndex((s) => s.regelId === regelId);
        const regel = regler[regelId];
        const nySvarArray = svarsliste.slice(0, svarIndex);

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
            {rotregler.map((r) =>
                svar[r].map((svar) => (
                    <RegelComponent
                        key={svar.regelId}
                        regel={regler[svar.regelId]}
                        svar={svar}
                        oppdaterSvar={(svarId) =>
                            oppdaterSvar(r, Object.assign({}, svar, { svarId: svarId }))
                        }
                        opppdaterBegrunnelse={(begrunnelse) =>
                            oppdaterSvar(r, Object.assign({}, svar, { begrunnelse: begrunnelse }))
                        }
                    />
                ))
            )}
        </div>
    );
};

export default EndreVurderingComponent;
