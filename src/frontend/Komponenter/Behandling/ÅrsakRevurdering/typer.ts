import { Stønadstype } from '../../../App/typer/behandlingstema';
import { Behandling } from '../../../App/typer/fagsak';
import { Behandlingsårsak } from '../../../App/typer/behandlingsårsak';
import { Behandlingstype } from '../../../App/typer/behandlingstype';

export interface Revurderingsinformasjon {
    kravMottatt?: string;
    årsakRevurdering?: IÅrsakRevurdering;
    endretTid?: string;
}

export interface IÅrsakRevurdering {
    årsak?: Årsak;
    opplysningskilde?: Opplysningskilde;
    beskrivelse?: string;
}

const utledInitiellOpplysningskilde = (behandling: Behandling): Opplysningskilde | undefined => {
    if (
        behandling.behandlingsårsak === Behandlingsårsak.SØKNAD &&
        behandling.type == Behandlingstype.REVURDERING
    ) {
        return Opplysningskilde.INNSENDT_SØKNAD;
    } else {
        return undefined;
    }
};

export const initiellStateMedDefaultOpplysningskilde = (
    initiellRevurderingsinformasjon: Revurderingsinformasjon,
    behandling: Behandling
): Revurderingsinformasjon => {
    const initiellOpplysningskilde = utledInitiellOpplysningskilde(behandling);
    if (!initiellRevurderingsinformasjon.årsakRevurdering && initiellOpplysningskilde) {
        return {
            ...initiellRevurderingsinformasjon,
            årsakRevurdering: { opplysningskilde: initiellOpplysningskilde },
        };
    }
    return initiellRevurderingsinformasjon;
};

export enum Årsak {
    ENDRING_INNTEKT = 'ENDRING_INNTEKT',
    ENDRING_AKTIVITET = 'ENDRING_AKTIVITET',
    ENDRING_INNTEKT_OG_AKTIVITET = 'ENDRING_INNTEKT_OG_AKTIVITET',

    SØKNAD_UTVIDELSE_UTDANNING = 'SØKNAD_UTVIDELSE_UTDANNING',
    SØKNAD_UTVIDELSE_SÆRLIG_TILSYNSKREVENDE_BARN = 'SØKNAD_UTVIDELSE_SÆRLIG_TILSYNSKREVENDE_BARN',
    SØKNAD_FORLENGELSE_FORBIGÅENDE_SYKDOM = 'SØKNAD_FORLENGELSE_FORBIGÅENDE_SYKDOM',
    SØKNAD_FORLENGELSE_PÅVENTE_AKTIVITET = 'SØKNAD_FORLENGELSE_PÅVENTE_AKTIVITET',
    SØKNAD_NY_PERIODE_NYTT_BARN = 'SØKNAD_NY_PERIODE_NYTT_BARN',
    SØKNAD_NYTT_BGH_SKOLEÅR = 'SØKNAD_NYTT_BGH_SKOLEÅR',
    SØKNAD_NYTT_SKOLEÅR = 'SØKNAD_NYTT_SKOLEÅR',

    OPPHØR_VILKÅR_IKKE_OPPFYLT = 'OPPHØR_VILKÅR_IKKE_OPPFYLT',
    OPPHØR_EGET_ØNSKE = 'OPPHØR_EGET_ØNSKE',

    ENDRING_STØNADSPERIODE = 'ENDRING_STØNADSPERIODE',
    SØKNAD_NY_PERIODE_HOVEDPERIODE_IKKE_BRUKT_OPP_TIDLIGERE = 'SØKNAD_NY_PERIODE_HOVEDPERIODE_IKKE_BRUKT_OPP_TIDLIGERE',
    SØKNAD_BRUKT_OPP_HOVEDPERIODEN_TIDLIGERE = 'SØKNAD_BRUKT_OPP_HOVEDPERIODEN_TIDLIGERE',
    SØKNAD_ETTER_AVSLAG = 'SØKNAD_ETTER_AVSLAG',
    SØKNAD_ETTER_OPPHØR = 'SØKNAD_ETTER_OPPHØR',

