import constate from 'constate';
import { useState } from 'react';

export enum EkspandertTilstand {
    EKSPANDERT = 'EKSPANDERT',
    KOLLAPSET = 'KOLLAPSET',
}

export enum EInngangsvilkår {
    MEDLEMSKAP = 'MEDLEMSKAP',
    OPPHOLD = 'OPPHOLD',
    MOR_ELLER_FAR = 'MOR_ELLER_FAR',
    NYTT_BARN_SAMME_PARTNER = 'NYTT_BARN_SAMME_PARTNER',
    SIVILSTAND = 'SIVILSTAND',
    SAMLIV = 'SAMLIV',
    ALENEOMSORG = 'ALENEOMSORG',
}

const [EkspanderbareVilkårpanelProvider, useEkspanderbareVilkårpanelContext] = constate(() => {
    const settAlleTil = (tilstand: EkspandertTilstand) =>
        Object.keys(EInngangsvilkår).reduce(
            (acc, key) => ({
                ...acc,
                [key]: tilstand,
            }),
            {} as Record<EInngangsvilkår, EkspandertTilstand>
        );

    const [ekspanderteVilkår, settEkspanderteVilkår] = useState<
        Record<EInngangsvilkår, EkspandertTilstand>
    >(settAlleTil(EkspandertTilstand.EKSPANDERT));

    const lukkAlle = () => {
        settEkspanderteVilkår(settAlleTil(EkspandertTilstand.KOLLAPSET));
    };

    const åpneAlle = () => {
        settEkspanderteVilkår(settAlleTil(EkspandertTilstand.EKSPANDERT));
    };

    const toggleEkspandertTilstand = (key: EInngangsvilkår) => {
        settEkspanderteVilkår((ekspanderteVilkår) => ({
            ...ekspanderteVilkår,
            [key]:
                ekspanderteVilkår[key] === EkspandertTilstand.EKSPANDERT
                    ? EkspandertTilstand.KOLLAPSET
                    : EkspandertTilstand.EKSPANDERT,
        }));
    };

    return {
        åpneAlle,
        lukkAlle,
        toggleEkspandertTilstand,
        ekspanderteVilkår,
    };
});

export { EkspanderbareVilkårpanelProvider, useEkspanderbareVilkårpanelContext };
