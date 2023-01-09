import { erEtter, erGyldigDato, minusÅr } from '../../../../../App/utils/dato';
import { IVilkår } from '../../../Inngangsvilkår/vilkår';

export const utledYngsteBarnFødselsdato = (vilkår: IVilkår): string | undefined => {
    const terminbarnFødselsdatoer = vilkår.grunnlag.barnMedSamvær
        .map((b) => b.søknadsgrunnlag.fødselTermindato)
        .filter(
            (fødselTermindato): fødselTermindato is string =>
                !!fødselTermindato &&
                erGyldigDato(fødselTermindato) &&
                erEtter(fødselTermindato, minusÅr(new Date(), 1))
        );

    const datoer = vilkår.grunnlag.barnMedSamvær
        .map((b) => b.registergrunnlag.fødselsdato)
        .filter((fødselsdato): fødselsdato is string => !!fødselsdato && erGyldigDato(fødselsdato))
        .concat(terminbarnFødselsdatoer);
    if (datoer.length === 0) {
        return undefined;
    }
    return datoer.reduce((a, b) => {
        return erEtter(a, b) ? a : b;
    });
};
