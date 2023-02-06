import * as React from 'react';
import { Heading, Label } from '@navikt/ds-react';
import { FC, ReactNode } from 'react';
import { FlexColumnContainer, UnderoverskriftWrapper } from './StyledVilkårInnhold';
import EtikettDød from '../../../Felles/Etiketter/EtikettDød';
import LiteBarn from '../../../Felles/Ikoner/LiteBarn';
import styled from 'styled-components';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Calculator } from '@navikt/ds-icons';

interface UnderseksjonWrapperProps {
    underoverskrift: string;
    children: ReactNode;
}

export const UnderseksjonWrapper: FC<UnderseksjonWrapperProps> = ({
    underoverskrift,
    children,
}) => {
    return (
        <FlexColumnContainer gap={1.5}>
            <Label className="tittel" as="h3" size="small">
                {underoverskrift}
            </Label>
            {children}
        </FlexColumnContainer>
    );
};

interface BarneInfoWrapperProps {
    navnOgAlderPåBarn?: string;
    dødsdato?: string;
    children: ReactNode;
}

const HeadingMedUnderlinje = styled(Heading)`
    text-decoration: underline;
`;

export const BarneInfoWrapper: FC<BarneInfoWrapperProps> = ({
    navnOgAlderPåBarn,
    dødsdato,
    children,
}) => {
    return (
        <FlexColumnContainer gap={1.5}>
            <UnderoverskriftWrapper>
                <LiteBarn />
                <HeadingMedUnderlinje size={'small'}>
                    {navnOgAlderPåBarn}
                    {dødsdato && <EtikettDød dødsdato={dødsdato} />}
                </HeadingMedUnderlinje>
            </UnderoverskriftWrapper>
            {children}
        </FlexColumnContainer>
    );
};

export enum VilkårInfoIkon {
    REGISTER = 'REGISTER',
    SØKNAD = 'SØKNAD',
    KALKULATOR = 'KALKULATOR',
}

export const mapIkon = (ikon: VilkårInfoIkon) => {
    switch (ikon) {
        case VilkårInfoIkon.REGISTER:
            return <Registergrunnlag />;
        case VilkårInfoIkon.SØKNAD:
            return <Søknadsgrunnlag />;
        case VilkårInfoIkon.KALKULATOR:
            return <Calculator />;
    }
};
