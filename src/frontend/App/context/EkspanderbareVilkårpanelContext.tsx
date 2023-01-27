import constate from 'constate';
import { useState } from 'react';
import {
    AktivitetsvilkårType,
    InngangsvilkårType,
    VilkårType,
} from '../../Komponenter/Behandling/Inngangsvilkår/vilkår';

export enum EkspandertTilstand {
    EKSPANDERT = 'EKSPANDERT',
    KOLLAPSET = 'KOLLAPSET',
}

export enum EVilkårstyper {
    INNGANGSVILKÅR = 'INNGANGSVILKÅR',
    AKTIVITETSVILKÅR = 'AKTIVITETSVILKÅR',
}

const [EkspanderbareVilkårpanelProvider, useEkspanderbareVilkårpanelContext] = constate(() => {
    const vilkårtyper = { ...InngangsvilkårType, ...AktivitetsvilkårType };

    const settAlleTil = (tilstand: EkspandertTilstand, vilkårstype?: EVilkårstyper) => {
        const vilkårSomSkalEndres = vilkårstype
            ? vilkårstype === EVilkårstyper.INNGANGSVILKÅR
                ? InngangsvilkårType
                : AktivitetsvilkårType
            : vilkårtyper;

        return Object.keys(vilkårSomSkalEndres).reduce(
            (acc, key) => ({
                ...acc,
                [key]: tilstand,
            }),
            {} as Record<VilkårType, EkspandertTilstand>
        );
    };

    const [ekspanderteVilkår, settEkspanderteVilkår] = useState<
        Record<VilkårType, EkspandertTilstand>
    >(settAlleTil(EkspandertTilstand.EKSPANDERT));

    const lukkAlle = (vilkårstype: EVilkårstyper) => {
        const oppdaterteVilkår = settAlleTil(EkspandertTilstand.KOLLAPSET, vilkårstype);
        settEkspanderteVilkår((ekspanderteVilkår) => ({
            ...ekspanderteVilkår,
            ...oppdaterteVilkår,
        }));
    };

    const åpneAlle = (vilkårstype: EVilkårstyper) => {
        const oppdaterteVilkår = settAlleTil(EkspandertTilstand.EKSPANDERT, vilkårstype);
        settEkspanderteVilkår((ekspanderteVilkår) => ({
            ...ekspanderteVilkår,
            ...oppdaterteVilkår,
        }));
    };

    const toggleEkspandertTilstand = (key: VilkårType) => {
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
