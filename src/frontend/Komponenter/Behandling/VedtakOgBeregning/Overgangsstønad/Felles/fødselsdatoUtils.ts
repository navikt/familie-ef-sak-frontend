import { erEtter, erGyldigDato, minusÅr } from '../../../../../App/utils/dato';
import { IVilkår, InngangsvilkårType, Vilkårsresultat } from '../../../Inngangsvilkår/vilkår';

export const utledYngsteBarnFødselsdatoSomHarInngangsvilkåretAleneomsorgOppfylt = (
    vilkår: IVilkår
): string | undefined => {
    const terminbarnFødselsdatoer = vilkår.grunnlag.barnMedSamvær
        .map((b) => b.søknadsgrunnlag.fødselTermindato)
        .filter(
            (fødselTermindato): fødselTermindato is string =>
                !!fødselTermindato &&
                erGyldigDato(fødselTermindato) &&
                erEtter(fødselTermindato, minusÅr(new Date(), 1))
        );

    const barnMedOppfyltAleneomsorg = vilkår.vurderinger
        .filter(
            (vurdering) =>
                vurdering.vilkårType === InngangsvilkårType.ALENEOMSORG &&
                vurdering.resultat === Vilkårsresultat.OPPFYLT
        )
        .map((vurdering) =>
            vilkår.grunnlag.barnMedSamvær.find((barn) => barn.barnId === vurdering.barnId)
        );

    const datoer = barnMedOppfyltAleneomsorg
        .map((b) => b?.registergrunnlag.fødselsdato)
        .filter((fødselsdato): fødselsdato is string => !!fødselsdato && erGyldigDato(fødselsdato))
        .concat(terminbarnFødselsdatoer);

    if (datoer.length === 0) {
        return undefined;
    }

    return datoer.reduce((a, b) => {
        return erEtter(a, b) ? a : b;
    }, datoer[0]);
};
