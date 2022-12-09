import React, { useEffect, useState } from 'react';
import { Stønadstype, stønadstypeTilTekst } from '../../../App/typer/behandlingstema';
import { useHentFagsak } from '../../../App/hooks/useHentFagsak';
import { FamilieInput, FamilieSelect } from '@navikt/familie-form-elements';
import { fnr } from '@navikt/fnrvalidator';
import AlertStripeFeilPreWrap from '../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { BodyLong, Button, Heading } from '@navikt/ds-react';
import { RessursStatus } from '../../../App/typer/ressurs';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            navigate(`/opprett-forstegangsbehandling/${fagsak.data.id}`);
        } else if (
            fagsak.status === RessursStatus.FEILET ||
            fagsak.status === RessursStatus.FUNKSJONELL_FEIL ||
            fagsak.status === RessursStatus.IKKE_TILGANG
        ) {
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
                <FamilieInput
                    label={'Fødselsnummer'}
                    onChange={(e) => {
                        const verdi = e.target.value;
                        settPersonIdent(verdi);
                        settFeilmelding(
                            fnr(verdi).status === 'invalid' ? 'Ugyldig fødselsnummer' : undefined
                        );
                    }}
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
