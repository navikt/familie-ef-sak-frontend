export const erProd = (): boolean => window.location.host === 'ensligmorellerfar.intern.nav.no';

export const tilbakekrevingBaseUrl = (): string =>
    erProd() ? 'https://tilbakekreving.intern.nav.no' : 'https://tilbakekreving.ansatt.dev.nav.no';

export const klageBaseUrl = (): string =>
    erProd() ? 'https://familie-klage.intern.nav.no' : 'https://familie-klage.ansatt.dev.nav.no';