    ENDRING_TILSYNSUTGIFTER = 'ENDRING_TILSYNSUTGIFTER',
    ENDRING_ANTALL_BARN = 'ENDRING_ANTALL_BARN',
    ENDRING_UTGIFTER_SKOLEPENGER = 'ENDRING_UTGIFTER_SKOLEPENGER',

    UTESTENGELSE = 'UTESTENGELSE',
    ANNET = 'ANNET',
    KLAGE_OMGJØRING = 'KLAGE_OMGJØRING',
    ANKE_OMGJØRING = 'ANKE_OMGJØRING',
}

export const årsakRevuderingTilTekst: Record<Årsak, string> = {
    ENDRING_INNTEKT: 'Endring i inntekt',
    ENDRING_AKTIVITET: 'Endring i aktivitet',
    ENDRING_INNTEKT_OG_AKTIVITET: 'Endring i inntekt og aktivitet',
    SØKNAD_UTVIDELSE_UTDANNING: 'Søknad om utvidelse - utdanning',
    SØKNAD_UTVIDELSE_SÆRLIG_TILSYNSKREVENDE_BARN:
        'Søknad om utvidelse - særlig tilsynskrevende barn',
    SØKNAD_FORLENGELSE_FORBIGÅENDE_SYKDOM: 'Søknad om forlengelse - forbigående sykdom',
    SØKNAD_FORLENGELSE_PÅVENTE_AKTIVITET:
        'Søknad om forlengelse i påvente av jobb, utdanning, barnepass eller som arbeidssøker',
    SØKNAD_NY_PERIODE_NYTT_BARN: 'Søknad om ny periode for nytt barn',
    SØKNAD_NYTT_BGH_SKOLEÅR: 'Søknad for nytt bhg-/skoleår',
    SØKNAD_NYTT_SKOLEÅR: 'Søknad for nytt skoleår',
    OPPHØR_VILKÅR_IKKE_OPPFYLT: 'Opphør - vilkår ikke oppfylt',
    OPPHØR_EGET_ØNSKE: 'Opphør - eget ønske',
    ENDRING_STØNADSPERIODE: 'Endring av stønadsperiode',
    SØKNAD_NY_PERIODE_HOVEDPERIODE_IKKE_BRUKT_OPP_TIDLIGERE:
        'Søknad ny periode - hovedperiode ikke brukt opp tidligere',
    SØKNAD_BRUKT_OPP_HOVEDPERIODEN_TIDLIGERE: 'Søknad - brukt opp hovedperioden tidligere',
    SØKNAD_ETTER_AVSLAG: 'Søknad etter avslag',
    SØKNAD_ETTER_OPPHØR: 'Søknad etter opphør',
    ENDRING_TILSYNSUTGIFTER: 'Endring i tilsynsutgifter',
    ENDRING_ANTALL_BARN: 'Endring i antall barn brukeren skal ha stønad for',
    ENDRING_UTGIFTER_SKOLEPENGER: 'Endring i utgifter til skolepenger',
    UTESTENGELSE: 'Utestengelse',
    ANNET: 'Annet',
    KLAGE_OMGJØRING: 'Klage - Omgjøring',
    ANKE_OMGJØRING: 'Anke - Omgjøring',
};

