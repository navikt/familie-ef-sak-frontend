export interface AndreYtelser {
    arbeidsavklaringspenger: Arbeidsavklaringspenger;
}

export interface Arbeidsavklaringspenger {
    vedtak: VedtakArbeidsavklaringspenger[];
}

export interface VedtakArbeidsavklaringspenger {
    barnMedStonad: number;
    barnetillegg: number;
    beregningsgrunnlag: number;
    dagsats: number;
    dagsatsEtterUføreReduksjon: number;
    kildesystem: string;
    opphorsAarsak?: string;
    periode: PeriodeArbeidsavklaringspenger;
    rettighetsType: string;
    saksnummer: string;
    samordningsId?: string;
    status: string;
    vedtakId: string;
    vedtaksTypeKode?: string;
    vedtaksTypeNavn?: string;
    vedtaksdato: string;
}

export interface PeriodeArbeidsavklaringspenger {
    fraOgMedDato: string;
    tilOgMedDato: string;
}
