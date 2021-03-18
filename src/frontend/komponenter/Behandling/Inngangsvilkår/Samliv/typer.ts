import { EÅrsakEnslig, IPersonDetaljer } from '../Sivilstand/typer';
import { IDokumentasjon } from '../../../../typer/felles';

export interface IBosituasjon {
    delerDuBolig: ESøkerDelerBolig;
    samboer?: IPersonDetaljer;
    sammenflyttingsdato?: string;
    datoFlyttetFraHverandre?: string;
    tidligereSamboerFortsattRegistrertPåAdresse?: IDokumentasjon;
}

export enum ESøkerDelerBolig {
    borAleneMedBarnEllerGravid = 'borAleneMedBarnEllerGravid',
    borMidlertidigFraHverandre = 'borMidlertidigFraHverandre',
    borSammenOgVenterBarn = 'borSammenOgVenterBarn',
    harEkteskapsliknendeForhold = 'harEkteskapsliknendeForhold',
    delerBoligMedAndreVoksne = 'delerBoligMedAndreVoksne',
    tidligereSamboerFortsattRegistrertPåAdresse = 'tidligereSamboerFortsattRegistrertPåAdresse',
}

export const SøkerDelerBoligTilTekst: Record<ESøkerDelerBolig, string> = {
    borAleneMedBarnEllerGravid: 'Jeg bor alene med barn eller jeg er gravid og bor alene',
    borMidlertidigFraHverandre: 'Jeg og den andre forelderen bor midlertidig fra hverandre',
    borSammenOgVenterBarn: 'Jeg bor sammen med en jeg har eller venter barn med',
    harEkteskapsliknendeForhold: 'Jeg har samboer og lever i et ekteskapslignende forhold',
    delerBoligMedAndreVoksne:
        'Jeg deler bolig med andre voksne, for eksempel utleier, venn, søsken eller egne foreldre',
    tidligereSamboerFortsattRegistrertPåAdresse:
        'En tidligere samboer er fortsatt registrert på adressen min',
};

export const ÅrsakEnsligTilTekst: Record<EÅrsakEnslig, string> = {
    samlivsbruddForeldre: 'Samlivsbrudd med den andre forelderen',
    samlivsbruddAndre: 'Samlivsbrudd med noen andre',
    aleneFraFødsel: 'Jeg er alene med barn fra fødsel',
    endringISamværsordning: 'Endring i omsorgen for barn',
    dødsfall: 'Jeg er alene med barn på grunn av dødsfall',
};

export enum ESagtOppEllerRedusert {
    sagtOpp = 'sagtOpp',
    redusertStilling = 'redusertStilling',
    nei = 'nei',
}

export const SagtOppEllerRedusertTilTekst: Record<ESagtOppEllerRedusert, string> = {
    sagtOpp: 'Ja, jeg har sagt opp jobben eller tatt frivillig permisjon (ikke foreldrepermisjon)',
    redusertStilling: 'Ja, jeg har redusert arbeidstiden',
    nei: 'Nei',
};
