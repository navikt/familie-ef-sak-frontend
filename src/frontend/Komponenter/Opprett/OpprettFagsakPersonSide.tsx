import React, { useEffect, useState } from 'react';
import { fnr } from '@navikt/fnrvalidator';
import { BodyLong, Button, Heading, TextField } from '@navikt/ds-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AlertInfo } from '../../Felles/Visningskomponenter/Alerts';
import { Stønadstype } from '../../App/typer/behandlingstema';
import { useHentFagsak } from '../../App/hooks/useHentFagsak';
import { erAvTypeFeil, RessursStatus } from '../../App/typer/ressurs';
import AlertStripeFeilPreWrap from '../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';

const AlertInfoPreWrap = styled(AlertInfo)`
    white-space: pre-wrap;
    word-wrap: break-word;
`;

const Container = styled.div`
    margin: 2rem;
    max-width: 47rem;

    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Tekstfelt = styled(TextField)`
    max-width: 14rem;
`;

export const OpprettFagsakPersonSide = () => {
    const [personIdent, settPersonIdent] = useState<string>('');
    const [feilmelding, settFeilmelding] = useState<string>();
    const [laster, settLaster] = useState<boolean>(false);
    const { fagsakPåPersonIdent: fagsak, hentFagsakPåPersonIdent: opprettFagsakPåPersonIdent } =
        useHentFagsak();
    const navigate = useNavigate();
    const harSattPersonIdent = personIdent.length === 11;
    const harFeil = feilmelding !== undefined && harSattPersonIdent;

    const opprettFagsak = () => {
        if (personIdent && !harFeil && !laster) {
            settLaster(true);
            opprettFagsakPåPersonIdent(personIdent, Stønadstype.OVERGANGSSTØNAD);
        }
    };

    const oppdaterFødselsnummer = (personIdent: string) => {
        const feilmelding =
            fnr(personIdent).status === 'invalid' ? 'Ugyldig fødselsnummer' : undefined;

        settPersonIdent(personIdent);
        settFeilmelding(feilmelding);
    };

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            navigate(`/person/${fagsak.data.fagsakPersonId}`);
        } else if (erAvTypeFeil(fagsak)) {
            settFeilmelding(fagsak.frontendFeilmelding);
            settLaster(false);
        }
    }, [fagsak, navigate]);

    return (
        <Container>
            <Heading size={'xlarge'} level={'1'}>
                Opprett fagsak manuelt
            </Heading>
            <AlertInfoPreWrap>
                Denne funksjonen skal brukes hvis du trenger å opprette en fagsak på bruker slik at
                du kan sende et innhentingsbrev for å etterspørre opplysninger.
                {'\n\n'}
                Et typisk scenario for bruk er utførelse av vurder henvendelsesoppgaver hvor dere
                blir bedt om å vurdere retten til overgangsstønad for bruker.
            </AlertInfoPreWrap>
            <div>
                <BodyLong>Velg fødselsnummer for å opprette fagsak på bruker</BodyLong>
                <Tekstfelt
                    label="Fødselsnummer"
                    autoComplete="off"
                    value={personIdent}
                    onChange={(e) => oppdaterFødselsnummer(e.target.value)}
                />
            </div>
            <div>
                <Button onClick={opprettFagsak} type="button">
                    Opprett fagsak
                </Button>
            </div>
            {harFeil && <AlertStripeFeilPreWrap>{feilmelding}</AlertStripeFeilPreWrap>}
        </Container>
    );
};
