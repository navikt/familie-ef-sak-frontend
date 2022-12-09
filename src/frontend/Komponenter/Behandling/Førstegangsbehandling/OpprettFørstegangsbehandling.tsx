import React, { useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import LeggTilBarnSomSkalFødes from '../../Journalføring/LeggTilBarnSomSkalFødes';
import { BarnSomSkalFødes } from '../../../App/hooks/useJournalføringState';
import { useNavigate, useParams } from 'react-router-dom';
import { Fagsak } from '../../../App/typer/fagsak';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { BodyLong, BodyShort, Button, Heading, Label } from '@navikt/ds-react';
import { TextLabel } from '../../../Felles/Visningskomponenter/Tekster';
import { stønadstypeTilTekst } from '../../../App/typer/behandlingstema';
import { FamilieDatovelger, FamilieSelect } from '@navikt/familie-form-elements';
import { erGyldigDato } from '../../../App/utils/dato';
import AlertStripeFeilPreWrap from '../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import styled from 'styled-components';
import { Behandlingsårsak, behandlingsårsakTilTekst } from '../../../App/typer/Behandlingsårsak';

type IFagsakParam = {
    fagsakId: string;
};
const Container = styled.div`
    margin: 2rem;
    max-width: 60rem;
`;

const SkjemaContainer = styled.div`
    margin-top: 2rem;
    max-width: 14rem;
`;

interface Førstegangsbehandling {
    kravMottatt: string;
    behandlingsårsak: Behandlingsårsak;
    barnSomSkalFødes: BarnSomSkalFødes[];
}

const inneholderBarnSomErUgyldige = (barnSomSkalFødes: BarnSomSkalFødes[]) =>
    barnSomSkalFødes.some(
        (barn) =>
            !barn.fødselTerminDato ||
            barn.fødselTerminDato.trim() === '' ||
            !erGyldigDato(barn.fødselTerminDato)
    );

const OpprettFørstegangsbehandling = () => {
    const { fagsakId } = useParams<IFagsakParam>();
    const [fagsak, settFagsak] = useState<Ressurs<Fagsak>>(byggTomRessurs());
    const [barnSomSkalFødes, settBarnSomSkalFødes] = useState<BarnSomSkalFødes[]>([]);
    const [kravMottattDato, settKravMottattDato] = useState<string>();
    const [årsak, settÅrsak] = useState<Behandlingsårsak>();
    const [feilmelding, settFeilmelding] = useState<string>();
    const [senderInn, settSenderInn] = useState<boolean>(false);
    const { axiosRequest } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        axiosRequest<Fagsak, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/fagsak/${fagsakId}`,
        }).then(settFagsak);
    }, [fagsakId, axiosRequest]);

    const validerSkjema = (): string => {
        if (!årsak) {
            return 'Mangler årsak';
        } else if (!kravMottattDato) {
            return 'Mangler krav mottatt dato';
        } else if (kravMottattDato && !erGyldigDato(kravMottattDato)) {
            return 'Ugyldig dato for krav mottatt';
        } else if (inneholderBarnSomErUgyldige(barnSomSkalFødes)) {
            return 'Et eller flere barn mangler gyldig dato';
        } else {
            return '';
        }
    };

    const opprettBehandling = (fagsakData: Fagsak) => {
        const feilFraSkjema = validerSkjema();
        if (!feilFraSkjema && årsak && kravMottattDato && !senderInn) {
            settSenderInn(true);
            axiosRequest<string, Førstegangsbehandling>({
                method: 'POST',
                url: `/familie-ef-sak/api/forstegangsbehandling/${fagsakData.id}/opprett`,
                data: {
                    kravMottatt: kravMottattDato,
                    barnSomSkalFødes: barnSomSkalFødes,
                    behandlingsårsak: årsak,
                },
            })
                .then((respons: RessursSuksess<string> | RessursFeilet) => {
                    if (respons.status === RessursStatus.SUKSESS) {
                        const behandlingId = respons.data;
                        navigate(`/behandling/${behandlingId}`);
                    } else {
                        settFeilmelding(respons.frontendFeilmelding);
                    }
                })
                .finally(() => {
                    settSenderInn(false);
                });
        } else {
            settFeilmelding(feilFraSkjema);
        }
    };

    return (
        <Container>
            <Heading size={'xlarge'} level={'1'}>
                Opprett førstegangsbehandling manuelt
            </Heading>
            <BodyLong>Velg evt. terminbarn og sett krav mottatt dato</BodyLong>

            <DataViewer response={{ fagsak }}>
                {({ fagsak }) => (
                    <>
                        <TextLabel>Stønadstype: </TextLabel>
                        <BodyShort>{stønadstypeTilTekst[fagsak.stønadstype]}</BodyShort>
                        <TextLabel>Fødselsnummer: </TextLabel>
                        <BodyShort>{fagsak.personIdent}</BodyShort>
                        <SkjemaContainer>
                            <Label htmlFor={'krav-mottatt'}>Krav mottatt</Label>
                            <FamilieDatovelger
                                id={'krav-mottatt'}
                                label={''}
                                onChange={(dato) => {
                                    settKravMottattDato(dato as string);
                                }}
                                valgtDato={kravMottattDato}
                                feil={
                                    kravMottattDato &&
                                    !erGyldigDato(kravMottattDato) &&
                                    'Ugyldig dato'
                                }
                                limitations={{ maxDate: new Date().toISOString() }}
                            />
                            <FamilieSelect
                                value={årsak || ''}
                                label={'Velg årsak'}
                                onChange={(e) => settÅrsak(e.target.value as Behandlingsårsak)}
                            >
                                <option value="">Velg årsak</option>
                                <option value={Behandlingsårsak.NYE_OPPLYSNINGER}>
                                    {behandlingsårsakTilTekst[Behandlingsårsak.NYE_OPPLYSNINGER]}
                                </option>
                                <option value={Behandlingsårsak.PAPIRSØKNAD}>
                                    {behandlingsårsakTilTekst[Behandlingsårsak.PAPIRSØKNAD]}
                                </option>
                            </FamilieSelect>
                        </SkjemaContainer>
                        <LeggTilBarnSomSkalFødes
                            barnSomSkalFødes={barnSomSkalFødes}
                            oppdaterBarnSomSkalFødes={settBarnSomSkalFødes}
                            tittel={'Terminbarn'}
                        />
                        <Button type={'button'} onClick={() => opprettBehandling(fagsak)}>
                            Opprett førstegangsbehandling
                        </Button>
                        {feilmelding && (
                            <AlertStripeFeilPreWrap>{feilmelding}</AlertStripeFeilPreWrap>
                        )}
                    </>
                )}
            </DataViewer>
        </Container>
    );
};

export default OpprettFørstegangsbehandling;
