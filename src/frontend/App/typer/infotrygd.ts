import { Stønadstype } from './behandlingstema';

export interface InfotrygdPerioderResponse {
    overgangsstønad: Perioder;
    barnetilsyn: Perioder;
    skolepenger: Perioder;
}

export interface Perioder {
    perioder: InfotrygdPeriode[];
    summert: SummertPeriode[];
}

export interface SummertPeriode {
    stønadFom: string;
    stønadTom: string;
    beløp: number;
    inntektsgrunnlag: number;
    inntektsreduksjon: number;
    samordningsfradrag: number;
}

export interface InfotrygdPeriode {
    stønadId: number;
    vedtakId: number;
    vedtakstidspunkt: string;

    stønadFom: string;
    stønadTom: string;
    opphørsdato?: string;

    beløp: number;
    inntektsgrunnlag: number;
    samordningsfradrag: number;

    kode: Kode;
    sakstype: Sakstype;
    kodeOvergangsstønad?: InfotrygdOvergangsstønadKode;
    aktivitetstype?: InfotrygdAktivitetstype;
    brukerId: string;
}

export enum Kode {
    ANNULERT = 'ANNULERT',
    ENDRING_BEREGNINGSGRUNNLAG = 'ENDRING_BEREGNINGSGRUNNLAG',
    FØRSTEGANGSVEDTAK = 'FØRSTEGANGSVEDTAK',
    G_REGULERING = 'G_REGULERING',
    NY = 'NY',
    OPPHØRT = 'OPPHØRT',
    SATSENDRING = 'SATSENDRING',
    UAKTUELL = 'UAKTUELL',
    OVERTFØRT_NY_LØSNING = 'OVERTFØRT_NY_LØSNING',
}

export const kodeTilTekst: Record<Kode, string> = {
    ANNULERT: 'Annullert (AN)',
    ENDRING_BEREGNINGSGRUNNLAG: 'Endring i beregningsgrunnlag (E)',
    FØRSTEGANGSVEDTAK: 'Førstegangsvedtak (F)',
    G_REGULERING: 'G-regulering (G)',
    NY: 'Ny (NY)',
    OPPHØRT: 'Opphørt (O)',
    SATSENDRING: 'Satsendring (S)',
    UAKTUELL: 'Uaktuell (UA)',
    OVERTFØRT_NY_LØSNING: 'Overf ny løsning (OO)',
};

enum Sakstype {
    KLAGE = 'KLAGE',
    MASKINELL_G_OMREGNING = 'MASKINELL_G_OMREGNING',
    REVURDERING = 'REVURDERING',
    GRUNNBELØP_OMREGNING = 'GRUNNBELØP_OMREGNING',
    KONVERTERING = 'KONVERTERING',
    MASKINELL_SATSOMREGNING = 'MASKINELL_SATSOMREGNING',
    ANKE = 'ANKE',
    SØKNAD = 'SØKNAD',
    SØKNAD_ØKNING_ENDRING = 'SØKNAD_ØKNING_ENDRING',
}

export const sakstypeTilTekst: Record<Sakstype, string> = {
    KLAGE: 'Klage (K)',
    MASKINELL_G_OMREGNING: 'Maskinell G-omregning (MG)',
    REVURDERING: 'Revurdering (R)',
    GRUNNBELØP_OMREGNING: 'Grunnbeløp omregning (GO)',
    KONVERTERING: 'Konvertering (KO)',
    MASKINELL_SATSOMREGNING: 'Maskinell satsomregning (MS)',
    ANKE: 'Anke (A)',
    SØKNAD: 'Søknad (S)',
    SØKNAD_ØKNING_ENDRING: 'Søknad om økning/endring (SØ)',
};

