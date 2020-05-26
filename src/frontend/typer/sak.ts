// Interface
import { ITekstFelt, SøknadsFelt } from './søknadsfelter';

export interface ISak {
    id: number;
    saksnummer: string;
    søknad: ISøknad;
}

export interface ISøknad {
    personalia: SøknadsFelt<IPersonalia>;
}

export interface IPersonalia {
    fødselsnummer: ITekstFelt;
    navn: ITekstFelt;
}
