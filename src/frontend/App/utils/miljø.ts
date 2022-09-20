export const erProd = (): boolean => window.location.host === 'ensligmorellerfar.intern.nav.no';

export const tilbakekrevingBaseUrl = (): string =>
    erProd()
        ? 'https://familietilbakekreving.intern.nav.no'
        : 'https://familie-tilbake-frontend.dev.intern.nav.no';

export const klageBaseUrl = (): string =>
    erProd() ? 'https://familie-klage.intern.nav.no' : 'https://familie-klage.dev.intern.nav.no';
