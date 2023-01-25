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

export enum EAktivitetsvilkår {
    AKTIVITET_OVERGANGSTØNAD = 'AKTIVITET_OVERGANGSTØNAD',
    SAGT_OPP_ELLER_REDUSERT = 'SAGT_OPP_ELLER_REDUSERT',
    AKTIVITET_BARNETILSYN = 'AKTIVITET_BARNETILSYN',
    INNTEKT = 'INNTEKT',
    ALDER_PÅ_BARN = 'ALDER_PÅ_BARN',
    DOKUMENTASJON_AV_TILSYNSUTGIFTER = 'DOKUMENTASJON_AV_TILSYNSUTGIFTER',
    RETT_TIL_OVERGANGSSTØNAD = 'RETT_TIL_OVERGANGSSTØNAD',
    DOKUMENTASJON_UTDANNING = 'DOKUMENTASJON_UTDANNING',
    UTDANNING_HENSIKTSMESSIG = 'UTDANNING_HENSIKTSMESSIG',
}

export type IVilkårstype = EInngangsvilkår | EAktivitetsvilkår;

const [EkspanderbareVilkårpanelProvider, useEkspanderbareVilkårpanelContext] = constate(() => {
    const vilkårsTyper = { ...EInngangsvilkår, ...EAktivitetsvilkår };

    const settAlleTil = (tilstand: EkspandertTilstand) =>
        Object.keys(vilkårsTyper).reduce(
            (acc, key) => ({
                ...acc,
                [key]: tilstand,
            }),
            {} as Record<IVilkårstype, EkspandertTilstand>
        );

    const [ekspanderteVilkår, settEkspanderteVilkår] = useState<
        Record<IVilkårstype, EkspandertTilstand>
    >(settAlleTil(EkspandertTilstand.EKSPANDERT));

    const lukkAlle = () => {
        settEkspanderteVilkår(settAlleTil(EkspandertTilstand.KOLLAPSET));
    };

    const åpneAlle = () => {
        settEkspanderteVilkår(settAlleTil(EkspandertTilstand.EKSPANDERT));
    };

    const toggleEkspandertTilstand = (key: IVilkårstype) => {
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
