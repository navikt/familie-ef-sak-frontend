export enum EÅrsakBarnepass {
    trengerMerPassEnnJevnaldrede = 'trengerMerPassEnnJevnaldrede',
    myeBortePgaJobb = 'myeBortePgaJobb',
    utenomVanligArbeidstid = 'utenomVanligArbeidstid',
}

export const ÅrsakBarnepassTilTekst: Record<EÅrsakBarnepass, string> = {
    trengerMerPassEnnJevnaldrede:
        'Barnet har behov for vesentlig mer plass enn det som er vanlig for jevnaldrende',
    myeBortePgaJobb: 'Jeg må være borte fra hjemmet i lengre perioder på grunn av jobb',
    utenomVanligArbeidstid:
        'Jeg jobber turnus eller skift, og jobber på tider utenom vanlig arbeidstid',
};
