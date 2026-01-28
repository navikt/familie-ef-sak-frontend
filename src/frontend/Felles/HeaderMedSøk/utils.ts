import { Adressebeskyttelsegradering } from '@navikt/familie-typer/dist/person';
import { AxiosRequestCallback } from '../../App/typer/axiosRequest';
import { AppEnv } from '../../App/api/env';
import { lagAInntektLink } from '../Lenker/Lenker';
import { LenkeType, PopoverItem } from './Header/src';

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
    const urlSuffix = personIdent ? `/personoversikt/fnr=${personIdent}` : '';

    return {
        name: 'Gosys',
        onSelect: () => {
            window.open(`${appEnv.gosys}${urlSuffix}`);
        },
        type: LenkeType.EKSTERN,
    };
};

export const lagModiaLenke = (appEnv: AppEnv, personIdent: string | undefined): PopoverItem => {
    const urlSuffix = personIdent ? `/person/${personIdent}` : '';

    return {
        name: 'Modia',
        onSelect: () => {
            window.open(`${appEnv.modia}${urlSuffix}`);
        },
        type: LenkeType.EKSTERN,
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
        type: LenkeType.INTERN,
        onSelect: () => {
            window.open(`/uttrekk/arbeidssoker`);
        },
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

export const lagSamværskalkulatorLenke = (fagsakPersonId: string | undefined): PopoverItem => {
    const urlSuffix = fagsakPersonId ? fagsakPersonId : '';

    return {
        name: 'Samværskalkulator',
        type: LenkeType.ARBEIDSVERKTØY,
        onSelect: () => {
            window.open(`/verktoy/samvaerskalkulator/${urlSuffix}`);
        },
    };
};

export const lagInntektskalkulatorLenke = (): PopoverItem => {
    return {
        name: 'Inntektskalkulator',
        type: LenkeType.ARBEIDSVERKTØY,
        onSelect: () => {
            window.open(`/verktoy/inntektskalkulator`);
        },
    };
};

export const lagBeregningsskjemaLenke = (): PopoverItem => {
    return {
        name: 'Beregningsskjema',
        type: LenkeType.ARBEIDSVERKTØY,
        onSelect: () => {
            window.open(`/verktoy/beregningsskjema`);
        },
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

export const lagArbeidsverktøyLenker = (
    fagsakPersonId: string | undefined,
    skalViseBeregningsskjemaLenke: boolean
): PopoverItem[] => {
    const lenker = [lagSamværskalkulatorLenke(fagsakPersonId), lagInntektskalkulatorLenke()];

    if (skalViseBeregningsskjemaLenke) {
        lenker.push(lagBeregningsskjemaLenke());
    }

    return lenker;
};

export const erNPID = (ident: string) => {
    if (ident.length !== 11) return false;
    const måned = parseInt(ident.substring(2, 4), 10);

    const erSyntestiskNPID = måned > 60 && måned <= 72;
    const erNPID = måned > 20 && måned <= 32;

    return erSyntestiskNPID || erNPID;
};
