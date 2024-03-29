import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { Vilkårsresultat, VilkårType } from '../Inngangsvilkår/vilkår';
import { Button, Heading } from '@navikt/ds-react';
import { ChevronUpIcon, ChevronDownIcon } from '@navikt/aksel-icons';
import { VilkårsresultatIkon } from '../../../Felles/Ikoner/VilkårsresultatIkon';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import { AGray50, ATextSubtle } from '@navikt/ds-tokens/dist/tokens';
import {
    EkspandertTilstand,
    useEkspanderbareVilkårpanelContext,
} from '../../../App/context/EkspanderbareVilkårpanelContext';

const VilkårpanelBase = styled.div`
    margin: 2rem;
    background-color: ${AGray50};
`;

const VilkårpanelTittel = styled.div`
    padding-left: 1rem;
    display: flex;
    justify-content: space-between;
`;

const VilkårsresultatContainer = styled.span`
    display: flex;
    align-items: center;

    .tittel {
        margin: 0 1rem 0 0.5rem;
    }

    .paragrafTittel {
        color: ${ATextSubtle};
    }
`;

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
        <VilkårpanelBase>
            <>
                <VilkårpanelTittel>
                    <VilkårsresultatContainer>
                        <VilkårsresultatIkon vilkårsresultat={vilkårsresultat} />
                        <Heading className={'tittel'} size="small" level="5">
                            {tittel}
                        </Heading>
                        {paragrafTittel && (
                            <BodyShortSmall className={'paragrafTittel'}>
                                {paragrafTittel}
                            </BodyShortSmall>
                        )}
                    </VilkårsresultatContainer>
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
                </VilkårpanelTittel>
                {ekspanderteVilkår[vilkår] !== EkspandertTilstand.KOLLAPSET && children}
            </>
        </VilkårpanelBase>
    );
};
