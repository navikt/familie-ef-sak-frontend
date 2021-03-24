import NæreBoforholdHjelpetekst from '../Inngangsvilkår/Aleneomsorg/NæreBoforholdHjelpetekst';
import React from 'react';
import { PopoverOrientering } from 'nav-frontend-popover';
import { RimeligGrunnHjelpetekst } from '../Aktivitet/SagtOppEllerRedusert/RimeligGrunnHjelpetekst';

export const hjelpeTekstConfig: Record<
    string,
    { komponent: React.FC; plassering: PopoverOrientering }
> = {
    NÆRE_BOFORHOLD: {
        komponent: NæreBoforholdHjelpetekst,
        plassering: PopoverOrientering.Under,
    },
    SAGT_OPP_ELLER_REDUSERT: {
        komponent: RimeligGrunnHjelpetekst,
        plassering: PopoverOrientering.OverHoyre,
    },
};
