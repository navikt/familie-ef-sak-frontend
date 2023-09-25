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

export interface IStonader {
    stønadstype: string;
    viseInfotrygdKort?: boolean;
    historikkISak?: IGrunnlagsdataPeriodeHistorikk[] | undefined;
    verdier?: IVerdier;
}

interface IVerdier {
    sak: boolean | undefined;
    infotrygd: boolean | undefined;
}
