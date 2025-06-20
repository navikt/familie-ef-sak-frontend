import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { idnr } from '@navikt/fnrvalidator';
import { Button, Heading, TextField } from '@navikt/ds-react';

const SideLayout = styled.div`
    max-width: 50rem;
    padding: 2rem;
`;

const Blokk = styled.div`
    margin-bottom: 1rem;
    margin-top: 1rem;
    max-width: 10rem;
`;

const StyledInput = styled(TextField)`
    width: max-content;
`;

export const JournalføringAdminVelger: React.FC = () => {
    const [journalpostId, settJournalpostId] = useState<string>('');
    const [erGyligFnr, settErGyldigFnr] = useState<boolean>(false);
    const navigate = useNavigate();

    const gåVidere = () => {
        if (journalpostId) {
            navigate(`/admin/ny-behandling-for-ferdigstilt-journalpost/${journalpostId}`);
        }
    };

    return (
        <SideLayout>
            <Heading size={'large'} level={'2'}>
                Opprett ny behandling for journalpost
            </Heading>
            <Blokk>
                <StyledInput
                    label={'Skriv inn journalpostID'}
                    autoComplete="off"
                    value={journalpostId}
                    onChange={(e) => {
                        settJournalpostId(e.target.value);
                        settErGyldigFnr(idnr(e.target.value).status === 'valid');
                    }}
                />
            </Blokk>
            <Button type="button" onClick={() => gåVidere()}>
                Velg journalpost
            </Button>
            {erGyligFnr && (
                <div style={{ color: 'red' }}>
                    Valgt id for journalpost er også et gyldig fødselsnummer, har du tastet feil?
                </div>
            )}
        </SideLayout>
    );
};
