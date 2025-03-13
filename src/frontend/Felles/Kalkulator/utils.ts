import {
    Samværsandel,
    samværsandelTilVerdi,
    Samværsavtale,
    Samværsdag,
    Samværsuke,
} from '../../App/typer/samværsavtale';

const samværsdag: Samværsdag = {
    andeler: [],
};

const samværsuke: Samværsuke = {
    mandag: samværsdag,
    tirsdag: samværsdag,
    onsdag: samværsdag,
    torsdag: samværsdag,
    fredag: samværsdag,
    lørdag: samværsdag,
    søndag: samværsdag,
};

export const initerSamværsuker = (antallUker: number): Samværsuke[] =>
    new Array(antallUker).fill(samværsuke);

export const initierSamværsavtale = (
    behandlingId: string,
    behandlingBarnId: string
): Samværsavtale => {
    return {
        behandlingId: behandlingId,
        behandlingBarnId: behandlingBarnId,
        uker: initerSamværsuker(2),
    };
};

export const utledInitiellSamværsavtale = (
    lagretAvtale: Samværsavtale | undefined,
    behandlingId: string,
    behandlingBarnId: string
) => {
    if (lagretAvtale === undefined) {
        return initierSamværsavtale(behandlingId, behandlingBarnId);
    }

    return lagretAvtale;
};

export const oppdaterSamværsuke = (
    ukeIndex: number,
    ukedag: string,
    samværsandeler: Samværsandel[],
    settSamværsavtale: (value: React.SetStateAction<Samværsavtale>) => void
) =>
    settSamværsavtale((prevState) => ({
        ...prevState,
        uker: [
            ...prevState.uker.slice(0, ukeIndex),
            { ...prevState.uker[ukeIndex], [ukedag]: { andeler: samværsandeler } },
            ...prevState.uker.slice(ukeIndex + 1),
        ],
    }));

export const oppdaterSamværsuker = (
    samværsuker: Samværsuke[],
    settSamværsavtale: (value: React.SetStateAction<Samværsavtale>) => void
) =>
    settSamværsavtale((prevState) => ({
        ...prevState,
        uker: samværsuker,
    }));

export const oppdaterVarighetPåSamværsavtale = (
    nåværendeVarighet: number,
    nyVarighet: number,
    settSamværsavtale: (value: React.SetStateAction<Samværsavtale>) => void
) => {
    if (nyVarighet > nåværendeVarighet) {
        settSamværsavtale((prevState) => ({
            ...prevState,
            uker: [
                ...prevState.uker.slice(0, nåværendeVarighet),
                ...initerSamværsuker(nyVarighet - nåværendeVarighet),
            ],
        }));
    } else {
        settSamværsavtale((prevState) => ({
            ...prevState,
            uker: prevState.uker.slice(0, nyVarighet),
        }));
    }
};

export const utledVisningstekst = (samværsuker: Samværsuke[]) => {
    const summertSamvær = samværsuker
        .flatMap((samværsuke) =>
            Object.values(samværsuke).flatMap((samværsdag: Samværsdag) => samværsdag.andeler)
        )
        .map((andel) => samværsandelTilVerdi[andel])
        .reduce((acc, andel) => acc + andel, 0);

    const maksimalSamværsandel = samværsuker.length * 7 * 8;

    const antallHeleDagerMedSamvær = Math.floor(summertSamvær / 8);

    const rest = summertSamvær % 8;
    const restSuffix = rest === 0 ? '' : '/8';

    const prosentandel = summertSamvær / maksimalSamværsandel;

    const visningstekstAntallDager = `${antallHeleDagerMedSamvær} dager og ${rest}${restSuffix} deler`;
    const visningstekstProsentandel = `${Math.round(prosentandel * 1000) / 10}%`;
    return `${visningstekstAntallDager} av totalt ${samværsuker.length} uker = ${visningstekstProsentandel}`;
};
