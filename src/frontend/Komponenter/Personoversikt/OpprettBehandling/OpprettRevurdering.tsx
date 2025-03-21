import React, { useEffect, useState } from 'react';
import {
    Behandlingsårsak,
    behandlingsårsakerForRevurdering,
    behandlingsårsakTilTekst,
} from '../../../App/typer/behandlingsårsak';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import {
    NyeBarnSidenForrigeBehandling,
    RevurderingPayload,
} from '../../../App/typer/revurderingstype';
import { ToggleName } from '../../../App/context/toggles';
import { useToggles } from '../../../App/context/TogglesContext';
import { useApp } from '../../../App/context/AppContext';
import { NyeBarn } from '../../../Felles/NyeBarn/NyeBarn';
import { EVilkårsbehandleBarnValg } from '../../../App/typer/vilkårsbehandleBarnValg';
import { Fagsak } from '../../../App/typer/fagsak';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { erEtterDagensDato, erGyldigDato } from '../../../App/utils/dato';
import { Alert, Button } from '@navikt/ds-react';
import { Datovelger } from '../../../Felles/Datovelger/Datovelger';
import { BarnSomSkalFødes } from '../../../App/hooks/useJournalføringState';
import { ÅrsakSelect } from './ÅrsakSelect';
import { TerminBarnSkjema } from '../../Behandling/Førstegangsbehandling/TerminBarnSkjema';

const DatoContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 20rem;
`;

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
`;

const ModalKnapp = styled(Button)`
    padding-right: 1.5rem;
    padding-left: 1.5rem;
    margin-left: 1rem;
`;

const inneholderBarnSomErUgyldige = (barnSomSkalFødes: BarnSomSkalFødes[]) =>
    barnSomSkalFødes.some(
        (barn) =>
            !barn.fødselTerminDato ||
            barn.fødselTerminDato.trim() === '' ||
            !erGyldigDato(barn.fødselTerminDato)
    );

interface Props {
    fagsak: Fagsak;
    opprettRevurdering: (payload: RevurderingPayload) => void;
    settVisModal: (bool: boolean) => void;
}

