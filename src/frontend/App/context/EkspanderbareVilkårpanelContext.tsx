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
    const allePanelEkspandert = Object.keys(EInngangsvilkår).reduce(
        (acc, key) => ({
            ...acc,
            [key]: EkspandertTilstand.EKSPANDERT,
        }),
        {} as Record<EInngangsvilkår, EkspandertTilstand>
    );

    const [ekspanderteVilkår, settEkspanderteVilkår] =
        useState<Record<EInngangsvilkår, EkspandertTilstand>>(allePanelEkspandert);

    const toggleEkspandertTilstand = (key: EInngangsvilkår) => {
        settEkspanderteVilkår({
            ...ekspanderteVilkår,
            [key]:
                ekspanderteVilkår[key] === EkspandertTilstand.EKSPANDERT
                    ? EkspandertTilstand.KOLLAPSET
                    : EkspandertTilstand.EKSPANDERT,
        });
    };

    const lukkAlle = () => {
        settEkspanderteVilkår(
            Object.keys(EInngangsvilkår).reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: EkspandertTilstand.KOLLAPSET,
                }),
                {} as Record<EInngangsvilkår, EkspandertTilstand>
            )
        );
    };

    const åpneAlle = () => {
        settEkspanderteVilkår(allePanelEkspandert);
    };

    return {
        åpneAlle,
        lukkAlle,
        toggleEkspandertTilstand,
        ekspanderteVilkår,
    };
});

export { EkspanderbareVilkårpanelProvider, useEkspanderbareVilkårpanelContext };
