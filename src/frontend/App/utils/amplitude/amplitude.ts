import amplitude from 'amplitude-js';

const amplitudeInstance = amplitude.getInstance();

amplitudeInstance.init('84389e45c7a84638cbd753b471db5fb7', '', {
    apiEndpoint: 'amplitude.nav.no/collect',
    saveEvents: false,
    includeUtm: true,
    batchEvents: false,
    includeReferrer: true,
});

export function loggEvent(eventName: string, eventProperties: unknown) {
    amplitudeInstance.logEvent(eventName, eventProperties);
}

export const loggTestEvent = (side: string, beskrivelse: string) => {
    loggEvent('test', { side, beskrivelse });
};
