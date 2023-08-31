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
    øyeblikksbildeAvPerioderOgPeriodetype: IGrunnlagsdataPeriodeHistorikk[];
}

export interface IGrunnlagsdataPeriodeHistorikk {
    periodeType: EPeriodetype;
    periode: IMånedsperiode;
}

export interface IMånedsperiode {
    fom: string;
    tom: string;
}
