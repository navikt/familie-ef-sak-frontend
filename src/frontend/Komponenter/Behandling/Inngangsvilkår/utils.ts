import { IPersonDetaljer } from './Sivilstand/typer';
import { formaterNullableIsoDato } from '../../../App/utils/formatter';
import { IUnderUtdanning } from '../../../App/typer/aktivitetstyper';
import { EStudieandel, StudieandelTilTekst } from '../Aktivitet/Aktivitet/typer';
import { IVurdering, RegelIdDDokumentasjonUtdanning, VilkårType } from './vilkår';
import { Behandling } from '../../../App/typer/fagsak';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import { Behandlingsårsak } from '../../../App/typer/Behandlingsårsak';
import { IBarnMedSamværRegistergrunnlag, IBarnMedSamværSøknadsgrunnlag } from './Aleneomsorg/typer';
import { nullableDatoTilAlder, årMellomDatoer } from '../../../App/utils/dato';
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

export const utledVilkårsgjenbruk = (
    behandlingErRedigerbar: boolean,
    behandling: Behandling
): boolean => {
    const behandlingErRevurdering = behandling.type === Behandlingstype.REVURDERING;
    const behandlingsårsakErSøknad =
        behandling.behandlingsårsak === Behandlingsårsak.SØKNAD ||
        behandling.behandlingsårsak === Behandlingsårsak.PAPIRSØKNAD;
    const vilkårForRevurderingErOppfylt = behandlingErRevurdering ? behandlingsårsakErSøknad : true;
    return behandlingErRedigerbar && vilkårForRevurderingErOppfylt;
};

export const utledNavnOgAlder = (
    registerNavn?: string,
    registerFødselsdato?: string,
    registerDødsdato?: string,
    søknadNavn?: string
) => {
    const alder =
        registerDødsdato && registerFødselsdato
            ? årMellomDatoer(registerFødselsdato, registerDødsdato)
            : nullableDatoTilAlder(registerFødselsdato);
    const formatertAlder = alder ? ' (' + alder + ')' : '';

    if (harVerdi(registerNavn)) return registerNavn + formatertAlder;
    if (harVerdi(søknadNavn)) return søknadNavn;
    return 'Ikke født';
};

export const utledNavnOgAlderPåGrunnlag = (
    registergrunnlag: IBarnMedSamværRegistergrunnlag,
    søknadsgrunnlag: IBarnMedSamværSøknadsgrunnlag
) => {
    const { navn: registerNavn, fødselsdato, dødsdato } = registergrunnlag;
    const { navn: søknadNavn } = søknadsgrunnlag;

    return utledNavnOgAlder(registerNavn, fødselsdato, dødsdato, søknadNavn);
};
