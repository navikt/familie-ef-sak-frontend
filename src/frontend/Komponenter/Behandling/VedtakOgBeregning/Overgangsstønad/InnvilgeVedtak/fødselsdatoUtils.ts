import { erEtter, erGyldigDato, minusÅr } from '../../../../../App/utils/dato';
import { IVilkår } from '../../../Inngangsvilkår/vilkår';

export const yngsteBarnFødselsdato = (vilkår: IVilkår) => {
    const terminbarnFødselsdatoer = vilkår.grunnlag.barnMedSamvær
        .map((b) => b.søknadsgrunnlag)
        .map((sb) => sb.fødselTermindato)
        .filter(
            (fødselTermindato): fødselTermindato is string =>
                !!fødselTermindato &&
                erGyldigDato(fødselTermindato) &&
                erEtter(fødselTermindato, minusÅr(new Date(), 1))
        );

    const tidligsteDato = vilkår.grunnlag.barnMedSamvær
        .map((b) => b.registergrunnlag)
        .map((r) => r.fødselsdato)
        .filter((fødselsdato): fødselsdato is string => !!fødselsdato && erGyldigDato(fødselsdato))
        .concat(terminbarnFødselsdatoer)
        .reduce((a, b) => {
            return erEtter(a, b) ? a : b;
        });
    return tidligsteDato;
};
