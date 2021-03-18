import * as React from 'react';
import { FC, useState } from 'react';
import { BegrunnelseRegel, RegelId, Regler, RootVilkårsvar, Vilkårsvar } from './typer';
import { VilkårType } from '../Inngangsvilkår/vilkår';
import { leggTilRegelIdISvarliste } from './utils';

import { Radio, RadioGruppe, Textarea as TextareaNav } from 'nav-frontend-skjema';
import hiddenIf from '../../Felleskomponenter/HiddenIf/hiddenIf';

const Textarea = hiddenIf(TextareaNav);
/**
 * Skal resette undervilkår, men ikke rootnivå hvis en tidligere endrer seg
 */

const EndreVurderingComponent: FC<{
    vilkårType: VilkårType;
    regler: Regler;
    rotregler: string[];
    oppdaterVurdering: () => void;
}> = ({ regler, rotregler, oppdaterVurdering }) => {
    const [vilkårsvar, settVilkårsvar] = useState<RootVilkårsvar>(
        rotregler.reduce((acc, rootregel) => {
            return leggTilRegelIdISvarliste(acc, rootregel);
        }, {} as RootVilkårsvar)
    );

    const oppdateterVilkårsvar = (rootRegelId: string, nySvarArray: Vilkårsvar[]) =>
        settVilkårsvar((prevSvar) => ({ ...prevSvar, [rootRegelId]: [...nySvarArray] }));

    const oppdaterBegrunnelse = (rootRegelId: RegelId) => {
        const svarsliste = vilkårsvar[rootRegelId];
        return (nyttSvar: Vilkårsvar) => {
            const { svarId, regelId } = nyttSvar;

            const nySvarArray = svarsliste.map((v) =>
                v.svarId === svarId && v.regelId === regelId ? nyttSvar : v
            );

            oppdateterVilkårsvar(rootRegelId, nySvarArray);
        };
    };

    const oppdaterSvar = (rootRegelId: RegelId) => {
        const svarsliste = vilkårsvar[rootRegelId];
        return (nyttSvar: Vilkårsvar) => {
            const { regelId, svarId } = nyttSvar;
            const svarIndex = svarsliste.findIndex((s) => s.regelId === regelId);
            const nySvarArray = svarsliste.slice(0, svarIndex);
            const regel = regler[regelId];

            if (!svarId) {
                return;
            }
            const svarsalternativ = regel.svarMapping[svarId];
            const nesteStegId = svarsalternativ.regelId;

            if (nesteStegId === 'SLUTT_NODE') {
                oppdateterVilkårsvar(rootRegelId, [...nySvarArray, nyttSvar]);
            } else {
                oppdateterVilkårsvar(rootRegelId, [
                    ...nySvarArray,
                    nyttSvar,
                    { regelId: nesteStegId },
                ]);
            }
        };
    };

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                oppdaterVurdering();
            }}
        >
            {Object.entries(vilkårsvar).map((svarsNoder) => {
                const regelId = svarsNoder[0];
                const regel = regler[regelId];
                const oppdaterSvarINod = oppdaterSvar(regelId);
                const oppdaterBegrunnelseINod = oppdaterBegrunnelse(regelId);
                return svarsNoder[1].map((svar) => {
                    const begrunnelse =
                        (svar.svarId && regel.svarMapping[svar.svarId].begrunnelse) ??
                        BegrunnelseRegel.UTEN;
                    return (
                        <div>
                            <div>{regel.regelId}</div>
                            <RadioGruppe>
                                {Object.keys(regel.svarMapping).map((svarId) => (
                                    <Radio
                                        key={`${regel.regelId}_${svarId}`}
                                        label={svarId}
                                        name={`${regel.regelId}_${svarId}`}
                                        value={svarId}
                                        checked={svarId === svar.svarId}
                                        onChange={() =>
                                            oppdaterSvarINod({ ...svar, svarId, regelId })
                                        }
                                    />
                                ))}
                            </RadioGruppe>
                            <Textarea
                                label={`Begrunnelse: ${begrunnelse}`}
                                maxLength={0}
                                hidden={begrunnelse === BegrunnelseRegel.UTEN}
                                placeholder="Skriv inn tekst"
                                value={svar.begrunnelse || ''}
                                onChange={(e) =>
                                    oppdaterBegrunnelseINod({
                                        ...svar,
                                        begrunnelse: e.target.value,
                                    })
                                }
                            />
                        </div>
                    );
                });
            })}
        </form>
    );
};
export default EndreVurderingComponent;
