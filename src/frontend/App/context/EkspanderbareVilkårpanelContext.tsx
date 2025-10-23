import React, { createContext, useContext, useState, type ReactNode } from 'react';
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

type EkspanderbareVilkårpanelContextType = {
    åpneAlle: (vilkårstype: EVilkårstyper) => void;
    lukkAlle: (vilkårstype: EVilkårstyper) => void;
    toggleEkspandertTilstand: (key: VilkårType) => void;
    settPanelITilstand: (key: VilkårType, tilstand: EkspandertTilstand) => void;
    ekspanderteVilkår: Record<VilkårType, EkspandertTilstand>;
};

const EkspanderbareVilkårpanelContext = createContext<
    EkspanderbareVilkårpanelContextType | undefined
>(undefined);

interface EkspanderbareVilkårpanelProviderProps {
    children: ReactNode;
}

export function EkspanderbareVilkårpanelProvider({
    children,
}: EkspanderbareVilkårpanelProviderProps) {
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

    const value = {
        åpneAlle,
        lukkAlle,
        toggleEkspandertTilstand,
        settPanelITilstand,
        ekspanderteVilkår,
    };

    return (
        <EkspanderbareVilkårpanelContext.Provider value={value}>
            {children}
        </EkspanderbareVilkårpanelContext.Provider>
    );
}

export const useEkspanderbareVilkårpanelContext = () => {
    const context = useContext(EkspanderbareVilkårpanelContext);
    if (context === undefined) {
        throw new Error(
            'useEkspanderbareVilkårpanelContext kan ikke brukes utenfor EkspanderbareVilkårpanelProvider'
        );
    }
    return context;
};