export const ÅrsakerOvergangsstønad: Årsak[] = [
    Årsak.ENDRING_INNTEKT,
    Årsak.ENDRING_AKTIVITET,
    Årsak.ENDRING_INNTEKT_OG_AKTIVITET,
    Årsak.ENDRING_STØNADSPERIODE,
    Årsak.SØKNAD_NY_PERIODE_HOVEDPERIODE_IKKE_BRUKT_OPP_TIDLIGERE,
    Årsak.SØKNAD_ETTER_AVSLAG,
    Årsak.SØKNAD_ETTER_OPPHØR,
    Årsak.SØKNAD_UTVIDELSE_UTDANNING,
    Årsak.SØKNAD_UTVIDELSE_SÆRLIG_TILSYNSKREVENDE_BARN,
    Årsak.SØKNAD_FORLENGELSE_FORBIGÅENDE_SYKDOM,
    Årsak.SØKNAD_FORLENGELSE_PÅVENTE_AKTIVITET,
    Årsak.SØKNAD_NY_PERIODE_NYTT_BARN,
    Årsak.SØKNAD_BRUKT_OPP_HOVEDPERIODEN_TIDLIGERE,
    Årsak.OPPHØR_VILKÅR_IKKE_OPPFYLT,
    Årsak.OPPHØR_EGET_ØNSKE,
    Årsak.KLAGE_OMGJØRING,
    Årsak.ANKE_OMGJØRING,
    Årsak.UTESTENGELSE,
    Årsak.ANNET,
];

export const ÅrsakerBarnetilsyn: Årsak[] = [
    Årsak.ENDRING_TILSYNSUTGIFTER,
    Årsak.ENDRING_AKTIVITET,
    Årsak.ENDRING_ANTALL_BARN,
    Årsak.SØKNAD_NYTT_BGH_SKOLEÅR,
    Årsak.SØKNAD_ETTER_AVSLAG,
    Årsak.SØKNAD_ETTER_OPPHØR,
    Årsak.OPPHØR_VILKÅR_IKKE_OPPFYLT,
    Årsak.OPPHØR_EGET_ØNSKE,
    Årsak.KLAGE_OMGJØRING,
    Årsak.ANKE_OMGJØRING,
    Årsak.UTESTENGELSE,
    Årsak.ANNET,
];

export const ÅrsakerSkolepenger: Årsak[] = [
    Årsak.ENDRING_UTGIFTER_SKOLEPENGER,
    Årsak.SØKNAD_NYTT_SKOLEÅR,
    Årsak.SØKNAD_ETTER_AVSLAG,
    Årsak.SØKNAD_ETTER_OPPHØR,
    Årsak.OPPHØR_VILKÅR_IKKE_OPPFYLT,
    Årsak.OPPHØR_EGET_ØNSKE,
    Årsak.KLAGE_OMGJØRING,
    Årsak.ANKE_OMGJØRING,
    Årsak.UTESTENGELSE,
    Årsak.ANNET,
];

export enum Opplysningskilde {
    INNSENDT_SØKNAD = 'INNSENDT_SØKNAD',
    MELDING_MODIA = 'MELDING_MODIA',
    INNSENDT_DOKUMENTASJON = 'INNSENDT_DOKUMENTASJON',
    BESKJED_ANNEN_ENHET = 'BESKJED_ANNEN_ENHET',
    OPPLYSNINGER_INTERNE_KONTROLLER = 'OPPLYSNINGER_INTERNE_KONTROLLER',
    AUTOMATISK_OPPRETTET_BEHANDLING = 'AUTOMATISK_OPPRETTET_BEHANDLING',
}

export const opplysningskildeTilTekst: Record<Opplysningskilde, string> = {
    INNSENDT_SØKNAD: 'Innsendt søknad',
    MELDING_MODIA: 'Melding i Modia',
    INNSENDT_DOKUMENTASJON: 'Innsendt dokumentasjon',
    BESKJED_ANNEN_ENHET: 'Beskjed fra annen enhet',
    OPPLYSNINGER_INTERNE_KONTROLLER: 'Opplysninger fra intern kontroll',
    AUTOMATISK_OPPRETTET_BEHANDLING: 'Automatisk opprettet behandling',
};

export const årsakerForStønadstype = (stønadstype: Stønadstype): Årsak[] => {
    switch (stønadstype) {
        case Stønadstype.BARNETILSYN:
            return ÅrsakerBarnetilsyn;
        case Stønadstype.OVERGANGSSTØNAD:
            return ÅrsakerOvergangsstønad;
        case Stønadstype.SKOLEPENGER:
            return ÅrsakerSkolepenger;
    }
};
