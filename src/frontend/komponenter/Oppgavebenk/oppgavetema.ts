export type Oppgavetype =
    | 'BEH_SAK'
    | 'JFR'
    | 'GOD_VED'
    | 'BEH_UND_VED'
    | 'FDR'
    | 'RETUR'
    | 'BEH_SED'
    | 'FDR_SED'
    | 'FREM'
    | 'GEN'
    | 'INNH_DOK'
    | 'JFR_UT'
    | 'KONT_BRUK'
    | 'KON_UTG_SCA_DOK'
    | 'SVAR_IK_MOT'
    | 'VUR'
    | 'VURD_HENV'
    | 'VUR_KONS_YTE'
    | 'VUR_SVAR';

export const oppgaveTypeTilTekst: Record<Oppgavetype, string> = {
    BEH_SAK: 'Behandle sak',
    BEH_SED: 'Behandle SED',
    BEH_UND_VED: 'Behandle underkjent vedtak',
    FDR: 'Fordeling',
    FDR_SED: 'Fordeling SED',
    FREM: 'Fremlegg',
    GEN: 'Generell',
    GOD_VED: 'Godkjenne vedtak',
    INNH_DOK: 'Innhent dokumentasjon',
    JFR: 'Journalføring',
    JFR_UT: 'Journalføring utgående',
    KONT_BRUK: 'Kontakt bruker',
    KON_UTG_SCA_DOK: 'Kontroller utgående skannet dokument',
    RETUR: 'Behandle returpost',
    SVAR_IK_MOT: 'Svar ikke mottatt',
    VUR: 'Vurder dokument',
    VURD_HENV: 'Vurder henvendelse',
    VUR_KONS_YTE: 'Vurder konsekvens for ytelse',
    VUR_SVAR: 'Vurder svar',
};

export type Prioritet = 'HOY' | 'NORM' | 'LAV';

export type PrioritetNokkelPar = {
    [s in Prioritet]: string;
};

export const prioritetTilTekst: PrioritetNokkelPar = {
    HOY: 'Høy',
    NORM: 'Normal',
    LAV: 'Lav',
};
