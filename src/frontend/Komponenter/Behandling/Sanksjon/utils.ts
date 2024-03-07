import { SanksjonereVedtakForm } from './Sanksjonsfastsettelse';
import { FormErrors } from '../../../App/hooks/felles/useFormState';

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

export const SANKSJONERE_VEDTAK = 'sanksjonere-vedtak';

export const nesteMånedOgNesteMånedsÅrFormatert = (): string => {
    const [nesteMåned, nesteMånedsÅr] = nesteMånedOgNesteMånedsÅr();

    return nesteMåned.toString().length === 1
        ? `${nesteMånedsÅr.toString()}-0${nesteMåned.toString()}`
        : `${nesteMånedsÅr.toString()}-${nesteMåned.toString()}`;
};

export const nåværendeÅrOgMånedFormatert = (årMåned?: string): string => {
    return årMåned ? genererÅrOgMånedFraStreng(årMåned) : genererNåværendeÅrOgMåned();
};

const genererNåværendeÅrOgMåned = (): string => {
    const [nesteMånedIndex, nesteMånedsÅr] = nesteMånedOgNesteMånedsÅr();
    const nesteMåned = måneder[nesteMånedIndex - 1];
    return `${nesteMåned} ${nesteMånedsÅr}`;
};

const genererÅrOgMånedFraStreng = (årMåned: string) => {
    const [år, månedIndex] = årMåned.split('-');
    const måned = måneder[parseInt(månedIndex) - 1];
    return `${måned.toString()} ${år}`;
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

export const validerSanksjonereVedtakForm = ({
    sanksjonsårsak,
    internBegrunnelse,
}: SanksjonereVedtakForm): FormErrors<SanksjonereVedtakForm> => {
    const sanksjonsårsakFeil =
        sanksjonsårsak === undefined ? 'Mangelfull utfylling av sanksjonsårsak' : undefined;

    const internBegrunnelseFeil =
        internBegrunnelse === '' || internBegrunnelse === undefined
            ? 'Mangelfull utfylling av intern begrunnelse'
            : undefined;
    return {
        sanksjonsårsak: sanksjonsårsakFeil,
        internBegrunnelse: internBegrunnelseFeil,
    };
};
