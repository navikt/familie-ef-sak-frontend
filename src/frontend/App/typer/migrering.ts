import { IBeløpsperiode } from './vedtak';

export interface MigreringInfoResponse {
    kanMigreres: boolean;
    årsak?: string;
    stønadFom?: string;
    stønadTom?: string;
    inntektsgrunnlag?: number;
    samordningsfradrag?: number;
    beløpsperioder?: IBeløpsperiode[];
}
