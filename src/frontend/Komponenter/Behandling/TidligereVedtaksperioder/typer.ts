export interface ITidligereVedtaksperioder {
    infotrygd?: IFinnesTidligereVedtaksperioder;
}

export interface IFinnesTidligereVedtaksperioder {
    overgangsstønad: boolean;
    barnetilsyn: boolean;
    skolepenger: boolean;
}
