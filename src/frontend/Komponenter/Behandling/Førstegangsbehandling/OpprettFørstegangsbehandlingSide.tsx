import React, { useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import { TerminBarnSkjema } from './TerminBarnSkjema';
import { ForeldreansvarBarnSkjema } from './ForeldreansvarBarnSkjema';
import { BarnSomSkalFødes, ForeldreansvarBarn } from '../../../App/hooks/useJournalføringState';
import { useNavigate, useParams } from 'react-router-dom';
import { Behandling, BehandlingResultat, Fagsak } from '../../../App/typer/fagsak';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { BodyLong, BodyShort, Button, Heading } from '@navikt/ds-react';
import { TextLabel } from '../../../Felles/Visningskomponenter/Tekster';
import { Stønadstype, stønadstypeTilTekst } from '../../../App/typer/behandlingstema';
import { erGyldigDato } from '../../../App/utils/dato';
import { fnr } from '@navikt/fnrvalidator';
import AlertStripeFeilPreWrap from '../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import styled from 'styled-components';
import { Behandlingsårsak, behandlingsårsakTilTekst } from '../../../App/typer/behandlingsårsak';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import { Datovelger } from '../../../Felles/Datovelger/Datovelger';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';

type IFagsakParam = {
    fagsakId: string;
};

const Container = styled.div`
    margin: 2rem;
    max-width: 60rem;

    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

interface Førstegangsbehandling {
    kravMottatt: string;
    behandlingsårsak: Behandlingsårsak;
    barn: BarnSomSkalFødes[];
    foreldreansvarBarn: ForeldreansvarBarn[];
}

const inneholderBarnSomErUgyldige = (barnSomSkalFødes: BarnSomSkalFødes[]) =>
    barnSomSkalFødes.some(
        (barn) =>
            !barn.fødselTerminDato ||
            barn.fødselTerminDato.trim() === '' ||
            !erGyldigDato(barn.fødselTerminDato)
    );

const inneholderForeldreansvarBarnMedUgyldigFnr = (foreldreansvarBarn: ForeldreansvarBarn[]) =>
    foreldreansvarBarn.some(
        (barn) => barn.fødselsnummer && fnr(barn.fødselsnummer).status === 'invalid'
    );

const kanOppretteFørstegangsbehandling = (behandlinger: Behandling[]): boolean => {
    return !behandlinger.some((behandling) => {
        return (
            behandling.type != Behandlingstype.FØRSTEGANGSBEHANDLING ||
            behandling.resultat != BehandlingResultat.HENLAGT
        );
    });
};

export const OpprettFørstegangsbehandlingSide = () => {
    const { fagsakId } = useParams<IFagsakParam>();
    const [fagsak, settFagsak] = useState<Ressurs<Fagsak>>(byggTomRessurs());
    const [barnSomSkalFødes, settBarnSomSkalFødes] = useState<BarnSomSkalFødes[]>([]);
    const [foreldreansvarBarn, settForeldreansvarBarn] = useState<ForeldreansvarBarn[]>([]);
    const [kravMottattDato, settKravMottattDato] = useState<string>();
    const årsak = Behandlingsårsak.MANUELT_OPPRETTET;
    const [feilmelding, settFeilmelding] = useState<string>();
    const [senderInn, settSenderInn] = useState<boolean>(false);
    const { axiosRequest } = useApp();
    const { toggles } = useToggles();
    const navigate = useNavigate();

    const visForeldreansvarBarnSkjema = toggles[ToggleName.leggTilForeldreansvarsBarnBarnetilsyn];

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
        } else if (inneholderForeldreansvarBarnMedUgyldigFnr(foreldreansvarBarn)) {
            return 'Et eller flere foreldreansvar barn har ugyldig fødselsnummer';
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
                    barn: barnSomSkalFødes,
                    foreldreansvarBarn: foreldreansvarBarn,
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
            <div>
                <Heading size={'xlarge'} level={'1'}>
                    Opprett førstegangsbehandling manuelt
                </Heading>
                <BodyLong>Velg evt. terminbarn og sett krav mottatt dato</BodyLong>
            </div>
            <DataViewer response={{ fagsak }}>
                {({ fagsak }) => (
                    <>
                        <div>
                            <TextLabel>Stønadstype: </TextLabel>
                            <BodyShort>{stønadstypeTilTekst[fagsak.stønadstype]}</BodyShort>
                            <TextLabel>Fødselsnummer: </TextLabel>
                            <BodyShort>{fagsak.personIdent}</BodyShort>
                            <TextLabel>Årsak:</TextLabel>
                            <BodyShort>
                                {behandlingsårsakTilTekst[Behandlingsårsak.MANUELT_OPPRETTET]}
                            </BodyShort>
                        </div>
                        <Datovelger
                            id={'krav-mottatt'}
                            label={'Krav mottatt'}
                            settVerdi={(dato) => {
                                settKravMottattDato(dato as string);
                            }}
                            verdi={kravMottattDato}
                            feil={
                                kravMottattDato && !erGyldigDato(kravMottattDato)
                                    ? 'Ugyldig dato'
                                    : undefined
                            }
                            maksDato={new Date()}
                        />
                        {fagsak.stønadstype === Stønadstype.OVERGANGSSTØNAD && (
                            <TerminBarnSkjema
                                barnSomSkalFødes={barnSomSkalFødes}
                                oppdaterBarnSomSkalFødes={settBarnSomSkalFødes}
                                tittel="Terminbarn"
                                tekst="Hvis brukeren har oppgitt terminbarn i søknaden, må du legge til termindatoen her."
                            />
                        )}
                        {visForeldreansvarBarnSkjema &&
                            fagsak.stønadstype === Stønadstype.BARNETILSYN && (
                                <ForeldreansvarBarnSkjema
                                    foreldreansvarBarn={foreldreansvarBarn}
                                    oppdaterForeldreansvarBarn={settForeldreansvarBarn}
                                />
                            )}
                        <div>
                            <Button
                                type={'button'}
                                onClick={() => opprettBehandling(fagsak)}
                                disabled={!kanOppretteFørstegangsbehandling(fagsak.behandlinger)}
                            >
                                Opprett førstegangsbehandling
                            </Button>
                        </div>
                        {feilmelding && (
                            <AlertStripeFeilPreWrap>{feilmelding}</AlertStripeFeilPreWrap>
                        )}
                        {!kanOppretteFørstegangsbehandling(fagsak.behandlinger) && (
                            <AlertStripeFeilPreWrap>
                                Det finnes allerede en behandling på denne brukeren
                            </AlertStripeFeilPreWrap>
                        )}
                    </>
                )}
            </DataViewer>
        </Container>
    );
};
