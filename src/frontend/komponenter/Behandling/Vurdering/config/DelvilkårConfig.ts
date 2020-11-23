import { DelvilkårType, IVilkårdata } from '../../Inngangsvilkår/vilkår';

interface IDelvilkårConfig {
    harBegrunnelse?: boolean;
    skalVises?: (vilkårdata: IVilkårdata) => boolean;
}

type DelvilkårConfig = {
    [key in DelvilkårType]?: IDelvilkårConfig;
};

export const DelvilkårConfig: DelvilkårConfig = {
    DOKUMENTERT_EKTESKAP: {
        skalVises: (vilkårdata: IVilkårdata): boolean =>
            vilkårdata.sivilstand.søknadsgrunnlag.erUformeltGift === true,
    },
    DOKUMENTERT_SEPARASJON_ELLER_SKILSMISSE: {
        skalVises: (vilkårdata: IVilkårdata): boolean =>
            vilkårdata.sivilstand.søknadsgrunnlag.erUformeltSeparertEllerSkilt === true,
    },
    KRAV_SIVILSTAND: {},
};
