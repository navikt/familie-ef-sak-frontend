import { Hendelse } from './Historikk';
import { Behandlingshistorikk } from './typer';

export const behandlingHarBlittGodkjent = (historikk: Behandlingshistorikk[]): boolean => {
    return hendelseEksistererForBehandlingshistorikk(historikk, Hendelse.VEDTAK_GODKJENT);
};

const hendelseEksistererForBehandlingshistorikk = (
    historikk: Behandlingshistorikk[],
    hendelse: Hendelse
): boolean => {
    return historikk.some((historikkInnslag) => historikkInnslag.hendelse === hendelse);
};
