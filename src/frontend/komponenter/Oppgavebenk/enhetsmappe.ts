import { Dictionary } from '../../typer/utils';

export type Enhetsmappe =
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

export const enhetsmappeTilTekst: Dictionary<string> = {
    100000035: '10 Søknader - Klar til behandling',
    100000036: '20 Avventer dokumentasjon',
    100000037: '30 Klager - Klar til behandling',
    100000038: '40 Revurdering - Klar til behandling',
    100000039: '41 Revurdering',
    100024196: '42 Oppfølging av skolesaker',
    100000266: '50 Tilbakekreving - Klar til behandling',
    100024195: '70 Flyttesaker',
    100025358: '81 EØS medlemskap',
    100025133: '90 Corona',
};
