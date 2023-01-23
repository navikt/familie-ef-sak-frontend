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

const VilkårpanelInnhold = styled.div`
    display: flex;
    padding: 1rem;

    @media (max-width: 1600px) {
        flex-direction: column;
    }

    .venstreKolonne {
        padding: 1.5rem 0;
        width: 50%;

        @media (max-width: 1600px) {
            width: 100%;
        }
    }
    .høyreKolonne {
        padding: 1.5rem 0;
        width: 50%;
        max-width: 50rem;
        @media (max-width: 1600px) {
            width: 100%;
        }
    }
`;

interface Props {
    tittel: string;
    paragrafTittel?: string;
    vilkårsresultat: Vilkårsresultat;
    children: {
        venstre: JSX.Element;
        høyre: JSX.Element;
    };
}

export const Vilkårpanel: FC<Props> = ({
    tittel,
    paragrafTittel,
    vilkårsresultat,
    children: { venstre, høyre },
}) => {
    const [ekspandert, settEkspandert] = useState(true);

    return (
        <VilkårpanelBase>
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
            {ekspandert && (
                <VilkårpanelInnhold>
                    <div className="venstreKolonne">{venstre}</div>
                    <div className="høyreKolonne">{høyre}</div>
                </VilkårpanelInnhold>
            )}
        </VilkårpanelBase>
    );
};
