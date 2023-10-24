import { Behandlingsårsak } from './Behandlingsårsak';
import { EVilkårsbehandleBarnValg } from './vilkårsbehandleBarnValg';
import { BarnSomSkalFødes } from '../hooks/useJournalføringState';

export interface NyeBarnSidenForrigeBehandling {
    nyeBarn: BarnForRevurdering[];
    harBarnISisteIverksatteBehandling: boolean;
}

export interface BarnForRevurdering {
    personIdent: string;
    navn: string;
    fødselsdato: string;
}

export interface RevurderingInnhold {
    fagsakId: string;
    behandlingsårsak: Behandlingsårsak;
    kravMottatt: string;
    vilkårsbehandleNyeBarn: EVilkårsbehandleBarnValg;
    barnSomSkalFødes: BarnSomSkalFødes[];
}
