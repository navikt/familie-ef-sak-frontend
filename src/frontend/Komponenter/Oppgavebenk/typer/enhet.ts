export enum IkkeFortroligEnhet {
    NAY = '4489',
    EGNE_ANSATTE = '4483',
}

export enum FortroligEnhet {
    VIKAFOSSEN = '2103',
}

const enhetTilTekstIkkeFortrolig: Record<IkkeFortroligEnhet.NAY, string> = {
    '4489': '4489 NAY',
};

const enhetTilTekstEgenAnsatte: Record<IkkeFortroligEnhet.EGNE_ANSATTE, string> = {
    '4483': '4483 Egne ansatte',
};

const enhetTilTekstFortrolig: Record<FortroligEnhet, string> = {
    '2103': '2103 NAV Vikafossen',
};

export const enhetTilTekstPåString: Record<string, string> = {
    ...enhetTilTekstIkkeFortrolig,
    ...enhetTilTekstFortrolig,
    ...enhetTilTekstEgenAnsatte,
};

export const enhetTilTekst = (
    harSaksbehandlerStrengtFortroligRolle: boolean,
    harSaksbehandlerEgenAnsattRolle: boolean
): Record<string, string> => {
    if (harSaksbehandlerStrengtFortroligRolle) {
        return enhetTilTekstFortrolig;
    } else if (harSaksbehandlerEgenAnsattRolle) {
        return { ...enhetTilTekstIkkeFortrolig, ...enhetTilTekstEgenAnsatte };
    } else {
        return enhetTilTekstIkkeFortrolig;
    }
};

export const utledEnhet = (
    harSaksbehandlerStrengtFortroligRolle: boolean,
    harSaksbehandlerEgenAnsattRolle: boolean
): FortroligEnhet | IkkeFortroligEnhet => {
    if (harSaksbehandlerStrengtFortroligRolle) {
        return FortroligEnhet.VIKAFOSSEN;
    } else if (harSaksbehandlerEgenAnsattRolle) {
        return IkkeFortroligEnhet.EGNE_ANSATTE;
    } else {
        return IkkeFortroligEnhet.NAY;
    }
};
