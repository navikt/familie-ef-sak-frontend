export interface IUtestengelse {
    id: string;
    periode: { fom: string; tom: string };
    slettet: boolean;
    opprettetAv: string;
    opprettetTid: string;
    endretAv: string;
    endretTid: string;
}
