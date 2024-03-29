import { amplitudeInstance } from './amplitudeConfig';
import { BesøkEvent, JournalføringEvent, NavigereTabEvent } from './typer';

function loggEvent(eventName: string, eventProperties: unknown) {
    amplitudeInstance.logEvent(eventName, eventProperties);
}

export const loggNavigereTabEvent = (navigereTabEvent: NavigereTabEvent) => {
    loggEvent('navigere-tab', navigereTabEvent);
};

export const loggBesøkEvent = (besøkEvent: BesøkEvent) => {
    loggEvent('besøk', besøkEvent);
};

export const loggJournalføring = (journalføringEvent: JournalføringEvent) => {
    loggEvent('journalføring', journalføringEvent);
};
