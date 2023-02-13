import { Begrunnelse, BegrunnelseRegel, RegelId, Regler, Svarsalternativ } from './typer';
import { IDelvilkår, Vurdering } from '../Inngangsvilkår/vilkår';

export const manglerBegrunnelse = (begrunnelse: string | undefined | null): boolean => {
    return !begrunnelse || begrunnelse.trim().length === 0;
};

export function begrunnelseErPåkrevdOgMangler(
    svarsalternativ: Svarsalternativ,
    begrunnelse: Begrunnelse
): boolean {
    if (svarsalternativ.begrunnelseType === BegrunnelseRegel.PÅKREVD) {
        return manglerBegrunnelse(begrunnelse);
    }
    return false;
}

export function begrunnelseErPåkrevdOgUtfyllt(
    svarsalternativ: Svarsalternativ,
    begrunnelse: Begrunnelse
): boolean {
    if (svarsalternativ.begrunnelseType === BegrunnelseRegel.PÅKREVD) {
        return !begrunnelse || begrunnelse.trim().length > 0;
    }
    return true;
}

export function hentSvarsalternativ(
    regler: Regler,
    vurdering: Vurdering
): Svarsalternativ | undefined {
    if (!vurdering.svar) {
        return undefined;
    } else {
        const regel = regler[vurdering.regelId];
        return regel.svarMapping[vurdering.svar];
    }
}

export function erAlleDelvilkårBesvarte(
    delvilkårsvurderinger: IDelvilkår[],
    regler: Regler
): boolean {
    const erPåSisteNod = delvilkårsvurderinger
        .map((delvilkårsvurdering) => delvilkårsvurdering.vurderinger)
        .map((listeMedVurderinger) => listeMedVurderinger[listeMedVurderinger.length - 1])
        .every((sisteVurderingen) => {
            if (!sisteVurderingen.svar) {
                return false;
            }
            const svarsalternativ = hentSvarsalternativ(regler, sisteVurderingen);
            return svarsalternativ?.regelId === 'SLUTT_NODE';
        });

    const harBesvartAllePåkrevdeBegrunnelser = delvilkårsvurderinger
        .map((delvilkårsvurdering) => delvilkårsvurdering.vurderinger)
        .every((delvilkår) =>
            delvilkår.every((vurdering) => {
                if (!vurdering.svar) {
                    return false;
                }
                const svarsalternativ = hentSvarsalternativ(regler, vurdering);
                return (
                    svarsalternativ &&
                    !begrunnelseErPåkrevdOgMangler(svarsalternativ, vurdering.begrunnelse)
                );
            })
        );

    return erPåSisteNod && harBesvartAllePåkrevdeBegrunnelser;
}

export function leggTilNesteIdHvis(
    nesteRegelId: RegelId,
    nySvarArray: Vurdering[],
    hvisFunksjon: () => boolean
): Vurdering[] {
    const inneholderAlleredeNesteRegelId = nySvarArray.some((v) => v.regelId === nesteRegelId);
    if (nesteRegelId !== 'SLUTT_NODE' && !inneholderAlleredeNesteRegelId && hvisFunksjon()) {
        return [...nySvarArray, { regelId: nesteRegelId }];
    }
    return nySvarArray;
}

export const oppdaterSvarIListe = (
    nyttSvar: Vurdering,
    vurderinger: Vurdering[],
    beholdResterendeSvar = false,
    beholdBeskrivelse = false
): Vurdering[] => {
    const { svar, regelId } = nyttSvar;

    const svarIndex = vurderinger.findIndex((s) => s.regelId === regelId);
    const nySvarArray = vurderinger.slice(0, svarIndex);

    if (!svar) {
        return vurderinger;
    }

    const oppdatertNyttSvar = beholdBeskrivelse
        ? { ...nyttSvar, begrunnelse: vurderinger[svarIndex].begrunnelse }
        : nyttSvar;
    return [...nySvarArray, oppdatertNyttSvar].concat(
        beholdResterendeSvar ? [...vurderinger.slice(svarIndex + 1)] : []
    );
};