enum InfotrygdOvergangsstønadKode {
    BARN_UNDER_1_3_ÅR = 'BARN_UNDER_1_3_ÅR',
    YRKESRETTET_AKTIVITET_BARN_FYLT_1_3_ÅR = 'YRKESRETTET_AKTIVITET_BARN_FYLT_1_3_ÅR',
    UNNTAK_FRA_KRAV_TIL_YRKESRETTET_AKTIVITET = 'UNNTAK_FRA_KRAV_TIL_YRKESRETTET_AKTIVITET',
    UTVIDELSE_NØDVENDIG_UTDANNING = 'UTVIDELSE_NØDVENDIG_UTDANNING',
    PÅVENTE_SKOLESTART_ARBEID_TILSYNSPLASS = 'PÅVENTE_SKOLESTART_ARBEID_TILSYNSPLASS',
    YRKESRETTET_AKTIVITET = 'YRKESRETTET_AKTIVITET',
    FORBIGÅENDE_SYKDOM = 'FORBIGÅENDE_SYKDOM',
    SÆRLIG_TILSSYNSKREVENDE_BARN = 'SÆRLIG_TILSSYNSKREVENDE_BARN',
    ETABLERER_EGEN_VIRKSOMHET = 'ETABLERER_EGEN_VIRKSOMHET',
    FORTSATT_INNVILGET_TROSS_VARSEL_OM_OPPHØR_PGA_SAMBOER = 'FORTSATT_INNVILGET_TROSS_VARSEL_OM_OPPHØR_PGA_SAMBOER',
}

export const overgangsstønadKodeTilTekst: Record<InfotrygdOvergangsstønadKode, string> = {
    BARN_UNDER_1_3_ÅR: 'Barn under 1 år / 3 år (gamle tilfeller)',
    YRKESRETTET_AKTIVITET_BARN_FYLT_1_3_ÅR:
        'Er i yrkesrettet aktivitet - barn har fylt 1 år / 3 år (gamle tilfeller)',
    UNNTAK_FRA_KRAV_TIL_YRKESRETTET_AKTIVITET:
        'Unntak fra krav til yrkesr. aktivitet når barn har fylt 1 år / år (gamle tilfeller)',
    UTVIDELSE_NØDVENDIG_UTDANNING: 'Utvidelse på grunn av nødvendig utdanning jf 15-6. 3. ledd',
    PÅVENTE_SKOLESTART_ARBEID_TILSYNSPLASS:
        'I påvente av skolestart/arbeid/tilsynsplass 15-6. 4. ledd',
    YRKESRETTET_AKTIVITET: 'Er i yrkesrettet aktivitet - i omstillingstid',
    FORBIGÅENDE_SYKDOM: 'Forbig. sykdom hos forsørger eller barnet 15-6. 6. ledd',
    SÆRLIG_TILSSYNSKREVENDE_BARN: 'Har særlig tilssynskrevende barn',
    ETABLERER_EGEN_VIRKSOMHET: 'Etablerer egen virksomhet',
    FORTSATT_INNVILGET_TROSS_VARSEL_OM_OPPHØR_PGA_SAMBOER: 'Fortsatt innvilget tro',
};

enum InfotrygdAktivitetstype {
    I_ARBEID = 'I_ARBEID',
    I_UTDANNING = 'I_UTDANNING',
    TILMELDT_SOM_REELL_ARBEIDSSØKER = 'TILMELDT_SOM_REELL_ARBEIDSSØKER',
    KURS = 'KURS',
    BRUKERKONTAKT = 'BRUKERKONTAKT',
    IKKE_I_AKTIVITET = 'IKKE_I_AKTIVITET',
}

export const aktivitetstypeTilTekst: Record<InfotrygdAktivitetstype, string> = {
    I_ARBEID: 'I arbeid (A)',
    I_UTDANNING: 'I utdanning (U)',
    TILMELDT_SOM_REELL_ARBEIDSSØKER: 'Tilmeldt som reell arbeidssøker (S)',
    KURS: 'Kurs o.l. (K)',
    BRUKERKONTAKT: 'Brukerkontakt (B)',
    IKKE_I_AKTIVITET: 'Ikke i aktivitet (N)',
};

