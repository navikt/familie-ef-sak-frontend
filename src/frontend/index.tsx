import { init } from '@sentry/browser';
import * as React from 'react';
import axe from 'react-axe';
import * as ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';

import App from './komponenter/App';
import './index.less';

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

if (window.localStorage.getItem('oppgaveRequestVersjon') !== 'v1') {
    // Todo: wrap in try catch?
    localStorage.setItem('oppgaveRequestVersjon', 'v1');
    localStorage.removeItem('oppgaveRequest');
}

const rootElement = document.getElementById('app');
const renderApp = (Component: React.ComponentType): void => {
    ReactDOM.render(<Component />, rootElement);
};

renderApp(hot(module)(App));
