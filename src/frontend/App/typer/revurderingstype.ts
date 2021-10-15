import { Behandlingsårsak } from './Behandlingsårsak';

export interface RevurderingInnhold {
    fagsakId: string;
    behandlingsårsak: Behandlingsårsak;
    kravMottat: string;
}
