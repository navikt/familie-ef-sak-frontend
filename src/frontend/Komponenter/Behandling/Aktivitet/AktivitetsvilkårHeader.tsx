import React from 'react';
import {
    EVilkårstyper,
    useEkspanderbareVilkårpanelContext,
} from '../../../App/context/EkspanderbareVilkårpanelContext';
import { ÅpneOgLukkePanelKnapper } from '../Inngangsvilkår/ÅpneOgLukkePanelKnapper';
import { HStack } from '@navikt/ds-react';

export const AktivitetsvilkårHeader: React.FC = () => {
    const { lukkAlle, åpneAlle } = useEkspanderbareVilkårpanelContext();

    return (
        <HStack justify="end" style={{ margin: '2rem' }}>
            <ÅpneOgLukkePanelKnapper
                lukkAlle={() => lukkAlle(EVilkårstyper.AKTIVITETSVILKÅR)}
                åpneAlle={() => åpneAlle(EVilkårstyper.AKTIVITETSVILKÅR)}
            />
        </HStack>
    );
};
