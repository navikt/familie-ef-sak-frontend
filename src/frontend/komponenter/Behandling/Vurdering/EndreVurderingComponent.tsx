import * as React from 'react';
import { FC, useState } from 'react';
import { BegrunnelseRegel, RegelId, Regler, RootVilkårsvar, Vilkårsvar } from './typer';
import { VilkårType } from '../Inngangsvilkår/vilkår';
import {
    begrunnelseErPåkrevdOgUtfyllt,
    erAllaDelvilkårBesvarte,
    hentSvarsalternativ,
    leggTilNesteIdHvis,
    leggTilRegelIdISvarliste,
    oppdaterSvarIListe,
} from './utils';

import { Radio, RadioGruppe, Textarea as TextareaNav } from 'nav-frontend-skjema';
import hiddenIf from '../../Felleskomponenter/HiddenIf/hiddenIf';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';

const Textarea = hiddenIf(TextareaNav);
const Lagreknapp = hiddenIf(Hovedknapp);
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
        const vurderinger = vilkårsvar[rootRegelId];
        return (nyttSvar: Vilkårsvar) => {
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

            oppdateterVilkårsvar(rootRegelId, maybeLeggTilNesteNodIVilkårsvar);
        };
    };

    const oppdaterSvar = (rootRegelId: RegelId) => {
        const vurderinger = vilkårsvar[rootRegelId];
        return (nyttSvar: Vilkårsvar) => {
            const nySvarArray = oppdaterSvarIListe(nyttSvar, vurderinger);
            const svarsalternativer = hentSvarsalternativ(regler, nyttSvar)!;
            const maybeLeggTilNesteNodIVilkårsvar = leggTilNesteIdHvis(
                svarsalternativer.regelId,
                nySvarArray,
                () =>
                    svarsalternativer.regelId !== 'SLUTT_NODE' &&
                    svarsalternativer.begrunnelse !== BegrunnelseRegel.PÅKREVD
            );

            oppdateterVilkårsvar(rootRegelId, maybeLeggTilNesteNodIVilkårsvar);
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
                const hovedRegel = svarsNoder[0];
                const oppdaterSvarINod = oppdaterSvar(hovedRegel);
                const oppdaterBegrunnelseINod = oppdaterBegrunnelse(hovedRegel);
                return svarsNoder[1].map((svar) => {
                    const regel = regler[svar.regelId];
                    const begrunnelse =
                        (svar.svarId && regel.svarMapping[svar.svarId].begrunnelse) ??
                        BegrunnelseRegel.UTEN;
                    return (
                        <>
                            <Undertittel>{regel.regelId}</Undertittel>
                            <RadioGruppe>
                                {Object.keys(regel.svarMapping).map((svarId) => (
                                    <Radio
                                        key={`${regel.regelId}_${svarId}`}
                                        name={`${regel.regelId}_${svarId}`}
                                        label={svarId}
                                        value={svarId}
                                        checked={svarId === svar.svarId}
                                        onChange={() =>
                                            oppdaterSvarINod({ svarId, regelId: regel.regelId })
                                        }
                                    />
                                ))}
                            </RadioGruppe>
                            <Textarea
                                label={`Begrunnelse: ${begrunnelse}`}
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
                        </>
                    );
                });
            })}
            <Lagreknapp htmlType="submit" hidden={!erAllaDelvilkårBesvarte(vilkårsvar, regler)}>
                Lagre
            </Lagreknapp>
        </form>
    );
};
export default EndreVurderingComponent;
