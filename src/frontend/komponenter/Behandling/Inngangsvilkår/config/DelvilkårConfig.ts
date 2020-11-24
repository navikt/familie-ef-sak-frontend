import { DelvilkårType, IInngangsvilkårGrunnlag } from '../vilkår';

interface IDelvilkårConfig {
    harBegrunnelse?: boolean;
    skalVises?: (grunnlag: IInngangsvilkårGrunnlag) => boolean;
}

type DelvilkårConfig = {
    [key in DelvilkårType]?: IDelvilkårConfig;
};

export const DelvilkårConfig: DelvilkårConfig = {
    DOKUMENTERT_EKTESKAP: {
        skalVises: (grunnlag: IInngangsvilkårGrunnlag): boolean =>
            grunnlag.sivilstand.søknadsgrunnlag.erUformeltGift === true,
    },
    DOKUMENTERT_SEPARASJON_ELLER_SKILSMISSE: {
        skalVises: (grunnlag: IInngangsvilkårGrunnlag): boolean =>
            grunnlag.sivilstand.søknadsgrunnlag.erUformeltSeparertEllerSkilt === true,
    },
    KRAV_SIVILSTAND: {},
};
