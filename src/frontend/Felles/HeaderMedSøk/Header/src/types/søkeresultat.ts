import { Adressebeskyttelsegradering } from '@navikt/familie-typer';

export interface ISøkeresultat {
    adressebeskyttelseGradering?: Adressebeskyttelsegradering;
    fagsakId?: number | string; // null betyr at det ikke finnes fagsak på personen
    harTilgang: boolean;
    ident: string;
    ikon: React.ReactNode;
    rolle?: string;
    navn?: string;
}
