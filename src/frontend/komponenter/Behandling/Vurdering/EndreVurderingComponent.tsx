import * as React from 'react';
import { FC, useState } from 'react';
import { Radio, RadioGruppe, Textarea } from 'nav-frontend-skjema';
import { VilkårType } from '../Inngangsvilkår/vilkår';

enum BegrunnelseRegel {
    'PÅKREVD' = 'PÅKREVD',
    'VALGFRI' = 'VALGFRI',
    'UTEN' = 'UTEN',
}

type SluttNode = 'SLUTT_NODE';

type RegelId = SluttNode | string;
type SvarId = string;

interface Svarsalternativ {
    regelId: RegelId;
    begrunnelse: BegrunnelseRegel;
}

type SvarMapping = Record<SvarId, Svarsalternativ>;

interface Regel {
    regelId: string;
    svarMapping: SvarMapping;
}

type Regler = {
    [key in RegelId]: Regel;
};

type Vilkårsregler<T extends VilkårType> = {
    vilkårType: T;
    regler: Regler;
    rotregler: string[];
};

export interface ReglerResponse {
    vilkårsregler: {
        [key in VilkårType]: Vilkårsregler<key>;
    };
}

type Begrunnelse = string | undefined;

//Från backend
interface VilkårSvar {
    regelId: string;
    svarId: SvarId;
    begrunnelse?: Begrunnelse;
}

interface Svar {
    regelId: string;
    svarId?: SvarId;
    begrunnelse?: Begrunnelse;
}

type RootVilkårSvar = Record<string, VilkårSvar[]>;

function begrunnelseErPåkrevdOgSavnes(svarsalternativ: Svarsalternativ, begrunnelse: Begrunnelse) {
    if (svarsalternativ.begrunnelse === BegrunnelseRegel.PÅKREVD) {
        return begrunnelse && begrunnelse.trim().length > 0;
    }
    return false;
}

const ReglerComponent: FC<{ rootRegelId: RegelId; regler: Regler; regelSvar: Svar[] }> = ({
    rootRegelId,
    regler,
    regelSvar,
}) => {
    const [svarsliste, settSvarsliste] = useState<Svar[]>(
        regelSvar.length > 0 ? regelSvar : [{ regelId: rootRegelId }]
    );

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

    // når den oppdaterer svar skal den nulla ut begrunnelse
    const renderSvar = (regel: Regel, svar: Svar) => {
        return (
            <RadioGruppe>
                {Object.keys(regel.svarMapping).map((svarId) => (
                    <Radio
                        key={`${regel.regelId}_${svarId}`}
                        label={svarId}
                        name={`${regel.regelId}_${svarId}`}
                        value={svarId}
                        checked={svarId === svar.svarId}
                        onChange={() => {
                            oppdaterSvar(Object.assign({}, svar, { svarId: svarId }));
                        }}
                    />
                ))}
            </RadioGruppe>
        );
    };

    const renderBegrunnelse = (regel: Regel, svar: Svar) => {
        if (!svar.svarId) {
            return;
        }
        const { begrunnelse } = regel.svarMapping[svar.svarId];
        if (begrunnelse === BegrunnelseRegel.PÅKREVD || begrunnelse === BegrunnelseRegel.VALGFRI) {
            return (
                <Textarea
                    label={`Begrunnelse: ${begrunnelse}`}
                    maxLength={0}
                    placeholder="Skriv inn tekst"
                    value={svar.begrunnelse || ''}
                    onChange={(e) => {
                        oppdaterSvar(Object.assign({}, svar, { begrunnelse: e.target.value }));
                    }}
                />
            );
        }
        return;
    };

    const renderedeSvar = svarsliste.map((s) => {
        const regel = regler[s.regelId];
        return (
            <div>
                <div>{regel.regelId}</div>
                {renderSvar(regel, s)}
                {renderBegrunnelse(regel, s)}
            </div>
        );
    });
    return <div>{renderedeSvar}</div>;
};

/**
 * Skal resette undervilkår, men ikke rootnivå hvis en tidligere endrer seg
 */
const EndreVurderingComponent: FC<{ vilkårType: VilkårType; reglerConfig: ReglerResponse }> = ({
    vilkårType,
    reglerConfig,
}) => {
    const [svar, settSvar] = useState<RootVilkårSvar>({});
    const { regler, rotregler } = reglerConfig.vilkårsregler[vilkårType];

    return (
        <div>
            {rotregler.map((r) => (
                <ReglerComponent rootRegelId={r} regler={regler} regelSvar={svar[r] || []} />
            ))}
        </div>
    );
};

export default EndreVurderingComponent;
