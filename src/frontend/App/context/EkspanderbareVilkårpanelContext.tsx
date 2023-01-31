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
    KAN_IKKE_LUKKES = 'KAN_IKKE_LUKKES',
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
                [key]: finnGyldigEkspanderbarTilstand(key as VilkårType, tilstand),
            }),
            {} as Record<VilkårType, EkspandertTilstand>
        );
    };

    const finnGyldigEkspanderbarTilstand = (
        key: VilkårType,
        tilstand: EkspandertTilstand
    ): EkspandertTilstand => {
        if (ekspanderteVilkår && ekspanderteVilkår[key] === EkspandertTilstand.KAN_IKKE_LUKKES)
            return EkspandertTilstand.KAN_IKKE_LUKKES;
        else return tilstand;
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
        if (ekspanderteVilkår[key] === EkspandertTilstand.KAN_IKKE_LUKKES) return;

        settEkspanderteVilkår((ekspanderteVilkår) => ({
            ...ekspanderteVilkår,
            [key]:
                ekspanderteVilkår[key] === EkspandertTilstand.EKSPANDERT
                    ? EkspandertTilstand.KOLLAPSET
                    : EkspandertTilstand.EKSPANDERT,
        }));
    };

    const settPanelITilstand = (key: VilkårType, tilstand: EkspandertTilstand) => {
        settEkspanderteVilkår((ekspanderteVilkår) => ({
            ...ekspanderteVilkår,
            [key]: tilstand,
        }));
    };

    return {
        åpneAlle,
        lukkAlle,
        toggleEkspandertTilstand,
        settPanelITilstand,
        ekspanderteVilkår,
    };
});

export { EkspanderbareVilkårpanelProvider, useEkspanderbareVilkårpanelContext };