export interface InfotrygdSakerResponse {
    saker: InfotrygdSak[];
}
export interface InfotrygdSak {
    personIdent: string;
    id?: number;
    saksnr?: string;
    saksblokk?: string;
    registrertDato?: string;
    mottattDato?: string;
    kapittelnr: string;
    stønadType: Stønadstype;
    undervalg?: InfotrygdSakUndervalg;
    type?: InfotrygdSakType;
    nivå?: InfotrygdSakNivå;
    resultat: InfotrygdSakResultat;
    vedtaksdato?: string;
    iverksattdato?: string;
    årsakskode?: string;
    behandlendeEnhet?: string;
    registrertAvEnhet?: string;
    tkNr?: string;
    region?: string;
}

export enum InfotrygdSakType {
    ANKE = 'ANKE',
    DISPENSASJON_FORELDELSE = 'DISPENSASJON_FORELDELSE',
    DOKUMENTINNSYN = 'DOKUMENTINNSYN',
    ETTERLYSE_GIROKORT = 'ETTERLYSE_GIROKORT',
    FORESPØRSEL = 'FORESPØRSEL',
    GRUNNBELØP_OMREGNING_OVERGANGSSTØNAD = 'GRUNNBELØP_OMREGNING_OVERGANGSSTØNAD',
    INFORMASJONSSAK = 'INFORMASJONSSAK',
    JOURNALSAK = 'JOURNALSAK',
    JOURNALSAK_PRIVATPERSON = 'JOURNALSAK_PRIVATPERSON',
    JOURNALSAK_TRYGDEKONTOR = 'JOURNALSAK_TRYGDEKONTOR',
    JOURNALSAK_UTENL = 'JOURNALSAK_UTENL',
    KLAGE = 'KLAGE',
    KLAGE_AVREGNING = 'KLAGE_AVREGNING',
    KLAGE_ETTERGIVELSE = 'KLAGE_ETTERGIVELSE',
    KONVERTERING = 'KONVERTERING',
    KONTROLLSAK = 'KONTROLLSAK',
    KLAGE_TILBAKEBETALING = 'KLAGE_TILBAKEBETALING',
    MASKINELL_G_OMREGNING = 'MASKINELL_G_OMREGNING',
    MASKINELL_SATSOMREGNING = 'MASKINELL_SATSOMREGNING',
    REVURDERING = 'REVURDERING',
    SØKNAD = 'SØKNAD',
    SØKNAD_ETTERGIVELSE = 'SØKNAD_ETTERGIVELSE',
    STRAFFERETTSLIG_VURDERING = 'STRAFFERETTSLIG_VURDERING',
    SØKNAD_ØKNING_ENDRING = 'SØKNAD_ØKNING_ENDRING',
    TILBAKEBETALINGSSAK = 'TILBAKEBETALINGSSAK',
    TILBAKEBETALING_AVREGNING = 'TILBAKEBETALING_AVREGNING',
    TILBAKEBETALING_ENDRING = 'TILBAKEBETALING_ENDRING',
    TIPSUTREDNING = 'TIPSUTREDNING',
    UTBETALING_TIL_ANNEN = 'UTBETALING_TIL_ANNEN',
    VURDERING_UTESTENGING = 'VURDERING_UTESTENGING',
}

