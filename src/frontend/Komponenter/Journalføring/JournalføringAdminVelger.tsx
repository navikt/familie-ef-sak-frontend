import React, { useState } from 'react';
import styled from 'styled-components';
import { Sidetittel } from 'nav-frontend-typografi';
import { FamilieInput } from '@navikt/familie-form-elements';
import { useNavigate } from 'react-router-dom';
import validator from '@navikt/fnrvalidator';
import { Button } from '@navikt/ds-react';

const SideLayout = styled.div`
    max-width: 50rem;
    padding: 2rem;
`;

const Blokk = styled.div`
    margin-bottom: 1rem;
    margin-top: 1rem;
    max-width: 10rem;
`;

const StyledInput = styled(FamilieInput)`
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
        <SideLayout className={'container'}>
            <Sidetittel>Opprett ny behandling for journalpost</Sidetittel>
            <Blokk>
                <StyledInput
                    label={'Skriv inn journalpostID'}
                    value={journalpostId}
                    onChange={(e) => {
                        settJournalpostId(e.target.value);
                        settErGyldigFnr(validator.fnr(e.target.value).status === 'valid');
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
