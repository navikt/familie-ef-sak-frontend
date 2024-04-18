import { BesøkEvent, JournalføringEvent, NavigereTabEvent } from './typer';
import { logEvent } from './amplitudeConfig';

export const loggNavigereTabEvent = (navigereTabEvent: NavigereTabEvent) => {
    logEvent('navigere-tab', navigereTabEvent);
};

export const loggBesøkEvent = (besøkEvent: BesøkEvent) => {
    logEvent('besøk', besøkEvent);
};

export const loggJournalføring = (journalføringEvent: JournalføringEvent) => {
    logEvent('journalføring', journalføringEvent);
};
