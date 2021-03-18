import {
    Begrunnelse,
    BegrunnelseRegel,
    Regler,
    RootVilkårsvar,
    Svarsalternativ,
    Vilkårsvar,
} from './typer';

export function begrunnelseErPåkrevdOgSavnes(
    svarsalternativ: Svarsalternativ,
    begrunnelse: Begrunnelse
) {
    if (svarsalternativ.begrunnelse === BegrunnelseRegel.PÅKREVD) {
        return !begrunnelse || begrunnelse.trim().length === 0;
    }
    return false;
}

export function begrunnelseErPåkrevdOgUtfyllt(
    svarsalternativ: Svarsalternativ,
    begrunnelse: Begrunnelse
) {
    if (svarsalternativ.begrunnelse === BegrunnelseRegel.PÅKREVD) {
        return !begrunnelse || begrunnelse.trim().length > 0;
    }
    return true;
}

export function leggTilRegelIdISvarliste(
    svarliste: RootVilkårsvar,
    regelId: string
): Record<string, Vilkårsvar[]> {
    svarliste[regelId] = [...(svarliste[regelId] ?? []), { regelId }];
    return svarliste;
}

export function hentSvarsalternativ(
    regler: Regler,
    vurdering: Vilkårsvar
): Svarsalternativ | undefined {
    if (!vurdering.svarId) {
        return undefined;
    }
    const regel = regler[vurdering.regelId];
    return regel.svarMapping[vurdering.svarId!];
}

export function erAllaDelvilkårBesvarte(svar: RootVilkårsvar, regler: Regler): boolean {
    const erPåSisteNod = Object.values(svar)
        .map((listeMedVurderinger) => listeMedVurderinger[listeMedVurderinger.length - 1])
        .every((sisteVurderingen) => {
            if (!sisteVurderingen.svarId) {
                return false;
            }
            const svarsalternativ = hentSvarsalternativ(regler, sisteVurderingen);
            return svarsalternativ?.regelId === 'SLUTT_NODE';
        });

    const harBesvartAllePåkrevdeBegrunnelser = Object.values(svar).reduce((acc, curr) => {
        return (
            acc &&
            curr.every((vurdering) => {
                if (!vurdering.svarId) {
                    return false;
                }
                const svarsalternativ = hentSvarsalternativ(regler, vurdering);
                return (
                    svarsalternativ &&
                    begrunnelseErPåkrevdOgSavnes(svarsalternativ, vurdering.begrunnelse)
                );
            })
        );
    }, true);

    return erPåSisteNod && harBesvartAllePåkrevdeBegrunnelser;
}

export function leggTilNesteIdHvis(
    nesteStegId: string,
    nySvarArray: Vilkårsvar[],
    hvisFunksjon: () => boolean
): Vilkårsvar[] {
    if (hvisFunksjon()) {
        return [...nySvarArray, { regelId: nesteStegId }];
    }
    return nySvarArray;
}

export const oppdaterSvarIListe = (
    nyttSvar: Vilkårsvar,
    vurderinger: Vilkårsvar[],
    behållResterendeSvar = false
): Vilkårsvar[] => {
    const { svarId, regelId } = nyttSvar;

    const svarIndex = vurderinger.findIndex((s) => s.regelId === regelId);
    const nySvarArray = vurderinger.slice(0, svarIndex);

    if (!svarId) {
        return vurderinger;
    }

    return [...nySvarArray, nyttSvar].concat(
        behållResterendeSvar ? [...vurderinger.slice(svarIndex + 1)] : []
    );
};
