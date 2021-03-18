import * as React from 'react';
import { FC, useState } from 'react';
import { BegrunnelseRegel, Regler, } from './typer';
import {IVurdering, VilkårType, Vurdering} from '../Inngangsvilkår/vilkår';
import {
    begrunnelseErPåkrevdOgUtfyllt,
    erAllaDelvilkårBesvarte,
    hentSvarsalternativ,
    leggTilNesteIdHvis,
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
    oppdaterVurdering: (vurdering: any) => void;
    vurdering: IVurdering;
}> = ({ regler, oppdaterVurdering, vurdering }) => {
    const [vurderingState, settVurderingState] = useState<IVurdering>(vurdering);

    const oppdateterVilkårsvar = (index: number, nySvarArray: Vurdering[]) => {

        settVurderingState((prevSvar) => {
            const prevDelvilkårsvurdering = prevSvar.delvilkårsvurderinger[index];
            return { ...prevSvar, delvilkårsvurderinger: [...prevSvar.delvilkårsvurderinger.slice(0,index),  {...prevDelvilkårsvurdering, vurderinger: nySvarArray}, ...prevSvar.delvilkårsvurderinger.slice(index+1) ],  }
        });
    }

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

    const oppdaterSvar = (vurderinger: Vurdering[], index: number)  => {
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
                oppdaterVurdering(vurdering);
            }}
        >
            {vurderingState.delvilkårsvurderinger.map((delvikår, index) => {
                const oppdaterSvarINod = oppdaterSvar(delvikår.vurderinger, index);
                const oppdaterBegrunnelseINod = oppdaterBegrunnelse(delvikår.vurderinger, index);
                return delvikår.vurderinger.map((svar) => {
                    const regel = regler[svar.regelId];
                    const begrunnelse =
                        (svar.svar && regel.svarMapping[svar.svar].begrunnelseType) ??
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
                                        checked={svarId === svar.svar}
                                        onChange={() =>
                                            oppdaterSvarINod({ svar: svarId, regelId: regel.regelId })
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
            <Lagreknapp htmlType="submit" hidden={!erAllaDelvilkårBesvarte(vurderingState.delvilkårsvurderinger, regler)}>
                Lagre
            </Lagreknapp>
        </form>
    );
};
export default EndreVurderingComponent;
