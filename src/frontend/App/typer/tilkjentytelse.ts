export interface TilkjentYtelse {
    andeler: AndelTilkjentYtelse[];
}

export interface AndelTilkjentYtelse {
    stønadFra: string;
    stønadTil: string;
    inntekt: number;
    beløp: number;
}
