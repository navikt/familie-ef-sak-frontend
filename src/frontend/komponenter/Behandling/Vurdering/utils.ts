import {Begrunnelse, BegrunnelseRegel, Regler, RootVilkårsvar, Svarsalternativ, Vilkårsvar} from "./typer";

export function begrunnelseErPåkrevdOgSavnes(svarsalternativ: Svarsalternativ, begrunnelse: Begrunnelse) {
    if (svarsalternativ.begrunnelse === BegrunnelseRegel.PÅKREVD) {
        return !begrunnelse || begrunnelse.trim().length === 0;
    }
    return false;
}

export function leggTilRegelIdISvarliste(svarliste: RootVilkårsvar, regelId: string) {
    svarliste[regelId] = [...(svarliste[regelId] ?? []), { regelId }];
    return svarliste;
}

export function erAllaDelvilkårBesvarte(svar: RootVilkårsvar, regler: Regler) {
    const erPåSisteNod = Object.values(svar)
        .map((listeMedVurderinger) => listeMedVurderinger[listeMedVurderinger.length - 1])
        .every((sisteVurderingen) => {
            if (!sisteVurderingen.svarId) {
                return false;
            }
            const regel = regler[sisteVurderingen.regelId];
            const svarMapping = regel.svarMapping[sisteVurderingen.svarId];
            return svarMapping.regelId === 'SLUTT_NODE';
        });

    const harBesvartAllePåkrevdeBegrunnelser = Object.values(svar).reduce((acc, curr) => {
        return (
            acc &&
            curr.every((vurdering) => {
                if (!vurdering.svarId) {
                    return false;
                }
                const regel = regler[vurdering.regelId];
                const svarMapping = regel.svarMapping[vurdering.svarId];
                if (begrunnelseErPåkrevdOgSavnes(svarMapping, vurdering.begrunnelse)) {
                    return false;
                }
                return true;
            })
        );
    }, true);

    return erPåSisteNod && harBesvartAllePåkrevdeBegrunnelser;
}

export function leggTilNesteNodHvis (
    nyttSvar: Vilkårsvar,
    hvisFunksjon: (...args: any) => boolean,
    nySvarArray: Vilkårsvar[],
    regler: Regler,
    args: any[] = []
)  {
    const { regelId, svarId } = nyttSvar;
    const regel = regler[regelId];
    const svarsalternativ = regel.svarMapping[svarId!];
    const nesteStegId = svarsalternativ.regelId;

    if (hvisFunksjon.apply(null, [nesteStegId, ...args])) {
        return [...nySvarArray, nyttSvar, { regelId: nesteStegId }];
    }
    return [...nySvarArray, nyttSvar];
};