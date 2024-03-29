import * as React from 'react';
import { Heading, Label } from '@navikt/ds-react';
import { FC, ReactNode } from 'react';
import { FlexColumnContainer, UnderoverskriftWrapper } from './StyledVilkårInnhold';
import EtikettDød from '../../../Felles/Etiketter/EtikettDød';
import LiteBarn from '../../../Felles/Ikoner/LiteBarn';
import styled from 'styled-components';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { CalculatorIcon, SackKronerIcon } from '@navikt/aksel-icons';

interface UnderseksjonWrapperProps {
    underoverskrift: string;
    children: ReactNode;
}

export const UnderseksjonWrapper: FC<UnderseksjonWrapperProps> = ({
    underoverskrift,
    children,
}) => {
    return (
        <FlexColumnContainer>
            <Label className="tittel" as="h3" size="small">
                {underoverskrift}
            </Label>
            {children}
        </FlexColumnContainer>
    );
};

interface InfoSeksjonWrapperProps {
    ikon: ReactNode;
    undertittel?: ReactNode;
    children: ReactNode;
}

const HeadingMedUnderlinje = styled(Heading)`
    text-decoration: underline;
`;

export const InfoSeksjonWrapper: FC<InfoSeksjonWrapperProps> = ({
    ikon,
    undertittel,
    children,
}) => {
    return (
        <FlexColumnContainer $gap={1}>
            <UnderoverskriftWrapper>
                {ikon}
                <HeadingMedUnderlinje size="xsmall">{undertittel}</HeadingMedUnderlinje>
            </UnderoverskriftWrapper>
            {children}
        </FlexColumnContainer>
    );
};

interface BarneInfoWrapperProps {
    navnOgAlderPåBarn?: string;
    dødsdato?: string;
    children: ReactNode;
}

export const BarneInfoWrapper: FC<BarneInfoWrapperProps> = ({
    navnOgAlderPåBarn,
    dødsdato,
    children,
}) => {
    return (
        <InfoSeksjonWrapper
            ikon={<LiteBarn />}
            undertittel={
                <>
                    {navnOgAlderPåBarn}
                    {dødsdato && <EtikettDød dødsdato={dødsdato} />}
                </>
            }
        >
            {children}
        </InfoSeksjonWrapper>
    );
};

export enum VilkårInfoIkon {
    REGISTER = 'REGISTER',
    SØKNAD = 'SØKNAD',
    KALKULATOR = 'KALKULATOR',
    PENGESEKK = 'PENGESEKK',
}

export const mapIkon = (ikon: VilkårInfoIkon) => {
    switch (ikon) {
        case VilkårInfoIkon.REGISTER:
            return <Registergrunnlag />;
        case VilkårInfoIkon.SØKNAD:
            return <Søknadsgrunnlag />;
        case VilkårInfoIkon.KALKULATOR:
            return <CalculatorIcon />;
        case VilkårInfoIkon.PENGESEKK:
            return <SackKronerIcon />;
    }
};
