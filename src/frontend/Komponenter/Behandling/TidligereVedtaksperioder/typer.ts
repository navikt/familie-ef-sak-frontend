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
    antallMåneder: number;
    antallMånederUtenBeløp: number;
    vedtaksperiodeType: EPeriodetype;
    fom: string;
    tom: string;
}

export interface IHistorikkForStønad {
    stønadstype: string;
    skalViseInfotrygdKort?: boolean;
    periodeHistorikkData?: IGrunnlagsdataPeriodeHistorikk[] | undefined;
    harHistorikkISak: boolean | undefined;
    harHistorikkIInfotrygd: boolean | undefined;
}
