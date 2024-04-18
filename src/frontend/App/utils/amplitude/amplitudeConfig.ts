import { erProd } from '../miljø';
import * as amplitude from '@amplitude/analytics-browser';
import { BesøkEvent, JournalføringEvent, NavigereTabEvent } from './typer';

const getApiKey = () => {
    if (erProd()) {
        return '950365543c4356bd38a6c8b1de8e166e'; // prod
    }
    return '84389e45c7a84638cbd753b471db5fb7'; // dev
};

amplitude.init(getApiKey(), undefined, {
    serverUrl: 'https://amplitude.nav.no/collect',
    defaultTracking: false,
    ingestionMetadata: {
        sourceName: window.location.toString(),
    },
});

export function logEvent(
    eventName: string,
    eventProperties: NavigereTabEvent | BesøkEvent | JournalføringEvent
) {
    amplitude.track(eventName, eventProperties);
}
