import { SivilstandType } from '../../../../typer/personopplysninger';

export const hentSivilstatus = (sivilstand: SivilstandType): string => {
    switch (sivilstand) {
        case SivilstandType.UOPPGITT:
            return 'Ikke oppgitt';
        case SivilstandType.UGIFT:
            return 'Ugift';
        case SivilstandType.GIFT:
            return 'Gift';
        case SivilstandType.ENKE_ELLER_ENKEMANN:
            return 'Enke/Enkemann';
        case SivilstandType.SKILT:
            return 'Skilt';
        case SivilstandType.SKILT_PARTNER:
            return 'Skilt partner';
        case SivilstandType.SEPARERT:
            return 'Separert';
        case SivilstandType.SEPARERT_PARTNER:
            return 'Separert partner';
        case SivilstandType.REGISTRERT_PARTNER:
            return 'Registrert partner';
        case SivilstandType.GJENLEVENDE_PARTNER:
            return 'Gjenlevende partner';
    }
};
