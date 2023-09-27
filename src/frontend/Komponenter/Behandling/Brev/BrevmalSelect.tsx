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
    const ønskedeBrevmaler = (dokumentnanvn: DokumentNavn[]) => {
        return dokumentnanvn?.filter((mal) => visBrevmal(mal, stønanadstype, frittstående));
    };

    const sorterPåPrioriteringsnummerDeretterAlfabetisk = (dokumentnanvn: DokumentNavn[]) => {
        return dokumentnanvn
            ?.filter((mal) => visBrevmal(mal, stønanadstype, frittstående))
            .sort((a, b) => {
                if (a.prioriteringsnummer && b.prioriteringsnummer) {
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

    const ønskedeBrevmalListe = ønskedeBrevmaler(
        dokumentnavn.status === RessursStatus.SUKSESS ? dokumentnavn.data : []
    );

    const sortertBrevliste = sorterPåPrioriteringsnummerDeretterAlfabetisk(ønskedeBrevmalListe);

    return (
        <DataViewer response={{ dokumentnavn }}>
            <Select
                label="Velg dokument"
                onChange={(e) => {
                    settBrevmal(e.target.value);
                }}
                value={brevmal}
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
