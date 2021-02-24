import { IDelvilkår, IVurdering, VilkårGruppe, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import { IVilkårConfig, VurderingConfig } from '../Inngangsvilkår/config/VurderingConfig';
import { SivilstandType } from '../../../typer/personopplysninger';
import { VilkårStatus } from '../../Felleskomponenter/Visning/VilkårOppfylt';
import { erEnkeEllerGjenlevendePartner } from '../Inngangsvilkår/Sivilstand/SivilstandHelper';

export const alleErOppfylte = (vurderinger: IVurdering[]): boolean =>
    vurderinger.every((vurdering) => vurdering.resultat === Vilkårsresultat.OPPFYLT);

export const vilkårStatus = (vurderinger: IVurdering[]): VilkårStatus => {
    if (alleErOppfylte(vurderinger)) {
        return VilkårStatus.OPPFYLT;
    } else if (
        vurderinger.some((vurdering) => vurdering.resultat === Vilkårsresultat.IKKE_VURDERT)
    ) {
        return VilkårStatus.IKKE_VURDERT;
    } else {
        return VilkårStatus.IKKE_OPPFYLT;
    }
};

export const filtrerVurderinger = (
    vurderinger: IVurdering[],
    vilkårGruppe: VilkårGruppe,
    barnId?: string
): IVurdering[] =>
    vurderinger.filter((vurdering) => {
        const config = VurderingConfig[vurdering.vilkårType];
        if (!config) {
            console.error(`Savner config til ${vurdering.vilkårType}`);
            return false;
        }

        if (vilkårGruppe === VilkårGruppe.ALENEOMSORG && config.vilkårGruppe === vilkårGruppe) {
            return barnId === vurdering.barnId;
        }

        return config.vilkårGruppe === vilkårGruppe;
    });

export const harBesvartPåAlleDelvilkår = (delvilkårsvurderinger: IDelvilkår[]): boolean =>
    !delvilkårsvurderinger.some((delvilkår) => delvilkår.resultat === Vilkårsresultat.IKKE_VURDERT);

export const skalViseLagreKnapp = (vurdering: IVurdering, config: IVilkårConfig): boolean => {
    const { begrunnelse, delvilkårsvurderinger } = vurdering;

    if (config.begrunnelsePåkrevdHvisOppfylt && manglerBegrunnelse(begrunnelse)) {
        return false;
    }
    const besvarteDelvilkår = finnBesvarteDelvilkår(delvilkårsvurderinger);

    if (besvarteDelvilkår.length === 0) {
        return false;
    }
    const sisteBesvarteDelvilkår = besvarteDelvilkår[besvarteDelvilkår.length - 1];

    const vurderingErOppfylt = sisteBesvarteDelvilkår.resultat === Vilkårsresultat.OPPFYLT;

    if (vurderingErOppfylt) {
        return true;
    } else if (harBesvartPåAlleDelvilkår(delvilkårsvurderinger)) {
        const harUnntak = config.unntak.length !== 0;
        return harUnntak ? !!vurdering.unntak && !manglerBegrunnelse(begrunnelse) : true;
    }
    return false;
};

export const skalViseLagreKnappSivilstand = (
    vurdering: IVurdering,
    sivilstandType: SivilstandType,
    erBegrunnelseFeltValgfritt: boolean
): boolean => {
    const { begrunnelse, delvilkårsvurderinger } = vurdering;

    if (manglerBegrunnelse(begrunnelse) && !erBegrunnelseFeltValgfritt) {
        return false;
    }

    if (harBesvartPåAlleDelvilkår(delvilkårsvurderinger)) {
        return erEnkeEllerGjenlevendePartner(sivilstandType) ? !!vurdering.unntak : true;
    }
    return false;
};

export const skalViseLagreKnappAleneomsorg = (delvilkårsvurderinger: IDelvilkår[]): boolean => {
    const begrunnelseForAlleDelvilkår = delvilkårsvurderinger.every(
        (delvilkårsvurdering) => !manglerBegrunnelse(delvilkårsvurdering.begrunnelse)
    );
    return begrunnelseForAlleDelvilkår && harBesvartPåAlleDelvilkår(delvilkårsvurderinger);
};

export const manglerBegrunnelse = (begrunnelse: string | undefined | null): boolean => {
    return !begrunnelse || begrunnelse.trim().length === 0;
};

const finnBesvarteDelvilkår = (delvilkårsvurderinger: IDelvilkår[]) => {
    return delvilkårsvurderinger.filter(
        (delvilkår) =>
            delvilkår.resultat === Vilkårsresultat.IKKE_OPPFYLT ||
            delvilkår.resultat === Vilkårsresultat.OPPFYLT
    );
};

export const nullstillVurdering = (vurdering: IVurdering): IVurdering => {
    const { delvilkårsvurderinger } = vurdering;

    const nullstillDelvilkår = (delvilkår: IDelvilkår): IDelvilkår => {
        if (
            delvilkår.resultat === Vilkårsresultat.OPPFYLT ||
            delvilkår.resultat === Vilkårsresultat.IKKE_OPPFYLT
        ) {
            return {
                type: delvilkår.type,
                resultat: Vilkårsresultat.IKKE_VURDERT,
            };
        } else return delvilkår;
    };

    const nullstilteDelkvilkårsvurderinger: IDelvilkår[] = delvilkårsvurderinger.map((delvilkår) =>
        nullstillDelvilkår(delvilkår)
    );

    return {
        ...vurdering,
        resultat: Vilkårsresultat.IKKE_VURDERT,
        begrunnelse: null,
        unntak: null,
        delvilkårsvurderinger: nullstilteDelkvilkårsvurderinger,
    };
};
