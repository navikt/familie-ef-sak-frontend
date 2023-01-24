import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import { Button, Heading } from '@navikt/ds-react';
import { Collapse, Expand } from '@navikt/ds-icons';
import { VilkårsresultatIkon } from '../../../Felles/Ikoner/VilkårsresultatIkon';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import { ATextSubtle } from '@navikt/ds-tokens/dist/tokens';

const VilkårpanelBase = styled.div`
    margin: 2rem;
    background-color: #f7f7f7;
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
    innhold: JSX.Element;
}

export const Vilkårpanel: FC<Props> = ({ tittel, paragrafTittel, vilkårsresultat, innhold }) => {
    const [ekspandert, settEkspandert] = useState(true);

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
                        icon={ekspandert ? <Collapse /> : <Expand />}
                        onClick={() => settEkspandert(!ekspandert)}
                    />
                </VilkårpanelTittel>
                {ekspandert && innhold}
            </>
        </VilkårpanelBase>
    );
};
