import { OrNothing } from '../hooks/felles/useSorteringState';
import { isAfter, isBefore } from 'date-fns';
import { IOppgaveRequest } from '../Oppgavebenk/typer/oppgaverequest';

export const datoFeil = (valgtDatoFra?: string, valgtDatoTil?: string): OrNothing<string> => {
    if (!valgtDatoFra || !valgtDatoTil) {
        return null;
    }
    if (isBefore(new Date(valgtDatoTil), new Date(valgtDatoFra))) {
        return 'Til dato må vare etter til fra dato';
    }
    return null;
};

export const datoErEtterDagensDato = (dato: string): boolean => {
    return isAfter(new Date(dato), new Date());
};

export const oppdaterFilter = (
    object: IOppgaveRequest,
    key: keyof IOppgaveRequest,
    val?: string | number
): IOppgaveRequest => {
    if (!val || val === '') {
        const { [key]: dummy, ...remainder } = object;
        return remainder;
    }
    return {
        ...object,
        [key]: val,
    };
};

export const base64toBlob = (b64Data: string, contentType = '', sliceSize = 512): Blob => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
};

export const toTitleCase = (str: string): string =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

const replaceUnderscoreWithSpace = (str: string): string => str.split('_').join(' ');

export const formatterEnumVerdi = (str: string): string =>
    replaceUnderscoreWithSpace(toTitleCase(str));

export const slåSammenTekst = (...tekstElementer: (string | undefined)[]): string =>
    tekstElementer
        .filter((tekst) => tekst !== undefined && tekst !== null && tekst !== '')
        .join(', ');

export const harVerdi = (str: string | undefined | null): boolean =>
    str !== undefined && str !== '' && str !== null;

export const harTallverdi = (verdi: number | undefined | null): boolean =>
    verdi !== undefined && verdi !== null;

export const tilTallverdi = (verdi: number | string | undefined): number | string | undefined => {
    if (verdi === '' || verdi === undefined || verdi === null) {
        return verdi;
    }
    return Number(verdi);
};

export const range = (start: number, end: number): number[] =>
    Array.from({ length: end - start }, (_, k) => k + start);
