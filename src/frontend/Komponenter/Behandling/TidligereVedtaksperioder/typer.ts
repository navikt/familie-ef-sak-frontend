export interface ITidligereVedtaksperioder {
    infotrygd?: ITidligereInnvilgetVedtak;
}

export interface ITidligereInnvilgetVedtak {
    harTidligereOvergangsstønad: boolean;
    harTidligereBarnetilsyn: boolean;
    harTidligereSkolepenger: boolean;
}
