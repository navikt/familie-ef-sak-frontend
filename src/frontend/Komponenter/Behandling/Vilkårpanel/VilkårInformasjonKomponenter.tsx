import * as React from 'react';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Calculator } from '@navikt/ds-icons';

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
