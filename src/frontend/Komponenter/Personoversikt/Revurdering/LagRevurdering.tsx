import React, { useEffect, useState } from 'react';
import {
    Behandlingsårsak,
    behandlingsårsaker,
    behandlingsårsakTilTekst,
} from '../../../App/typer/Behandlingsårsak';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { FamilieDatovelger } from '@navikt/familie-form-elements';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import {
    NyeBarnSidenForrigeBehandling,
    RevurderingInnhold,
} from '../../../App/typer/revurderingstype';
import { ToggleName } from '../../../App/context/toggles';
import { useToggles } from '../../../App/context/TogglesContext';
import { useApp } from '../../../App/context/AppContext';
import { NyeBarn } from '../../../Felles/NyeBarn/NyeBarn';
import { EVilkårsbehandleBarnValg } from '../../../App/typer/vilkårsbehandleBarnValg';
import { Fagsak } from '../../../App/typer/fagsak';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { erEtterDagensDato, erGyldigDato } from '../../../App/utils/dato';
import { Alert, Button, Select } from '@navikt/ds-react';

const DatoContainer = styled.div`
    margin-top: 2rem;
    min-height: 20rem;
`;

const StyledSelect = styled(Select)`
    margin-top: 2rem;
`;

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

const ButtonContainer = styled.div`
    display: flex;
    margin-top: 1rem;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
`;

const ModalKnapp = styled(Button)`
    padding-right: 1.5rem;
    padding-left: 1.5rem;
    margin-left: 1rem;
`;

interface IProps {
    fagsak: Fagsak;
    valgtBehandlingstype: Behandlingstype;
    lagRevurdering: (revurderingInnhold: RevurderingInnhold) => void;
    settVisModal: (bool: boolean) => void;
}

export const LagRevurdering: React.FunctionComponent<IProps> = ({
    fagsak,
    valgtBehandlingstype,
    lagRevurdering,
    settVisModal,
}) => {
    const { toggles } = useToggles();
    const { axiosRequest } = useApp();

    const skalViseValgmulighetForKorrigering = toggles[ToggleName.visValgmulighetForKorrigering];
    const [feilmeldingModal, settFeilmeldingModal] = useState<string>();

    const [nyeBarnSidenForrigeBehandling, settNyeBarnSidenForrigeBehandling] = useState<
        Ressurs<NyeBarnSidenForrigeBehandling>
    >(byggTomRessurs());
    const [valgtBehandlingsårsak, settValgtBehandlingsårsak] = useState<Behandlingsårsak>();
    const [valgtDato, settValgtDato] = useState<string>();
    const [vilkårsbehandleNyeBarn, settVilkårsbehandleNyeBarn] = useState<EVilkårsbehandleBarnValg>(
        EVilkårsbehandleBarnValg.IKKE_VALGT
    );

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
            default:
                return true;
        }
    };

    const opprettRevurdering = (
        måTaStillingTilBarn: boolean,
        nyeBarnSidenForrigeBehandling: NyeBarnSidenForrigeBehandling
    ) => {
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
        } else {
            lagRevurdering({
                fagsakId: fagsak.id,
                barn:
                    vilkårsbehandleNyeBarn === EVilkårsbehandleBarnValg.VILKÅRSBEHANDLE
                        ? nyeBarnSidenForrigeBehandling.nyeBarn
                        : [],
                behandlingsårsak: valgtBehandlingsårsak,
                kravMottatt: valgtDato,
                vilkårsbehandleNyeBarn: vilkårsbehandleNyeBarn,
            });
        }
    };

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
                        <StyledSelect
                            label="Årsak"
                            value={valgtBehandlingsårsak || ''}
                            onChange={(e) => {
                                settValgtBehandlingsårsak(e.target.value as Behandlingsårsak);
                            }}
                        >
                            <option value="">Velg</option>
                            {valgtBehandlingstype === Behandlingstype.REVURDERING &&
                                behandlingsårsaker
                                    .filter(skalViseÅrsak)
                                    .map((behandlingsårsak: Behandlingsårsak, index: number) => (
                                        <option key={index} value={behandlingsårsak}>
                                            {behandlingsårsakTilTekst[behandlingsårsak]}
                                        </option>
                                    ))}
                        </StyledSelect>
                        <DatoContainer>
                            <FamilieDatovelger
                                id={'krav-mottatt'}
                                label={'Krav mottatt'}
                                onChange={(dato) => {
                                    settValgtDato(dato as string);
                                }}
                                value={valgtDato}
                                feil={
                                    valgtDato && !erGyldigDato(valgtDato)
                                        ? 'Ugyldig dato'
                                        : undefined
                                }
                                limitations={{ maxDate: new Date().toISOString() }}
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
                                onClick={() =>
                                    opprettRevurdering(
                                        måTaStillingTilBarn,
                                        nyeBarnSidenForrigeBehandling
                                    )
                                }
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
