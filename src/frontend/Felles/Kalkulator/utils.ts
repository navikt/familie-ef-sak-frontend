import { Samværsavtale, Samværsdag, Samværsuke } from '../../App/typer/samværsavtale';

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