export const infotrygdSakTypeTilTekst: Record<InfotrygdSakType, string> = {
    ANKE: 'Anke (A)',
    DISPENSASJON_FORELDELSE: 'Dispensasjon foreldelse (DF)',
    DOKUMENTINNSYN: 'Dokumentinnsyn (DI)',
    ETTERLYSE_GIROKORT: 'Etterlyse girokort (EG)',
    FORESPØRSEL: 'Forespørsel (FS)',
    GRUNNBELØP_OMREGNING_OVERGANGSSTØNAD:
        'Grunnbeløp omregning (manuell G-omregning) Overgangsstønad (GO)',
    INFORMASJONSSAK: 'Informasjonssak (I)',
    JOURNALSAK: 'Journalsak (J)',
    JOURNALSAK_PRIVATPERSON: 'Journalsak fra privatperson (JP)',
    JOURNALSAK_TRYGDEKONTOR: 'Journalsak fra trygdekontor (JT)',
    JOURNALSAK_UTENL: 'Journalsak fra utenl trm (JU)',
    KLAGE: 'Klage (K)',
    KLAGE_AVREGNING: 'Klage avregning (KA)',
    KLAGE_ETTERGIVELSE: 'Klage ettergivelse (KE)',
    KONVERTERING: 'Konvertering, de som ble lagt inn da rutinen ble lagt over til DB2 (KO)',
    KONTROLLSAK: 'Kontrollsak (KS)',
    KLAGE_TILBAKEBETALING: 'Klage tilbakebetaling (KT)',
    MASKINELL_G_OMREGNING: 'Maskinell G-omregning (Årlig G-reg. overgangsstønad) (MG)',
    MASKINELL_SATSOMREGNING: 'Maskinell Satsomregning (Årlig satsendring Barnetilsyn) (MS)',
    REVURDERING: 'Revurdering (R)',
    SØKNAD: 'Søknad (S)',
    SØKNAD_ETTERGIVELSE: 'Søknad om ettergivelse (SE)',
    STRAFFERETTSLIG_VURDERING: 'Strafferettslig vurdering (SV)',
    SØKNAD_ØKNING_ENDRING: 'Søknad om økning/endring (SØ)',
    TILBAKEBETALINGSSAK: 'Tilbakebetalingssak (T)',
    TILBAKEBETALING_AVREGNING: 'Tilbakebetaling avregning (TA)',
    TILBAKEBETALING_ENDRING: 'Tilbakebetaling endring (TE)',
    TIPSUTREDNING: 'Tipsutredning (TU)',
    UTBETALING_TIL_ANNEN: 'Utbetaling til annen (UA)',
    VURDERING_UTESTENGING: 'Vurdering utestenging (VU)',
};

export enum InfotrygdSakResultat {
    ÅPEN_SAK = 'ÅPEN_SAK',
    AVSLAG = 'AVSLAG',
    AVSLAG_GODKJENT = 'AVSLAG_GODKJENT',
    AVVIST_KLAGE = 'AVVIST_KLAGE',
    ANNULLERING = 'ANNULLERING',
    ADVARSEL = 'ADVARSEL',
    DELVIS_GODKJENT = 'DELVIS_GODKJENT',
    DELVIS_INNVILGET = 'DELVIS_INNVILGET',
    DELVIS_TILBAKEBETALE = 'DELVIS_TILBAKEBETALE',
    FERDIG_BEHANDLET = 'FERDIG_BEHANDLET',
    FORTSATT_INNVILGET = 'FORTSATT_INNVILGET',
    GODKJENT = 'GODKJENT',
    HENLAGT_TRUKKET_TILBAKE = 'HENLAGT_TRUKKET_TILBAKE',
    HENLAGT_BORTFALT = 'HENLAGT_BORTFALT',
    INNVILGET = 'INNVILGET',
    IKKE_BEHANDLET = 'IKKE_BEHANDLET',
    INNVILGET_NY_SITUASJON = 'INNVILGET_NY_SITUASJON',
    IKKE_STRAFFBART = 'IKKE_STRAFFBART',
    IKKE_TILBAKEBETALE = 'IKKE_TILBAKEBETALE',
    IU = 'IU',
    KLAGE = 'KLAGE',
    MIDLERTIDIG_OPPHØRT = 'MIDLERTIDIG_OPPHØRT',
    HJEMVIST_FOR_NY_BEHANDLING = 'HJEMVIST_FOR_NY_BEHANDLING',
    OPPHØRT = 'OPPHØRT',
    POLITIANMELDELSE = 'POLITIANMELDELSE',
    REDUSERT = 'REDUSERT',
    TILBAKEBETALE = 'TILBAKEBETALE',
    TVANGSGEBYR_FASTHOLDES = 'TVANGSGEBYR_FASTHOLDES',
    TIPS_OPPFØLGING = 'TIPS_OPPFØLGING',
    VU = 'VU',
    ØKNING = 'ØKNING',
}

