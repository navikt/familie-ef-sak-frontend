export const erProd = (): boolean => window.location.host === 'ensligmorellerfar.intern.nav.no';

export const tilbakekrevingBaseUrl = (): string =>
    erProd()
        ? 'https://familietilbakekreving.intern.nav.no'
        : 'https://familie-tilbake-frontend.dev.intern.nav.no';

export const endringsloggUrl = (): string =>
    erProd()
        ? 'https://familie-endringslogg.intern.nav.no'
        : 'https://familie-endringslogg.dev.intern.nav.no';
