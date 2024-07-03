import React, { useEffect, useState } from 'react';
import { Stønadstype, stønadstypeTilTekst } from '../../../App/typer/behandlingstema';
import { useHentFagsak } from '../../../App/hooks/useHentFagsak';
import { fnr } from '@navikt/fnrvalidator';
import AlertStripeFeilPreWrap from '../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { BodyLong, Button, Heading, TextField } from '@navikt/ds-react';
import { erAvTypeFeil, RessursStatus } from '../../../App/typer/ressurs';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';
import { FamilieSelect } from '../../../Felles/Input/FamilieSelect';

const AlertInfoPreWrap = styled(AlertInfo)`
    white-space: pre-wrap;
    word-wrap: break-word;
    margin-top: 2rem;
`;

const Container = styled.div`
    margin: 2rem;
    max-width: 60rem;
`;

const SkjemaContainer = styled.div`
    margin-top: 2rem;
    max-width: 14rem;
`;

const WrapperMedMargin = styled.div`
    margin-top: 2rem;
    margin-bottom: 1rem;
`;

const VelgPersonOgStønadstype = () => {
    const [stønadstype, settStønadstype] = useState<Stønadstype>();
    const [personIdent, settPersonIdent] = useState<string>('');
    const [feilmelding, settFeilmelding] = useState<string>();
    const [laster, settLaster] = useState<boolean>(false);
    const { fagsak, hentFagsak } = useHentFagsak();
    const navigate = useNavigate();
    const harSattPersonIdent = personIdent.length === 11;
    const harFeil = feilmelding !== undefined && harSattPersonIdent;

    const bekreftValg = () => {
        if (personIdent && stønadstype && !harFeil && !laster) {
            settLaster(true);
            hentFagsak(personIdent, stønadstype);
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
            navigate(`/opprett-forstegangsbehandling/${fagsak.data.id}`);
        } else if (erAvTypeFeil(fagsak)) {
            settFeilmelding(fagsak.frontendFeilmelding);
            settLaster(false);
        }
    }, [fagsak, navigate]);

    return (
        <Container>
            <Heading size={'xlarge'} level={'1'}>
                Opprett førstegangsbehandling manuelt
            </Heading>
            <BodyLong>
                Velg stønadstype og fødselsnummer for å gå videre til opprettelse av
                førstegangsbehandling
            </BodyLong>
            <AlertInfoPreWrap>
                Denne funksjonen skal brukes hvis du trenger å opprette en førstegangsbehandling
                uten at det finnes en digital søknad. Typiske scenarioer for bruk er henlagte
                papirsøknader, papirsøknader journalført i Gosys, tilleggsstønadssøknader som
                gjelder stønad til barnetilsyn.
                {'\n\n'}
                Dersom det foreligger en digital søknad så skal denne admin-journalføres.
            </AlertInfoPreWrap>
            <SkjemaContainer>
                <FamilieSelect
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
                </FamilieSelect>
                <TextField
                    label="Fødselsnummer"
                    autoComplete="off"
                    value={personIdent}
                    onChange={(e) => oppdaterFødselsnummer(e.target.value)}
                />
                <WrapperMedMargin>
                    <Button onClick={bekreftValg} type="button">
                        Gå videre
                    </Button>
                </WrapperMedMargin>
            </SkjemaContainer>
            {harFeil && <AlertStripeFeilPreWrap>{feilmelding}</AlertStripeFeilPreWrap>}
        </Container>
    );
};

export default VelgPersonOgStønadstype;
