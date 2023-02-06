import * as React from 'react';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Calculator } from '@navikt/ds-icons';
import { FlexColumnContainer } from './StyledVilkårInnhold';
import { Label } from '@navikt/ds-react';
import { FC, ReactNode } from 'react';

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
