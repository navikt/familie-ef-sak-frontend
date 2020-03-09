import { init } from '@sentry/browser';
import * as React from 'react';
import axe from 'react-axe';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './komponenter/App';

/* tslint:disable */
const packageConfig = require('../../package.json');
/* tslint:enable */

import './index.less';

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

const rootElement = document.getElementById('app');
const renderApp = (Component: React.ComponentType<{}>): void => {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>,
        rootElement
    );
};

renderApp(App);

if (module.hot) {
    module.hot.accept('./komponenter/App', () => {
        const NewApp = require('./komponenter/App').default;
        renderApp(NewApp);
    });
}
