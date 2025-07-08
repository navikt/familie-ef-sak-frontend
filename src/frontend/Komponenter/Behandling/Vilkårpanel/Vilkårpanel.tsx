import React, { FC, ReactNode } from 'react';
import { Vilkårsresultat, VilkårType } from '../Inngangsvilkår/vilkår';
import { Box, Button, Heading, HStack } from '@navikt/ds-react';
import { ChevronUpIcon, ChevronDownIcon } from '@navikt/aksel-icons';
import { VilkårsresultatIkon } from '../../../Felles/Ikoner/VilkårsresultatIkon';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import {
    EkspandertTilstand,
    useEkspanderbareVilkårpanelContext,
} from '../../../App/context/EkspanderbareVilkårpanelContext';

interface Props {
    tittel: string;
    paragrafTittel?: string;
    vilkårsresultat: Vilkårsresultat;
    children: ReactNode;
    vilkår: VilkårType;
}

export const Vilkårpanel: FC<Props> = ({
    tittel,
    paragrafTittel,
    vilkårsresultat,
    children,
    vilkår,
}) => {
    const { ekspanderteVilkår, toggleEkspandertTilstand } = useEkspanderbareVilkårpanelContext();

    return (
        <Box background="surface-subtle" style={{ margin: '0 2rem 2rem 2rem' }}>
            <HStack justify="space-between">
                <HStack gap="space-12" align={'center'} style={{ paddingLeft: '1rem' }}>
                    <VilkårsresultatIkon vilkårsresultat={vilkårsresultat} />
                    <Heading className={'tittel'} size="small" level="5">
                        {tittel}
                    </Heading>
                    {paragrafTittel && (
                        <BodyShortSmall className={'paragrafTittel'}>
                            {paragrafTittel}
                        </BodyShortSmall>
                    )}
                </HStack>
                <Button
                    size="medium"
                    variant="tertiary"
                    icon={
                        ekspanderteVilkår[vilkår] === EkspandertTilstand.KOLLAPSET ? (
                            <ChevronUpIcon />
                        ) : (
                            <ChevronDownIcon />
                        )
                    }
                    onClick={() => toggleEkspandertTilstand(vilkår)}
                    disabled={ekspanderteVilkår[vilkår] === EkspandertTilstand.KAN_IKKE_LUKKES}
                />
            </HStack>
            {ekspanderteVilkår[vilkår] !== EkspandertTilstand.KOLLAPSET && children}
        </Box>
    );
};
