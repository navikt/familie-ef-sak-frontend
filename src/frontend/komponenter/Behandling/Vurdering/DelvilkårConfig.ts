import { DelvilkårType, IVilkårData } from '../Inngangsvilkår/vilkår';

interface IDelvilkårConfig {
    harBegrunnelse?: boolean;
    skalVises?: (vilkårData: IVilkårData) => boolean;
}

type DelvilkårConfig = {
    [key in DelvilkårType]?: IDelvilkårConfig;
};

export const DelvilkårConfig: DelvilkårConfig = {
    DOKUMENTERT_EKTESKAP: {
        skalVises: (vilkårData) => vilkårData.sivilstand.søknadsgrunnlag.erUformeltGift === true,
    },
    DOKUMENTERT_SEPARASJON_ELLER_SKILSMISSE: {
        skalVises: (vilkårData) =>
            vilkårData.sivilstand.søknadsgrunnlag.erUformeltSeparertEllerSkilt === true,
    },
    KRAV_SIVILSTAND: {},
};
