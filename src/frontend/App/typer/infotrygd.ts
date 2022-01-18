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

enum Kode {
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
