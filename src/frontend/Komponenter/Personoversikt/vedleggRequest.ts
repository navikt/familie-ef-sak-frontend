import { Arkivtema } from '../../App/typer/arkivtema';

export interface VedleggRequest {
    fagsakPersonId: string;
    tema?: Arkivtema[];
    dokumenttype?: string;
    journalpostStatus?: string;
}
