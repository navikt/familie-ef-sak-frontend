import amplitude from 'amplitude-js';
import { erProd } from '../miljø';

const getApiKey = () => {
    if (erProd()) {
        return '950365543c4356bd38a6c8b1de8e166e'; // prod
    }
    return '84389e45c7a84638cbd753b471db5fb7'; // dev
};

const amplitudeInstance = amplitude.getInstance();

amplitudeInstance.init(getApiKey(), '', {
    apiEndpoint: 'amplitude.nav.no/collect',
    saveEvents: false,
    includeUtm: true,
    batchEvents: false,
    includeReferrer: true,
});

export function loggEvent(eventName: string, eventProperties: unknown) {
    amplitudeInstance.logEvent(eventName, eventProperties);
}

export const loggBesøkEvent = (side: string, path: string) => {
    loggEvent('besøk', { side, path });
};
