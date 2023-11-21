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
    periodeHistorikkOvergangsstønad: IGrunnlagsdataPeriodeHistorikkOvergangsstønad[];
    periodeHistorikkBarnetilsyn: IGrunnlagsdataPeriodeHistorikkBarnetilsyn[];
}

export interface IGrunnlagsdataPeriodeHistorikkOvergangsstønad {
    antallMåneder: number;
    antallMånederUtenBeløp: number;
    vedtaksperiodeType: EPeriodetype;
    fom: string;
    tom: string;
}
export interface IGrunnlagsdataPeriodeHistorikkBarnetilsyn {
    fom: string;
    tom: string;
}
export interface IHistorikkForStønad {
    stønadstype: string;
    skalViseInfotrygdKort?: boolean;
    periodeHistorikkData?:
        | IGrunnlagsdataPeriodeHistorikkOvergangsstønad[]
        | IGrunnlagsdataPeriodeHistorikkBarnetilsyn[]
        | undefined;
    harHistorikkISak: boolean | undefined;
    harHistorikkIInfotrygd: boolean | undefined;
}
