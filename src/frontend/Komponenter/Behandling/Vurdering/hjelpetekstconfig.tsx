import NæreBoforholdHjelpetekst from '../Inngangsvilkår/Aleneomsorg/NæreBoforholdHjelpetekst';
import React from 'react';
import { RimeligGrunnHjelpetekst } from '../Aktivitet/SagtOppEllerRedusert/RimeligGrunnHjelpetekst';
import { HelpTextProps } from '@navikt/ds-react';

export const hjelpeTekstConfig: Record<
    string,
    { komponent: React.FC; plassering: HelpTextProps['placement'] }
> = {
    NÆRE_BOFORHOLD: {
        komponent: NæreBoforholdHjelpetekst,
        plassering: 'bottom',
    },
    SAGT_OPP_ELLER_REDUSERT: {
        komponent: RimeligGrunnHjelpetekst,
        plassering: 'top-end',
    },
};
