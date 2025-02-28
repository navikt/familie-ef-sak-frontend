import { Samværsandel, Samværsavtale, Samværsdag, Samværsuke } from '../../App/typer/samværsavtale';

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
