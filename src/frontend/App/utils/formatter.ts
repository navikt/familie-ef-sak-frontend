import { format, parseISO, lastDayOfMonth } from 'date-fns';
import { harTallverdi } from './utils';

export const datoFormat = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
} as const;

export const datoMånedÅrFormat = { month: 'short', year: 'numeric' } as const;

export const datoMånedÅrFormatFull = { month: 'long', year: 'numeric' } as const;

export const månedFormat = { month: 'short' } as const;

const måneder = [
    'januar',
    'februar',
    'mars',
    'april',
    'mai',
    'juni',
    'juli',
    'august',
    'september',
    'oktober',
    'november',
    'desember',
];

export const formaterNullableIsoDato = (dato?: string): string | undefined =>
    dato && formaterIsoDato(dato);

export const formaterIsoDato = (dato: string): string => {
    return parseISO(dato).toLocaleDateString('no-NO', datoFormat);
};

export const dagensDatoFormatert = (): string => {
    return new Date().toLocaleDateString('no-NO', datoFormat);
};

export const formaterIsoDatoTid = (dato: string): string => {
    return format(parseISO(dato), "dd.MM.yyyy 'kl'.HH:mm");
};

export const formaterIsoDatoTidKort = (dato: string): string => {
    return format(parseISO(dato), 'dd.MM.yyyy HH:mm');
};

export const formaterIsoDatoTidMedSekunder = (dato: string): string => {
    return format(parseISO(dato), "dd.MM.yyyy 'kl'.HH:mm:ss");
};

export const formaterNullableIsoDatoTid = (dato?: string): string | undefined => {
    return dato && formaterIsoDatoTid(dato);
};
export const formaterNullableMånedÅr = (dato?: string): string | undefined =>
    dato && format(parseISO(dato), 'MM.yyyy');

export const formaterIsoMånedÅr = (dato: string): string => {
    return parseISO(dato).toLocaleDateString('no-NO', datoMånedÅrFormat);
};

export const formaterIsoMånedÅrFull = (dato: string): string => {
    return parseISO(dato).toLocaleDateString('no-NO', datoMånedÅrFormatFull);
};

export const formaterIsoSisteDagIMåneden = (årMåned: string): string => {
    return lastDayOfMonth(parseISO(årMåned)).toLocaleDateString('no-NO', datoFormat);
};

export const formaterIsoMåned = (dato: string): string => {
    return parseISO(dato).toLocaleDateString('no-NO', månedFormat);
};

export const formaterNullableIsoÅr = (dato?: string): number | undefined => {
    return dato ? formaterIsoÅr(dato) : undefined;
};

export const formaterIsoÅr = (dato: string): number => {
    return parseISO(dato).getFullYear();
};

export const formaterFødselsnummer = (fødselsnummer: string): string =>
    fødselsnummer.substring(0, 6) + ' ' + fødselsnummer.substring(6);

export const formaterNullableFødsesnummer = (fødselsnummer?: string): string | undefined =>
    fødselsnummer && formaterFødselsnummer(fødselsnummer);

export const formaterTallMedTusenSkille = (verdi?: number): string =>
    harTallverdi(verdi) ? Number(verdi).toLocaleString('no-NO', { currency: 'NOK' }) : '';

export const formaterTallMedTusenSkilleEllerStrek = (verdi?: number): string =>
    harTallverdi(verdi) && verdi !== 0
        ? Number(verdi).toLocaleString('no-NO', { currency: 'NOK' })
        : '-';

export const formaterStrengMedStorForbokstav = (verdi: string): string =>
    verdi[0].toUpperCase() + verdi.slice(1).toLowerCase();

export const nullableBooleanTilTekst = (bool?: boolean): string => {
    if (bool === true) return 'Ja';
    else if (bool === false) return 'Nei';
    else return '';
};

export const utledUtgiftsbeløp = (utgift?: number) => {
    return utgift ? `${formaterTallMedTusenSkilleEllerStrek(utgift)} ,-` : '-';
};

export const mapTrueFalse = (bool?: boolean): string =>
    bool === true ? 'Ja' : bool === false ? 'Nei' : '';

export const formatterBooleanEllerUkjent = (bool?: boolean) =>
    bool === undefined || bool === null ? 'Ukjent' : mapTrueFalse(bool);

export const nåværendeÅrOgMånedFormatert = (årMåned?: string): string => {
    return årMåned ? genererÅrOgMånedFraStreng(årMåned) : genererNåværendeÅrOgMåned();
};

const genererNåværendeÅrOgMåned = (): string => {
    const [nesteMånedIndex, nesteMånedsÅr] = nesteMånedOgNesteMånedsÅr();
    const nesteMåned = måneder[nesteMånedIndex - 1];
    return `${nesteMåned} ${nesteMånedsÅr}`;
};

export const genererÅrOgMånedFraStreng = (årMåned: string) => {
    const [år, månedIndex] = årMåned.split('-');
    const måned = måneder[parseInt(månedIndex) - 1];
    return `${måned.toString()} ${år}`;
};

export const nesteMånedOgNesteMånedsÅrFormatert = (): string => {
    const [nesteMåned, nesteMånedsÅr] = nesteMånedOgNesteMånedsÅr();

    return nesteMåned.toString().length === 1
        ? `${nesteMånedsÅr.toString()}-0${nesteMåned.toString()}`
        : `${nesteMånedsÅr.toString()}-${nesteMåned.toString()}`;
};

const nesteMånedOgNesteMånedsÅr = () => {
    const dagensDato = new Date();
    const nåværendeMånedErSisteMåned = dagensDato.getMonth() === 11; // Måned er nullindeksert (JAN = 0, DES = 11)
    const nesteMåned = nåværendeMånedErSisteMåned ? 1 : dagensDato.getMonth() + 2;
    const nesteMånedsÅr = nåværendeMånedErSisteMåned
        ? dagensDato.getFullYear() + 1
        : dagensDato.getFullYear();

    return [nesteMåned, nesteMånedsÅr];
};

export const antallDagerIgjenAvNåværendeMåned = (): number => {
    const dagensDato = new Date();
    const antallDagerINåværendeMåned = new Date(
        dagensDato.getFullYear(),
        dagensDato.getMonth() + 1,
        0
    ).getDate();

    return antallDagerINåværendeMåned - dagensDato.getDate();
};

const formaterDateTilÅrMåned = (dato: Date) => {
    const måned = dato.getMonth() + 1;
    const formatertMåned = måned < 10 ? '0' + måned : måned;
    return `${dato.getFullYear()}-${formatertMåned}`;
};

export const datoÅrMånedFrem = (antallMåneder: number = 0) => {
    const dato = new Date();
    dato.setMonth(dato.getMonth() + antallMåneder);
    return formaterDateTilÅrMåned(dato);
};

export const formaterFraIsoDatoTilStreng = (fra: string, til: string) => {
    return `${formaterNullableIsoDato(fra)} - ${formaterNullableIsoDato(til)}`;
};
