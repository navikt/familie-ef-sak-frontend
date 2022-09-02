import { IPersonDetaljer } from './Sivilstand/typer';
import { formaterNullableIsoDato } from '../../../App/utils/formatter';
import { IUnderUtdanning } from '../../../App/typer/aktivitetstyper';
import { EStudieandel, StudieandelTilTekst } from '../Aktivitet/Aktivitet/typer';
import { IVurdering, RegelIdDDokumentasjonUtdanning, VilkårType } from './vilkår';
import { Behandling } from '../../../App/typer/fagsak';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import { Behandlingsårsak } from '../../../App/typer/Behandlingsårsak';

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
    featureToggle: boolean,
    behandlingErRedigerbar: boolean,
    behandling: Behandling
): boolean => {
    const behandlingErRevurdering = behandling.type === Behandlingstype.REVURDERING;
    const behandlingsårsakErSøknad = behandling.behandlingsårsak === Behandlingsårsak.SØKNAD;
    const vilkårForRevurderingErOppfylt = behandlingErRevurdering ? behandlingsårsakErSøknad : true;
    return featureToggle && behandlingErRedigerbar && vilkårForRevurderingErOppfylt;
};
