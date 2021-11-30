export interface IMappe {
    id: number;
    navn: string;
    enhetsnr: string;
}

export const tomMappeListe = [{ id: 0, navn: '', enhetsnr: '' }] as IMappe[];
