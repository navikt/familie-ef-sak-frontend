import { Hendelse } from './Historikk';
import { Behandlingshistorikk } from './typer';

export const behandlingHarBlittUnderkjentDeretterGodkjent = (
    historikk: Behandlingshistorikk[]
): boolean => {
    return behandlingHarBlittUnderkjent(historikk) && behandlingHarBlittGodkjent(historikk);
};

const behandlingHarBlittUnderkjent = (historikk: Behandlingshistorikk[]): boolean => {
    return historikk.some(
        (historikkInnslag) => historikkInnslag.hendelse === Hendelse.VEDTAK_UNDERKJENT
    );
};

const behandlingHarBlittGodkjent = (historikk: Behandlingshistorikk[]): boolean => {
    return historikk.some(
        (historikkInnslag) => historikkInnslag.hendelse === Hendelse.VEDTAK_GODKJENT
    );
};
