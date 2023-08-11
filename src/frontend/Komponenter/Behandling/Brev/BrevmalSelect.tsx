import { Ressurs } from '../../../App/typer/ressurs';
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
}) => (
    <DataViewer response={{ dokumentnavn }}>
        {({ dokumentnavn }) => (
            <Select
                label="Velg dokument"
                onChange={(e) => {
                    settBrevmal(e.target.value);
                }}
                value={brevmal}
            >
                <option value="">Ikke valgt</option>

                {dokumentnavn
                    ?.filter((mal) => visBrevmal(mal, stønanadstype, frittstående))
                    .map((navn: DokumentNavn) => (
                        <option value={navn.apiNavn} key={navn.apiNavn}>
                            {navn.visningsnavn}
                        </option>
                    ))}
            </Select>
        )}
    </DataViewer>
);
