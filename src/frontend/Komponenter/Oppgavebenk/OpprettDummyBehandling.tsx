import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { FnrInput, Select } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import { useApp } from '../../App/context/AppContext';
import { useNavigate } from 'react-router-dom';
import AlertStripeFeilPreWrap from '../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';

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
    const [behandlingsType, settBehandlingstype] = useState<string>('FØRSTEGANGSBEHANDLING');
    const navigate = useNavigate();

    const opprettBehandling = () => {
        axiosRequest<string, { personIdent: string; behandlingsType: string }>({
            method: 'POST',
            url: `/familie-ef-sak/api/test/fagsak`,
            data: { personIdent: personIdent, behandlingsType: behandlingsType },
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
                navigate(`/behandling/${nyBehandlingRessurs.data}/tidligere-vedtaksperioder`);
        }
    }, [nyBehandlingRessurs, navigate]);
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

            <Select
                value={behandlingsType}
                className="flex-item"
                label="Type"
                onChange={(event) => {
                    event.persist();
                    settBehandlingstype(event.target.value);
                }}
            >
                <option value="FØRSTEGANGSBEHANDLING">Førstegangsbehandling</option>
                <option value="BLANKETT">Blankett</option>
                <option value="MIGRERING">Migrering</option>
            </Select>

            <Knapp mini disabled={!harSattPersonIdent} onClick={opprettBehandling}>
                Lag behandling
            </Knapp>
            {harFeil && <AlertStripeFeilPreWrap>{feilmelding}</AlertStripeFeilPreWrap>}
        </StyledOpprettDummyBehandling>
    );
};
