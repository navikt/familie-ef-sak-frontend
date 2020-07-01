// Interface
import { IFødselsnummerFelt, ITekstFelt, SøknadsFelt } from './søknadsfelter';
import { IOvergangsstønad } from './overgangsstønad';

export interface ISak {
    id: number;
    saksnummer: string;
    søknad: ISøknad;
    overgangsstonad?: IOvergangsstønad;
}

export interface ISøknad {
    personalia: SøknadsFelt<IPersonalia>;
}

export interface IPersonalia {
    fødselsnummer: SøknadsFelt<IFødselsnummerFelt>;
    navn: ITekstFelt;
}
