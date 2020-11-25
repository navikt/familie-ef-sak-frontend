import { DelvilkårType } from '../vilkår';

interface IDelvilkårConfig {
    harBegrunnelse?: boolean;
}

type DelvilkårConfig = {
    [key in DelvilkårType]?: IDelvilkårConfig;
};

export const DelvilkårConfig: DelvilkårConfig = {
    DOKUMENTERT_EKTESKAP: {},
    DOKUMENTERT_SEPARASJON_ELLER_SKILSMISSE: {},
    KRAV_SIVILSTAND: {},
};
