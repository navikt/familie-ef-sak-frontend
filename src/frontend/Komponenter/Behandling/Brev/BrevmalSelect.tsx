import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { DokumentNavn } from './BrevTyper';
import React, { Dispatch, SetStateAction } from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Select } from '@navikt/ds-react';
import { visBrevmal } from './BrevUtils';
import { Stønadstype } from '../../../App/typer/behandlingstema';

type BrevmalSelectProps = {
    dokumentnavn: Ressurs<DokumentNavn[]>;
    settBrevmal: Dispatch<SetStateAction<string | undefined>>;
    brevmal: string | undefined;
    stønanadstype?: Stønadstype;
    frittstående?: boolean;
};
export const BrevmalSelect: React.FC<BrevmalSelectProps> = ({
    dokumentnavn,
    settBrevmal,
    brevmal,
    stønanadstype,
    frittstående,
}) => {
    const filtrerBrevmaler = (dokumentnanvn: DokumentNavn[]) => {
        return dokumentnanvn?.filter((mal) => visBrevmal(mal, stønanadstype, frittstående));
    };

    const sorterPåPrioriteringsnummerDeretterAlfabetisk = (dokumentnanvn: DokumentNavn[]) => {
        return dokumentnanvn.sort((a, b) => {
            if (a.prioriteringsnummer && b.prioriteringsnummer) {
                if (a.prioriteringsnummer === b.prioriteringsnummer) {
                    return a.visningsnavn.localeCompare(b.visningsnavn);
                }
                return a.prioriteringsnummer - b.prioriteringsnummer;
            } else if (a.prioriteringsnummer) {
                return -1;
            } else if (b.prioriteringsnummer) {
                return 1;
            } else {
                return a.visningsnavn.localeCompare(b.visningsnavn);
            }
        });
    };

    const filtrertBrevmalListe = filtrerBrevmaler(
        dokumentnavn.status === RessursStatus.SUKSESS ? dokumentnavn.data : []
    );

    const sortertBrevliste = sorterPåPrioriteringsnummerDeretterAlfabetisk(filtrertBrevmalListe);

    return (
        <DataViewer response={{ dokumentnavn }}>
            <Select
                label="Velg dokument"
                onChange={(e) => {
                    settBrevmal(e.target.value);
                }}
                value={brevmal}
                size="small"
            >
                <option value="">Ikke valgt</option>

                {sortertBrevliste.map((navn: DokumentNavn) => (
                    <option value={navn.apiNavn} key={navn.apiNavn}>
                        {navn.visningsnavn}
                    </option>
                ))}
            </Select>
        </DataViewer>
    );
};
