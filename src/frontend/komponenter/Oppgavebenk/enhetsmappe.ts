type Enhetsmappe =
    | 100000035
    | 100000036
    | 100000037
    | 100000038
    | 100000039
    | 100024196
    | 100000266
    | 100024195
    | 100025358
    | 100025133;

export type EnhetsmappeTekstNokkelPar = {
    [s in Enhetsmappe]: string;
};

export const behandlingstemaTilTekst: EnhetsmappeTekstNokkelPar = {
    '100000035': '',
    '100000036': '',
    '100000037': '',
    '100000038': '',
    '100000039': '',
    '100000266': '',
    '100024195': '',
    '100024196': '',
    '100025133': '',
    '100025358': '',
};
