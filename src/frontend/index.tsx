import { init } from '@sentry/browser';
import React from 'react';
import ReactDOM from 'react-dom';
import axe from '@axe-core/react';
import App from './App';
import './index.less';
import '@navikt/ds-css';
import { createRoot } from 'react-dom/client';

// eslint-disable-next-line
const packageConfig = require('../../package.json');

if (process.env.NODE_ENV !== 'development') {
    const environment = window.location.hostname;

    init({
        dsn: 'https://9354098a42ad42ad883c9359f4c87e8d@sentry.gc.nav.no/21',
        environment,
        release: packageConfig.version,
    });
}

if (process.env.NODE_ENV !== 'production') {
    axe(React, ReactDOM, 1000);
}

// Oppdater denne ved endringer som krever å nullstille localStorage
(function () {
    try {
        if (window.localStorage.getItem('oppgaveRequestVersjon') !== 'v1') {
            localStorage.clear();
            localStorage.setItem('oppgaveRequestVersjon', 'v1');
        }
    } catch {
        // Never mind
    }
})();

const rootElement = document.getElementById('app');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(rootElement!);
root.render(<App />);