export const OpprettRevurdering: React.FunctionComponent<Props> = ({
    fagsak,
    opprettRevurdering,
    settVisModal,
}) => {
    const { toggles } = useToggles();
    const { axiosRequest } = useApp();

    const skalViseValgmulighetForKorrigering = toggles[ToggleName.visValgmulighetForKorrigering];
    const [feilmeldingModal, settFeilmeldingModal] = useState<string>();

    const [nyeBarnSidenForrigeBehandling, settNyeBarnSidenForrigeBehandling] =
        useState<Ressurs<NyeBarnSidenForrigeBehandling>>(byggTomRessurs());
    const [valgtBehandlingsårsak, settValgtBehandlingsårsak] = useState<Behandlingsårsak>();
    const [valgtDato, settValgtDato] = useState<string>();
    const [vilkårsbehandleNyeBarn, settVilkårsbehandleNyeBarn] = useState<EVilkårsbehandleBarnValg>(
        EVilkårsbehandleBarnValg.IKKE_VALGT
    );
    const [barnSomSkalFødes, settBarnSomSkalFødes] = useState<BarnSomSkalFødes[]>([]);

    useEffect(() => {
        axiosRequest<NyeBarnSidenForrigeBehandling, null>({
            url: `familie-ef-sak/api/behandling/barn/fagsak/${fagsak.id}`,
        }).then((response: RessursSuksess<NyeBarnSidenForrigeBehandling> | RessursFeilet) => {
            settNyeBarnSidenForrigeBehandling(response);
        });
    }, [axiosRequest, fagsak]);

    const erGOmregning = valgtBehandlingsårsak === Behandlingsårsak.G_OMREGNING;

    useEffect(() => {
        if (erGOmregning) {
            settVilkårsbehandleNyeBarn(EVilkårsbehandleBarnValg.IKKE_VILKÅRSBEHANDLE);
        } else if (
            nyeBarnSidenForrigeBehandling.status === RessursStatus.SUKSESS &&
            nyeBarnSidenForrigeBehandling.data.harBarnISisteIverksatteBehandling
        ) {
            settVilkårsbehandleNyeBarn(EVilkårsbehandleBarnValg.VILKÅRSBEHANDLE);
        } else {
            settVilkårsbehandleNyeBarn(EVilkårsbehandleBarnValg.IKKE_VALGT);
        }
    }, [settVilkårsbehandleNyeBarn, nyeBarnSidenForrigeBehandling, erGOmregning]);

    const skalViseÅrsak = (behandlingsårsak: Behandlingsårsak) => {
        switch (behandlingsårsak) {
            case Behandlingsårsak.KORRIGERING_UTEN_BREV:
                return skalViseValgmulighetForKorrigering;
            case Behandlingsårsak.G_OMREGNING:
                return fagsak.stønadstype === Stønadstype.OVERGANGSSTØNAD;
            case Behandlingsårsak.SATSENDRING:
                return (
                    toggles[ToggleName.visSatsendring] &&
                    fagsak.stønadstype === Stønadstype.BARNETILSYN
                );
            case Behandlingsårsak.AUTOMATISK_INNTEKTSENDRING:
                return false;
            default:
                return true;
        }
    };

    const valgbareBehandlingsårsaker = behandlingsårsakerForRevurdering.filter(skalViseÅrsak);

    const validerOgOpprettRevurdering = (måTaStillingTilBarn: boolean) => {
        if (!valgtBehandlingsårsak) {
            settFeilmeldingModal('Vennligst velg en årsak');
        } else if (!valgtDato || !erGyldigDato(valgtDato)) {
            settFeilmeldingModal('Vennligst velg en dato fra datovelgeren');
        } else if (erEtterDagensDato(valgtDato)) {
            settFeilmeldingModal('Vennligst velg en gyldig dato som ikke er fremover i tid');
        } else if (
            måTaStillingTilBarn &&
            vilkårsbehandleNyeBarn === EVilkårsbehandleBarnValg.IKKE_VALGT
        ) {
            settFeilmeldingModal('Vennligst ta stilling til barn');
        } else if (inneholderBarnSomErUgyldige(barnSomSkalFødes)) {
            settFeilmeldingModal('Et eller flere barn mangler gyldig dato');
        } else {
            opprettRevurdering({
                fagsakId: fagsak.id,
                behandlingsårsak: valgtBehandlingsårsak,
                kravMottatt: valgtDato,
                vilkårsbehandleNyeBarn: vilkårsbehandleNyeBarn,
                barnSomSkalFødes: barnSomSkalFødes,
            });
        }
    };

    const skalViseTerminBarnSkjema =
        fagsak.stønadstype !== Stønadstype.BARNETILSYN &&
        (valgtBehandlingsårsak === Behandlingsårsak.NYE_OPPLYSNINGER ||
            valgtBehandlingsårsak === Behandlingsårsak.PAPIRSØKNAD);

    const terminBarnSkjemaTekst =
        valgtBehandlingsårsak === Behandlingsårsak.NYE_OPPLYSNINGER
            ? 'Hvis brukeren venter barn som ikke allerede ligger i behandlingen, må du legge til termindatoen her.'
            : 'Hvis brukeren har oppgitt terminbarn i søknaden, må du legge til termindatoen her.';

    return (
        <DataViewer response={{ nyeBarnSidenForrigeBehandling }}>
            {({ nyeBarnSidenForrigeBehandling }) => {
                const harNyeBarnSidenForrigeBehandling =
                    nyeBarnSidenForrigeBehandling.nyeBarn.length > 0;
                const måTaStillingTilBarn =
                    harNyeBarnSidenForrigeBehandling &&
                    !nyeBarnSidenForrigeBehandling.harBarnISisteIverksatteBehandling &&
                    !erGOmregning;
                const skalViseNyeBarnValg =
                    valgtBehandlingsårsak && harNyeBarnSidenForrigeBehandling && !erGOmregning;

                return (
                    <>
                        <ÅrsakSelect
                            valgmuligheter={valgbareBehandlingsårsaker}
                            valgtBehandlingsårsak={valgtBehandlingsårsak}
                            settValgtBehandlingsårsak={settValgtBehandlingsårsak}
                            årsakTilTekst={behandlingsårsakTilTekst}
                        />
                        <DatoContainer>
                            <Datovelger
                                id={'krav-mottatt'}
                                label={'Krav mottatt'}
                                settVerdi={(dato) => {
                                    settValgtDato(dato as string);
                                }}
                                verdi={valgtDato}
                                feil={
                                    valgtDato && !erGyldigDato(valgtDato)
                                        ? 'Ugyldig dato'
                                        : undefined
                                }
                                maksDato={new Date()}
                            />
                            {skalViseNyeBarnValg && (
                                <NyeBarn
                                    nyeBarnSidenForrigeBehandling={
                                        nyeBarnSidenForrigeBehandling.nyeBarn
                                    }
                                    måTaStillingTilBarn={måTaStillingTilBarn}
                                    vilkårsbehandleNyeBarn={vilkårsbehandleNyeBarn}
                                    settVilkårsbehandleNyeBarn={settVilkårsbehandleNyeBarn}
                                />
                            )}
                            {skalViseTerminBarnSkjema && (
                                <TerminBarnSkjema
                                    barnSomSkalFødes={barnSomSkalFødes}
                                    oppdaterBarnSomSkalFødes={settBarnSomSkalFødes}
                                    tittel="Terminbarn"
                                    tekst={terminBarnSkjemaTekst}
                                />
                            )}
                            {feilmeldingModal && (
                                <AlertStripe variant={'error'}>{feilmeldingModal}</AlertStripe>
                            )}
                        </DatoContainer>
                        <ButtonContainer>
                            <ModalKnapp
                                variant="tertiary"
                                onClick={() => {
                                    settVisModal(false);
                                }}
                            >
                                Avbryt
                            </ModalKnapp>
                            <ModalKnapp
                                variant="primary"
                                onClick={() => validerOgOpprettRevurdering(måTaStillingTilBarn)}
                            >
                                Opprett
                            </ModalKnapp>
                        </ButtonContainer>
                    </>
                );
            }}
        </DataViewer>
    );
};
