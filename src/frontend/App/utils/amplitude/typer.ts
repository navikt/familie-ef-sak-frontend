import { Journalføringsaksjon } from '../../hooks/useJournalføringState';
import { Journalføringsårsak } from '../../../Komponenter/Journalføring/Felles/utils';
import { Stønadstype } from '../../typer/behandlingstema';

export type NavigereTabEvent = {
    side: string;
    forrigeFane: string;
    nesteFane: string;
    behandlingStatus?: string;
    behandlingSteg?: string;
};

export type BesøkEvent = {
    side: string;
    fane?: string;
};

export interface JournalføringEvent {
    harEndretAvsender: boolean;
    harEndretLogiskeVedlegg: boolean;
    aksjon: Journalføringsaksjon;
    årsak: Journalføringsårsak;
    harBarnSomSkalFødes: boolean;
    stønadstype?: Stønadstype;
}
