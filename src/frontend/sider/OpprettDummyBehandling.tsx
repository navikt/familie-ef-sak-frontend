import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { FnrInput } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import { useApp } from '../context/AppContext';
import { useHistory } from 'react-router';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

const StyledFnrInput = styled(FnrInput)`
    width: 150px;
    margin: 0.5rem 0;
`;
const StyledOpprettDummyBehandling = styled.div`
    width: 300px;
    float: right;
`;

export const OpprettDummyBehandling: React.FC = () => {
    const { axiosRequest } = useApp();
    const [nyBehandlingRessurs, settNyBehandlingRessurs] = useState<Ressurs<string>>(
        byggTomRessurs()
    );
    const [feilmelding, settFeilmelding] = useState<string | undefined>(undefined);
    const [personIdent, settPersonIdent] = useState<string>('');
    const history = useHistory();

    const opprettBehandling = () => {
        axiosRequest<string, { personIdent: string }>({
            method: 'POST',
            url: `/familie-ef-sak/api/test/fagsak`,
            data: { personIdent: personIdent },
        }).then((res: Ressurs<string>) => settNyBehandlingRessurs(res));
    };

    useEffect(() => {
        switch (nyBehandlingRessurs.status) {
            case RessursStatus.HENTER:
            case RessursStatus.IKKE_HENTET:
                settFeilmelding('');
                return;
            case RessursStatus.IKKE_TILGANG:
            case RessursStatus.FUNKSJONELL_FEIL:
            case RessursStatus.FEILET:
                settFeilmelding(
                    nyBehandlingRessurs.frontendFeilmelding || nyBehandlingRessurs.melding
                );
                return;
            case RessursStatus.SUKSESS:
                history.push(`/behandling/${nyBehandlingRessurs.data}/inngangsvilkar`);
        }
    }, [nyBehandlingRessurs]);
    const harSattPersonIdent = personIdent.length === 11;
    const harFeil = feilmelding !== undefined && harSattPersonIdent;

    return (
        <StyledOpprettDummyBehandling>
            <StyledFnrInput
                label={'[Test] Opprett dummy-behandling'}
                onValidate={(erGyldig) =>
                    settFeilmelding(!erGyldig ? 'Ugyldig fødselsnummer' : undefined)
                }
                value={personIdent}
                onChange={(e) => settPersonIdent(e.target.value)}
            />
            <Knapp mini disabled={!harSattPersonIdent} onClick={opprettBehandling}>
                Lag behandling
            </Knapp>
            {harFeil && <AlertStripeFeil>{feilmelding}</AlertStripeFeil>}
        </StyledOpprettDummyBehandling>
    );
};
