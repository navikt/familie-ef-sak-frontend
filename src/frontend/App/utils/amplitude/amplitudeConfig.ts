import amplitude from 'amplitude-js';
import { erProd } from '../miljø';

const getApiKey = () => {
    if (erProd()) {
        return '950365543c4356bd38a6c8b1de8e166e'; // prod
    }
    return '84389e45c7a84638cbd753b471db5fb7'; // dev
};

export const amplitudeInstance = amplitude.getInstance();

amplitudeInstance.init(getApiKey(), '', {
    apiEndpoint: 'amplitude.nav.no/collect',
    saveEvents: false,
    includeUtm: true,
    batchEvents: false,
    includeReferrer: true,
});
