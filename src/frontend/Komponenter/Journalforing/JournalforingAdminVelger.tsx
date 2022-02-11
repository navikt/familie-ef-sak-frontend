import React, { useState } from 'react';
import styled from 'styled-components';
import { Sidetittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import { FamilieInput } from '@navikt/familie-form-elements';
import { useNavigate } from 'react-router-dom';

const SideLayout = styled.div`
    max-width: 50rem;
    padding: 2rem;
`;

const Blokk = styled.div`
    margin-bottom: 1rem;
    margin-top: 1rem;
    max-width: 10rem;
`;

export const JournalforingAdminVelger: React.FC = () => {
    const [journalpostId, settJournalpostId] = useState<string>('');
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
                <FamilieInput
                    label={'Skriv inn journalpostID'}
                    value={journalpostId}
                    onChange={(e) => {
                        settJournalpostId(e.target.value);
                    }}
                />
            </Blokk>
            <Hovedknapp onClick={() => gåVidere()}>Velg journalpost</Hovedknapp>
        </SideLayout>
    );
};
