import { IJojurnalpostResponse } from '../../App/typer/journalforing';
import {
    behandlingstemaTilStønadstype,
    Stønadstype,
    stønadstypeTilTekst,
} from '../../App/typer/behandlingstema';
import React, { useEffect, useState } from 'react';
import { BodyShort, Label, Select } from '@navikt/ds-react';

export function VelgFagsakForIkkeSøknad(props: {
    journalResponse: IJojurnalpostResponse;
    hentFagsak: (personIdent: string, stønadstype: Stønadstype) => void;
}) {
    const { journalResponse, hentFagsak } = props;

    const stønadstypeFraJournalpost = behandlingstemaTilStønadstype(
        journalResponse.journalpost.behandlingstema
    );
    const [stønadstype, settStønadstype] = useState(stønadstypeFraJournalpost);

    useEffect(() => {
        if (stønadstype) {
            hentFagsak(journalResponse.personIdent, stønadstype);
        }
    }, [stønadstype, journalResponse, hentFagsak]);

    return (
        <>
            <Label>Journalposttittel</Label>
            <BodyShort>{journalResponse.journalpost.tittel}</BodyShort>
            <Select
                value={stønadstype || ''}
                label={'Velg stønadstype'}
                onChange={(e) => settStønadstype(e.target.value as Stønadstype)}
            >
                <option value="">Velg stønadstype</option>
                {Object.values(Stønadstype).map((stønadstype) => (
                    <option value={stønadstype} key={stønadstype}>
                        {stønadstypeTilTekst[stønadstype]}
                    </option>
                ))}
            </Select>
        </>
    );
}
