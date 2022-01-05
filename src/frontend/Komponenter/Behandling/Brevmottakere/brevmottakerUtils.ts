import { IFullmakt, IVergemål } from '../../../App/typer/personopplysninger';
import { EBrevmottakerRolle, IBrevmottaker } from './typer';

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
