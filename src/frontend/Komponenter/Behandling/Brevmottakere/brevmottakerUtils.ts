import { IFullmakt, IPersonopplysninger, IVergemål } from '../../../App/typer/personopplysninger';
import { EBrevmottakerRolle, IBrevmottaker, IBrevmottakere } from './typer';

export const vergemålTilBrevmottaker = (vergemål: IVergemål): IBrevmottaker => ({
    navn: vergemål.navn || '',
    personIdent: vergemål.motpartsPersonident || '',
    mottakerRolle: EBrevmottakerRolle.VERGE,
});

export const fullmaktTilBrevMottaker = (fullmakt: IFullmakt): IBrevmottaker => ({
    navn: fullmakt.navn || '',
    personIdent: fullmakt.motpartsPersonident,
    mottakerRolle: EBrevmottakerRolle.FULLMAKT,
});

export const mottakereEllerBruker = (
    personopplysninger: IPersonopplysninger,
    mottakere?: IBrevmottakere
) => {
    return mottakere && brevmottakereValgt(mottakere)
        ? mottakere
        : brevmottakereMedBruker(personopplysninger);
};

export const brevmottakereValgt = (mottakere?: IBrevmottakere): boolean => {
    return mottakere ? mottakere.personer.length > 0 || mottakere.organisasjoner.length > 0 : false;
};

export const brevmottakereMedBruker = (personopplysninger: IPersonopplysninger) => {
    return {
        personer: [
            {
                mottakerRolle: EBrevmottakerRolle.BRUKER,
                personIdent: personopplysninger.personIdent,
                navn: personopplysninger.navn.visningsnavn,
            },
        ],
        organisasjoner: [],
    };
};
