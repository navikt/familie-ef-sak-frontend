import { IPersonDetaljer } from './Sivilstand/typer';
import { formaterNullableIsoDato } from '../../../App/utils/formatter';
import { IUnderUtdanning } from '../../../App/typer/aktivitetstyper';
import { EStudieandel, StudieandelTilTekst } from '../Aktivitet/Aktivitet/typer';
import { IVurdering, RegelIdDDokumentasjonUtdanning, VilkårType } from './vilkår';
import { IBarnMedSamværRegistergrunnlag, IBarnMedSamværSøknadsgrunnlag } from './Aleneomsorg/typer';
import { nullableDatoTilAlder } from '../../../App/utils/dato';
import { harVerdi } from '../../../App/utils/utils';

export const hentBooleanTekst = (value: boolean): string => (value ? 'Ja' : 'Nei');

export const hentPersonInfo = (person?: IPersonDetaljer): string => {
    const erNavnUtfylt = person?.navn !== undefined && person?.navn !== null;
    const hvisFinnesFnrEllerFdato =
        person?.personIdent || formaterNullableIsoDato(person?.fødselsdato);

    return person && !erNavnUtfylt
        ? 'Ikke utfylt'
        : `${person?.navn || ''} - ${hvisFinnesFnrEllerFdato || 'Ikke utfylt!'}`;
};

export const utledVisningForStudiebelastning = (utdanning?: IUnderUtdanning): string => {
    if (utdanning) {
        return utdanning.heltidEllerDeltid === EStudieandel.heltid
            ? StudieandelTilTekst[utdanning.heltidEllerDeltid]
            : `${utdanning.heltidEllerDeltid} - ${utdanning.hvorMyeSkalDuStudere}%`;
    }
    return 'Ikke oppgitt av bruker';
};
export const utledBegrunnelseFraVilkårOgRegel = (
    vurderinger: IVurdering[],
    vilkårType: VilkårType,
    regelId: RegelIdDDokumentasjonUtdanning
): string | undefined =>
    vurderinger
        .find((vurdering) => vurdering.vilkårType === vilkårType)
        ?.delvilkårsvurderinger.flatMap((delvilkårsvurdering) => delvilkårsvurdering.vurderinger)
        ?.find((vurdering) => vurdering.regelId === regelId)?.begrunnelse;

export const utledNavnOgAlder = (
    registerNavn?: string,
    registerFødselsdato?: string,
    registerDødsdato?: string,
    søknadNavn?: string,
    søknadFødselsdato?: string
) => {
    const skalViseAlderRegister = registerFødselsdato && !registerDødsdato;
    const alderRegisterString = ` (${nullableDatoTilAlder(registerFødselsdato)})`;
    const alderSøknadString = ` (${nullableDatoTilAlder(søknadFødselsdato)})`;

    const formatertAlderRegister = skalViseAlderRegister ? alderRegisterString : '';
    const formatertAlderSøknad = alderSøknadString ? alderSøknadString : '';

    if (harVerdi(registerNavn)) return registerNavn + formatertAlderRegister;
    if (harVerdi(søknadNavn)) return søknadNavn + formatertAlderSøknad;
    return 'Ikke født';
};

export const utledNavnOgAlderPåGrunnlag = (
    registergrunnlag: IBarnMedSamværRegistergrunnlag,
    søknadsgrunnlag: IBarnMedSamværSøknadsgrunnlag
) => {
    const { navn: registerNavn, fødselsdato, dødsdato } = registergrunnlag;
    const { navn: søknadNavn, fødselTermindato: søknadFødselsdato } = søknadsgrunnlag;

    return utledNavnOgAlder(registerNavn, fødselsdato, dødsdato, søknadNavn, søknadFødselsdato);
};
