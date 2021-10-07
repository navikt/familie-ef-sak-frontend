import * as React from 'react';
import { Journalposttype } from '@navikt/familie-typer';
export interface DokumentProps {
    tittel: string;
    dato?: string;
    journalpostId: string;
    journalposttype: Journalposttype;
    dokumentInfoId: string;
    filnavn?: string;
}
export interface DokumentElementProps {
    dokument: DokumentProps;
    onClick: (dokument: DokumentProps) => void;
}
export interface DokumentlisteProps {
    dokumenter: DokumentProps[];
    onClick: (dokument: DokumentProps) => void;
    className?: string;
}
export declare const DokumentElement: React.FC<DokumentElementProps>;
declare const Dokumentliste: React.FC<DokumentlisteProps>;
export default Dokumentliste;
