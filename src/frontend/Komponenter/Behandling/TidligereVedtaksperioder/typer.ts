import { EAktivitet, EPeriodetype } from '../../../App/typer/vedtak';

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
    sistePeriodeMedOvergangsstønad: IGrunnlagsdataSistePeriodeOvergangsstønad;
}

export interface IGrunnlagsdataPeriodeHistorikkOvergangsstønad {
    antallMåneder: number;
    antallMånederUtenBeløp: number;
    vedtaksperiodeType: EPeriodetype;
    fom: string;
    tom: string;
}
export interface IGrunnlagsdataSistePeriodeOvergangsstønad {
    fom: string;
    tom: string;
    vedtaksperiodeType: EPeriodetype;
    aktivitet: EAktivitet;
    inntekt: number;
    samordningsfradrag: number;
}

export enum OverlappMedOvergangsstønad {
    JA = 'JA',
    NEI = 'NEI',
    DELVIS = 'DELVIS',
}
export interface IGrunnlagsdataPeriodeHistorikkBarnetilsyn {
    fom: string;
    tom: string;
    overlapperMedOvergangsstønad: OverlappMedOvergangsstønad;
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
