import React, { useEffect, useState } from 'react';
import { IJojurnalpostResponse } from '../../App/typer/journalføring';
import {
    behandlingstemaTilStønadstype,
    Stønadstype,
    stønadstypeTilTekst,
} from '../../App/typer/behandlingstema';
import { Alert, Select } from '@navikt/ds-react';
import styled from 'styled-components';

const DivMedBottomPadding = styled.div`
    padding-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const UtledEllerVelgFagsak: React.FC<{
    journalResponse: IJojurnalpostResponse;
    hentFagsak: (personIdent: string, stønadstype: Stønadstype) => void;
}> = ({ journalResponse, hentFagsak }) => {
    {
        const stønadstypeFraJournalpost = behandlingstemaTilStønadstype(
            journalResponse.journalpost.behandlingstema
        );
        const [stønadstype, settStønadstype] = useState(stønadstypeFraJournalpost);

        useEffect(() => {
            if (stønadstype) {
                hentFagsak(journalResponse.personIdent, stønadstype);
            }
            // eslint-disable-next-line
        }, [stønadstype]);

        if (!stønadstypeFraJournalpost) {
            return (
                <DivMedBottomPadding>
                    <Alert variant={'info'}>
                        Journalposten har ikke behandlingstema. Velg stønadstype.
                    </Alert>
                    <Select
                        label={'Velg stønadstype'}
                        onChange={(e) => {
                            settStønadstype(e.target.value as Stønadstype);
                        }}
                    >
                        <option value="">Ikke valgt</option>
                        {Object.values(Stønadstype).map((stønadstype) => (
                            <option value={stønadstype} key={stønadstype}>
                                {stønadstypeTilTekst[stønadstype]}
                            </option>
                        ))}
                    </Select>
                </DivMedBottomPadding>
            );
        }
        return null;
    }
};
