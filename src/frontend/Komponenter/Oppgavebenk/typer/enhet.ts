export type IkkeFortroligEnhet = '4489' | '4483';
export type FortroligEnhet = '2103';
export type Enhet = IkkeFortroligEnhet | FortroligEnhet;

export const enhetTilTekstIkkeFortrolig: Record<IkkeFortroligEnhet, string> = {
    '4489': '4489 NAY',
    '4483': '4483 Egne ansatte',
};

export const enhetTilTekstFortrolig: Record<FortroligEnhet, string> = {
    '2103': '2103 NAV Vikafossen',
};

export const enhetTilTekstPåString: Record<string, string> = {
    '4489': '4489 NAY',
    '4483': '4483 Egne ansatte',
    '2103': '2103 NAV Vikafossen',
};

export const enhetTilTekst = (
    harSaksbehandlerStrengtFortroligRolle: boolean
): Record<string, string> => {
    return harSaksbehandlerStrengtFortroligRolle
        ? enhetTilTekstFortrolig
        : enhetTilTekstIkkeFortrolig;
};
