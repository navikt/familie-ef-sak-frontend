export enum Sanksjonsårsak {
    NEKTET_DELTAGELSE_ARBEIDSMARKEDSTILTAK = 'NEKTET_DELTAGELSE_ARBEIDSMARKEDSTILTAK',
    NEKTET_TILBUDT_ARBEID = 'NEKTET_TILBUDT_ARBEID',
    SAGT_OPP_STILLING = 'SAGT_OPP_STILLING',
    UNNLATT_GJENOPPTAGELSE_ARBEIDSFORHOLD = 'UNNLATT_GJENNOPPTAGELSE_ARBEIDSFORHOLD',
    UNNLATT_MØTE_INNKALLING = 'UNNLATT_MØTE_INNKALLING',
}

export const sanksjonsårsakTilTekst: Record<Sanksjonsårsak, string> = {
    NEKTET_DELTAGELSE_ARBEIDSMARKEDSTILTAK: 'Nektet å delta i arbeidsmarkedstiltak',
    NEKTET_TILBUDT_ARBEID: 'Nektet å ta i mot tilbudt arbeid',
    SAGT_OPP_STILLING: 'Sagt opp stilling',
    UNNLATT_GJENNOPPTAGELSE_ARBEIDSFORHOLD:
        'Unnlatt å gjenoppta sitt arbeidsforhold etter endt foreldrepermisjon',
    UNNLATT_MØTE_INNKALLING: 'Unnlatt å møte ved innkalling til arbeids- og velferdsetaten',
};

export const sanksjonsårsaker: Sanksjonsårsak[] = [
    Sanksjonsårsak.NEKTET_DELTAGELSE_ARBEIDSMARKEDSTILTAK,
    Sanksjonsårsak.NEKTET_TILBUDT_ARBEID,
    Sanksjonsårsak.SAGT_OPP_STILLING,
    Sanksjonsårsak.UNNLATT_GJENOPPTAGELSE_ARBEIDSFORHOLD,
    Sanksjonsårsak.UNNLATT_MØTE_INNKALLING,
];

export const dagsgrenseForAdvarsel = 6;

export const sanksjonInfoDel1 =
    'Sanksjonen gjelder for alle brukerens stønader etter kapittel 15, herunder stønader etter tilleggsstønadsforskriften. Følgende stønader i EF Sak vil bli stoppet automatisk i overforstående periode av dette vedtaket:';

export const stønaderForSanksjonInfo = ['Overgangssstønad'];

export const sanksjonInfoDel2 =
    'Har brukeren andre løpende stønader i Infotrygd eller Arena må disse stanses manuelt;';

export const sanksjonAdvarsel = (dagerIgjenAvMåned: number) => {
    const biSetning =
        dagerIgjenAvMåned === 1 ? `${dagerIgjenAvMåned} dag` : `${dagerIgjenAvMåned} dager`;
    return `Obs! Det er kun ${biSetning} igjen av denne måneden. Det er viktig at du følger opp at beslutter godkjenner vedtaket før månedsslutt da perioden for sanksjon vil endre seg om vedtaket blir godkjent i neste måned.`;
};
