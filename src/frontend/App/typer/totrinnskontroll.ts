export enum TotrinnskontrollStatus {
    IKKE_AUTORISERT = 'IKKE_AUTORISERT',
    TOTRINNSKONTROLL_UNDERKJENT = 'TOTRINNSKONTROLL_UNDERKJENT',
    UAKTUELT = 'UAKTUELT',
    KAN_FATTE_VEDTAK = 'KAN_FATTE_VEDTAK',
}

export type TotrinnskontrollResponse =
    | {
          status: TotrinnskontrollStatus.IKKE_AUTORISERT;
          totrinnskontroll: TotrinnskontrollOpprettet;
      }
    | {
          status: TotrinnskontrollStatus.TOTRINNSKONTROLL_UNDERKJENT;
          totrinnskontroll: TotrinnskontrollMedBegrunnelseOgÅrsaker;
      }
    | {
          status: TotrinnskontrollStatus.KAN_FATTE_VEDTAK | TotrinnskontrollStatus.UAKTUELT;
      };

export type TotrinnskontrollOpprettet = {
    opprettetAv: string;
    opprettetTid: string;
};

export type TotrinnskontrollMedBegrunnelseOgÅrsaker = TotrinnskontrollOpprettet & {
    begrunnelse: string;
    årsakerUnderkjent?: ÅrsakUnderkjent[];
};

export enum ÅrsakUnderkjent {
    TIDLIGERE_VEDTAKSPERIODER = 'TIDLIGERE_VEDTAKSPERIODER',
    INNGANGSVILKÅR_FORUTGÅENDE_MEDLEMSKAP_OPPHOLD = 'INNGANGSVILKÅR_FORUTGÅENDE_MEDLEMSKAP_OPPHOLD',
    INNGANGSVILKÅR_ALENEOMSORG = 'INNGANGSVILKÅR_ALENEOMSORG',
    AKTIVITET = 'AKTIVITET',
    VEDTAK_OG_BEREGNING = 'VEDTAK_OG_BEREGNING',
    VEDTAKSBREV = 'VEDTAKSBREV',
}

export const årsakUnderkjentTilTekst: Record<ÅrsakUnderkjent, string> = {
    TIDLIGERE_VEDTAKSPERIODER: 'Tidligere vedtaksperioder',
    INNGANGSVILKÅR_FORUTGÅENDE_MEDLEMSKAP_OPPHOLD:
        'Inngangsvilkår - Forutgående medlemskap og opphold',
    INNGANGSVILKÅR_ALENEOMSORG: 'Inngangsvilkår - Aleneomsorg',
    AKTIVITET: 'Aktivitet',
    VEDTAK_OG_BEREGNING: 'Vedtak og beregning',
    VEDTAKSBREV: 'Vedtaksbrev',
};
