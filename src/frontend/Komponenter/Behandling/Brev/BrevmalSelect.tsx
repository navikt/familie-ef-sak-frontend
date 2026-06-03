import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { DokumentNavn, RegelverkVersjon } from './BrevTyper';
import React, { Dispatch, SetStateAction } from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Select } from '@navikt/ds-react';
import { visBrevmal } from './BrevUtils';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { useBehandling } from '../../../App/context/BehandlingContext.tsx';

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
    const { erRegelendring2026 } = useBehandling();
    const filtrerBrevmaler = (dokumentnanvn: DokumentNavn[]) => {
        const stønadsFiltrert = dokumentnanvn?.filter((mal) =>
            visBrevmal(mal, stønanadstype, frittstående)
        );
        if (frittstående || erRegelendring2026 == null) return stønadsFiltrert;
        return stønadsFiltrert.filter((mal) => {
            if (mal.regelverkVersjon == null) return true;
            return erRegelendring2026
                ? mal.regelverkVersjon === RegelverkVersjon.NYTT_REGELVERK ||
                      mal.regelverkVersjon === RegelverkVersjon.BEGGE_REGELVERK
                : mal.regelverkVersjon === RegelverkVersjon.GAMMELT_REGELVERK ||
                      mal.regelverkVersjon === RegelverkVersjon.BEGGE_REGELVERK;
        });
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
