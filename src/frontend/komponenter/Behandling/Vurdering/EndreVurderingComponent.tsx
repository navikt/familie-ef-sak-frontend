import * as React from 'react';
import { FC, useState } from 'react';
import { VilkårType } from '../Inngangsvilkår/vilkår';
import {
    Begrunnelse,
    BegrunnelseRegel,
    ReglerResponse,
    RootVilkårSvar,
    Svar,
    Svarsalternativ,
} from './typer';
import {RegelComponent} from "./RegelComponent";

function begrunnelseErPåkrevdOgSavnes(svarsalternativ: Svarsalternativ, begrunnelse: Begrunnelse) {
    if (svarsalternativ.begrunnelse === BegrunnelseRegel.PÅKREVD) {
        return begrunnelse && begrunnelse.trim().length > 0;
    }
    return false;
}

/**
 * Skal resette undervilkår, men ikke rootnivå hvis en tidligere endrer seg
 */
const EndreVurderingComponent: FC<{ vilkårType: VilkårType; reglerConfig: ReglerResponse }> = ({
    vilkårType,
    reglerConfig,
}) => {
    const [svar, settSvar] = useState<RootVilkårSvar>({});
    const { regler, rotregler } = reglerConfig.vilkårsregler[vilkårType];

    // TODO att man ikke resetter andre svar hvis man kun oppdaterer begrunnelse
    const oppdaterSvar = (nyttSvar: Svar) => {
        const { regelId, svarId, begrunnelse } = nyttSvar;
        const svarIndex = svarsliste.findIndex((s) => s.regelId === regelId);
        const regel = regler[regelId];
        const nySvarArray = svarsliste.slice(0, svarIndex);

        if (!svarId) {
            return;
        }
        const svarsalternativ = regel.svarMapping[svarId];

        if (begrunnelseErPåkrevdOgSavnes(svarsalternativ, begrunnelse)) {
            settSvarsliste([...nySvarArray, nyttSvar]);
            return;
        }
        const nesteStegId = svarsalternativ.regelId;
        if (nesteStegId === 'SLUTT_NODE') {
            //TODO Done
            settSvarsliste([...nySvarArray, nyttSvar]);
        } else {
            settSvarsliste([...nySvarArray, nyttSvar, { regelId: nesteStegId }]);
        }
    };

    return (
        <div>
            {rotregler.map((r) => (
                <RegelComponent regel={reglerConfig[r]} />
            ))}
        </div>
    );
};

export default EndreVurderingComponent;
