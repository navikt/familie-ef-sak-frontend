import { Behandlingsårsak } from './Behandlingsårsak';

export interface RevurderingInnhold {
    fagsakId: string;
    behandlingsårsak: Behandlingsårsak;
    kravMottatt: string;
}
