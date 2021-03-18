import {
    Begrunnelse,
    BegrunnelseRegel,
    Regler,
    Svarsalternativ,
} from './typer';
import {IDelvilkår, Vurdering} from '../Inngangsvilkår/vilkår';

export function begrunnelseErPåkrevdOgSavnes(
    svarsalternativ: Svarsalternativ,
    begrunnelse: Begrunnelse
) {
    if (svarsalternativ.begrunnelseType === BegrunnelseRegel.PÅKREVD) {
        return !begrunnelse || begrunnelse.trim().length === 0;
    }
    return false;
}

export function begrunnelseErPåkrevdOgUtfyllt(
    svarsalternativ: Svarsalternativ,
    begrunnelse: Begrunnelse
) {
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
    }
    const regel = regler[vurdering.regelId];
    return regel.svarMapping[vurdering.svar!];
}

export function erAllaDelvilkårBesvarte(
    delvilkårsvurderinger: IDelvilkår[],
    regler: Regler
): boolean {
    console.log("delvilkårsvurderinger", delvilkårsvurderinger)

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
        .reduce((acc, curr) => {
            return (
                acc &&
                curr.every((vurdering) => {
                    if (!vurdering.svar) {
                        return false;
                    }
                    const svarsalternativ = hentSvarsalternativ(regler, vurdering);
                    console.log("svarsalternativ", svarsalternativ);
                    return (
                        svarsalternativ &&
                        !begrunnelseErPåkrevdOgSavnes(svarsalternativ, vurdering.begrunnelse)
                    );
                })
            );
        }, true);

    console.log("erPåSisteNod", erPåSisteNod)

    return erPåSisteNod && harBesvartAllePåkrevdeBegrunnelser;
}

export function leggTilNesteIdHvis(
    nesteStegId: string,
    nySvarArray: Vurdering[],
    hvisFunksjon: () => boolean
): Vurdering[] {
    if (hvisFunksjon()) {
        return [...nySvarArray, { regelId: nesteStegId }];
    }
    return nySvarArray;
}

export const oppdaterSvarIListe = (
    nyttSvar: Vurdering,
    vurderinger: Vurdering[],
    behållResterendeSvar = false
): Vurdering[] => {
    const { svar, regelId } = nyttSvar;

    const svarIndex = vurderinger.findIndex((s) => s.regelId === regelId);
    const nySvarArray = vurderinger.slice(0, svarIndex);

    if (!svar) {
        return vurderinger;
    }

    return [...nySvarArray, nyttSvar].concat(
        behållResterendeSvar ? [...vurderinger.slice(svarIndex + 1)] : []
    );
};
