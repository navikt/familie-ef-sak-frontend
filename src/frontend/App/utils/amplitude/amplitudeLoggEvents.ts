import { amplitudeInstance } from './amplitudeConfig';
import { NavigereTabEvent } from './typer';

function loggEvent(eventName: string, eventProperties: unknown) {
    amplitudeInstance.logEvent(eventName, eventProperties);
}

export const loggNavigereTabEvent = (navigereTabEvent: NavigereTabEvent) => {
    loggEvent('navigere-tab', navigereTabEvent);
};
