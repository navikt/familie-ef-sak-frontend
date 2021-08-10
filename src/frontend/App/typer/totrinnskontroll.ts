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
          totrinnskontroll: TotrinnskontrollMedBegrunnelse;
      }
    | {
          status: TotrinnskontrollStatus.KAN_FATTE_VEDTAK | TotrinnskontrollStatus.UAKTUELT;
      };

export type TotrinnskontrollOpprettet = {
    opprettetAv: string;
    opprettetTid: string;
};

export type TotrinnskontrollMedBegrunnelse = TotrinnskontrollOpprettet & { begrunnelse: string };
