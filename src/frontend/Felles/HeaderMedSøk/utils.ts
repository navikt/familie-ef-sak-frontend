import { Adressebeskyttelsegradering } from '@navikt/familie-typer/dist/person';
import { AxiosRequestCallback } from '../../App/typer/axiosRequest';
import { AppEnv } from '../../App/api/env';
import { PopoverItem } from '@navikt/familie-header/dist/header/Header';
import { LenkeType } from '@navikt/familie-header';
import { lagAInntektLink, lagGosysLink, lagModiaLink } from '../Lenker/Lenker';

export const adressebeskyttelsestyper: Record<Adressebeskyttelsegradering, string> = {
    STRENGT_FORTROLIG: 'strengt fortrolig',
    STRENGT_FORTROLIG_UTLAND: 'strengt fortrolig utland',
    FORTROLIG: 'fortrolig',
    UGRADERT: 'ugradert',
};

export const lagAInntektLenke = (
    axiosRequest: AxiosRequestCallback,
    appEnv: AppEnv,
    fagsakId: string | undefined,
    fagsakPersonId: string | undefined
): PopoverItem => {
    if (!fagsakPersonId && !fagsakId) {
        return {
            name: 'A-inntekt',
            href: appEnv.aInntekt,
            type: LenkeType.EKSTERN,
            isExternal: true,
        };
    }

    return {
        name: 'A-inntekt',
        type: LenkeType.EKSTERN,
        onSelect: async () => {
            window.open(await lagAInntektLink(axiosRequest, appEnv, fagsakId, fagsakPersonId));
        },
    };
};

export const lagGosysLenke = (appEnv: AppEnv, personIdent: string | undefined): PopoverItem => {
    if (!personIdent) {
        return {
            name: 'Gosys',
            href: appEnv.gosys,
            type: LenkeType.EKSTERN,
            isExternal: true,
        };
    }

    return {
        name: 'Gosys',
        type: LenkeType.EKSTERN,
        onSelect: async () => {
            window.open(lagGosysLink(appEnv, personIdent));
        },
    };
};

export const lagModiaLenke = (appEnv: AppEnv, personIdent: string | undefined): PopoverItem => {
    if (!personIdent) {
        return {
            name: 'Modia',
            href: appEnv.modia,
            type: LenkeType.EKSTERN,
            isExternal: true,
        };
    }

    return {
        name: 'Modia',
        type: LenkeType.EKSTERN,
        onSelect: async () => {
            window.open(lagModiaLink(appEnv, personIdent));
        },
    };
};

export const lagHistoriskPensjonLenke = (appEnv: AppEnv): PopoverItem => {
    return {
        name: 'Vedtak før des. 2008 (Historisk pensjon)',
        href: appEnv.historiskPensjon,
        type: LenkeType.EKSTERN,
        isExternal: true,
    };
};

export const lagDrekLenke = (appEnv: AppEnv): PopoverItem => {
    return {
        name: 'Rekvirere D-nummer',
        href: appEnv.drek,
        type: LenkeType.EKSTERN,
        isExternal: true,
    };
};

export const lagUttrekkArbeidssøkerLenke = (): PopoverItem => {
    return {
        name: 'Uttrekk arbeidssøkere (P43)',
        href: '/uttrekk/arbeidssoker',
        type: LenkeType.INTERN,
    };
};

export const lagOpprettBehandlingManueltLenke = (): PopoverItem => {
    return {
        name: 'Opprett førstegangsbehandling manuelt',
        href: '/opprett-forstegangsbehandling',
        type: LenkeType.INTERN,
    };
};

export const lagBehandlingFraJournalpostLenke = (): PopoverItem => {
    return {
        name: '[Admin] Lag behandling fra journalpost',
        href: '/admin/ny-behandling-for-ferdigstilt-journalpost',
        type: LenkeType.INTERN,
    };
};

export const lagÅpneEldreBehandlingerLenke = (): PopoverItem => {
    return {
        name: '[Admin] Åpne behandlinger over 1 mnd gamle',
        href: '/admin/gamle-behandlinger',
        type: LenkeType.INTERN,
    };
};

export const lagSamværskalkulatorLenke = (): PopoverItem => {
    return {
        name: 'Samværskalkulator',
        href: '/verktoy/samvaerskalkulator',
        type: LenkeType.ARBEIDSVERKTØY,
    };
};

export const lagEksterneLenker = (
    axiosRequest: AxiosRequestCallback,
    appEnv: AppEnv,
    fagsakId: string | undefined,
    fagsakPersonId: string | undefined,
    personIdent: string | undefined
) => [
    lagAInntektLenke(axiosRequest, appEnv, fagsakId, fagsakPersonId),
    lagGosysLenke(appEnv, personIdent),
    lagModiaLenke(appEnv, personIdent),
    lagHistoriskPensjonLenke(appEnv),
    lagDrekLenke(appEnv),
];

export const lagInterneLenker = (
    kanOppretteBehandlingForFerdigstiltJournalpost: boolean
): PopoverItem[] =>
    [
        lagUttrekkArbeidssøkerLenke(),
        lagOpprettBehandlingManueltLenke(),
        kanOppretteBehandlingForFerdigstiltJournalpost ? lagBehandlingFraJournalpostLenke() : null,
        lagÅpneEldreBehandlingerLenke(),
    ].filter((lenke) => lenke !== null);

export const lagArbeidsverktøyLenker = (): PopoverItem[] => [lagSamværskalkulatorLenke()];
