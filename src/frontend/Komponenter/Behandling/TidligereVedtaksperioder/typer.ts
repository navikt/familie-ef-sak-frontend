import { EPeriodetype } from '../../../App/typer/vedtak';

export interface ITidligereVedtaksperioder {
    infotrygd?: ITidligereInnvilgetVedtak;
    sak?: ITidligereInnvilgetVedtak;
    historiskPensjon?: boolean;
}

export interface ITidligereInnvilgetVedtak {
    harTidligereOvergangsstønad: boolean;
    harTidligereBarnetilsyn: boolean;
    harTidligereSkolepenger: boolean;
    periodeHistorikkOvergangsstønad: IGrunnlagsdataPeriodeHistorikk[];
}

export interface IGrunnlagsdataPeriodeHistorikk {
    periodeType: EPeriodetype;
    antMnd: number;
    fom: string;
    tom: string;
    harPeriodeUtenUtbetaling: boolean;
}