export const infotrygdSakResultatTilTekst: Record<InfotrygdSakResultat, string> = {
    ÅPEN_SAK: 'Åpen sak ()',
    AVSLAG: 'Avslag (A)',
    AVSLAG_GODKJENT: 'Avslag godkjent (AG)',
    AVVIST_KLAGE: 'Avvist klage (AK)',
    ANNULLERING: 'Annullering (AN)',
    ADVARSEL: 'Advarsel (AV)',
    DELVIS_GODKJENT: 'Delvis godkjent (DG)',
    DELVIS_INNVILGET: 'Delvis innvilget (DI)',
    DELVIS_TILBAKEBETALE: 'Delvis tilbakebetale (DT)',
    FERDIG_BEHANDLET: 'Ferdig behandlet (FB)',
    FORTSATT_INNVILGET: 'Fortsatt innvilget (FI)',
    GODKJENT: 'Godkjent (GK)',
    HENLAGT_TRUKKET_TILBAKE: 'Henlagt / trukket tilbake (H)',
    HENLAGT_BORTFALT: 'Henlagt / bortfalt (HB)',
    INNVILGET: 'Innvilget (I)',
    IKKE_BEHANDLET: 'Ikke behandlet (IB)',
    INNVILGET_NY_SITUASJON: 'Innvilget ny situasjon (IN)',
    IKKE_STRAFFBART: 'Ikke straffbart (IS)',
    IKKE_TILBAKEBETALE: 'Ikke tilbakebetale (IT)',
    IU: '(IU)',
    KLAGE: 'Klage (K)',
    MIDLERTIDIG_OPPHØRT: 'Midlertidig opphørt (MO)',
    HJEMVIST_FOR_NY_BEHANDLING: 'Hjemvist for ny behandling (NB)',
    OPPHØRT: 'Opphørt (O)',
    POLITIANMELDELSE: 'Politianmeldelse (PA)',
    REDUSERT: 'Redusert (R)',
    TILBAKEBETALE: 'Tilbakebetale (TB)',
    TVANGSGEBYR_FASTHOLDES: 'Tvangsgebyr fastholdes (TF)',
    TIPS_OPPFØLGING: 'Tips oppfølging (TO)',
    VU: '(VU)',
    ØKNING: 'Økning (Ø)',
};

export enum InfotrygdSakNivå {
    AN = 'AN',
    FOLKETRYGDKONTORET_FOR_UTENLANDSSAKER = 'FOLKETRYGDKONTORET_FOR_UTENLANDSSAKER',
    HTF = 'HTF',
    KLAGE_ANKE = 'KLAGE_ANKE',
    KI = 'KI',
    RIKSTRYGDEVERKET = 'RIKSTRYGDEVERKET',
    SFK = 'SFK',
    NAV_KONTOR = 'NAV_KONTOR',
    TRYGDERETTEN = 'TRYGDERETTEN',
}

export const infotrygdSakNivåTilTekst: Record<InfotrygdSakNivå, string> = {
    AN: '(AN)',
    FOLKETRYGDKONTORET_FOR_UTENLANDSSAKER: 'Folketrygdkontoret for utenlandssaker (FFU)',
    HTF: '(HTF)',
    KLAGE_ANKE: 'Klage/anke (KA)',
    KI: '(KI)',
    RIKSTRYGDEVERKET: 'Rikstrygdeverket (RTV)',
    SFK: '(SFK)',
    NAV_KONTOR: 'NAV-kontor (trygdekontor) (TK)',
    TRYGDERETTEN: 'Trygderetten (TR)',
};

export enum InfotrygdSakUndervalg {
    AK = 'AK',
    NY = 'NY',
    OL = 'OL',
    OR = 'OR',
}
