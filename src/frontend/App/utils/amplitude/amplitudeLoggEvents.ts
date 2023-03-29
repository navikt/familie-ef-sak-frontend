import { amplitudeInstance } from './amplitudeConfig';

function loggEvent(eventName: string, eventProperties: unknown) {
    amplitudeInstance.logEvent(eventName, eventProperties);
}

export const loggBesøkEvent = (side: string, path: string) => {
    loggEvent('besøk', { side, path });
};
