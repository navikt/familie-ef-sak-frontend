import { Adressebeskyttelsegradering } from '@navikt/familie-typer/dist/person';

export const adressebeskyttelsestyper: Record<Adressebeskyttelsegradering, string> = {
    STRENGT_FORTROLIG: 'strengt fortrolig',
    STRENGT_FORTROLIG_UTLAND: 'strengt fortrolig utland',
    FORTROLIG: 'fortrolig',
    UGRADERT: 'ugradert',
};
