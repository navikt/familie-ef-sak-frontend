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
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { NyeBarn } from '../../../Felles/NyeBarn/NyeBarn';
import { Select } from 'nav-frontend-skjema';
import { EVilkårsbehandleBarnValg } from '../../../App/typer/vilkårsbehandleBarnValg';
import { Fagsak } from '../../../App/typer/fagsak';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { erGyldigDato } from '../../../App/utils/dato';

const StyledFamilieDatovelger = styled(FamilieDatovelger)`
    margin-top: 2rem;
`;

const FlexDiv = styled.div<{ horisontal: boolean }>`
    display: flex;
    justify-content: space-between;
    margin-bottom: ${(props) => (props.horisontal ? '18rem' : '1rem')};
    flex-direction: ${(props) => (props.horisontal ? 'row' : 'column')};
`;

export const StyledHovedknapp = styled(Hovedknapp)`
    margin-left: 2rem;
    margin-right: 0.5rem;
`;

export const StyledSelect = styled(Select)`
    margin-top: 2rem;
`;

const KnappeWrapper = styled.div`
    margin: 0 auto;
    margin-top: 4rem;
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
        if (
            nyeBarnSidenForrigeBehandling.status === RessursStatus.SUKSESS &&
            nyeBarnSidenForrigeBehandling.data.harBarnISisteIverksatteBehandling
        ) {
            if (erGOmregning) {
                settVilkårsbehandleNyeBarn(EVilkårsbehandleBarnValg.IKKE_VILKÅRSBEHANDLE);
            } else {
                settVilkårsbehandleNyeBarn(EVilkårsbehandleBarnValg.VILKÅRSBEHANDLE);
            }
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
            default:
                return true;
        }
    };

    return (
        <>
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
                                        .map(
                                            (behandlingsårsak: Behandlingsårsak, index: number) => (
                                                <option key={index} value={behandlingsårsak}>
                                                    {behandlingsårsakTilTekst[behandlingsårsak]}
                                                </option>
                                            )
                                        )}
                            </StyledSelect>
                            <FlexDiv horisontal={!skalViseNyeBarnValg}>
                                <StyledFamilieDatovelger
                                    id={'krav-mottatt'}
                                    label={'Krav mottatt'}
                                    onChange={(dato) => {
                                        settValgtDato(dato as string);
                                    }}
                                    valgtDato={valgtDato}
                                    feil={
                                        valgtDato && !erGyldigDato(valgtDato)
                                            ? 'Ugyldig dato'
                                            : undefined
                                    }
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

                                <KnappeWrapper>
                                    <StyledHovedknapp
                                        onClick={() => {
                                            const kanStarteRevurdering = !!(
                                                valgtBehandlingsårsak &&
                                                valgtDato &&
                                                erGyldigDato(valgtDato) &&
                                                !(
                                                    måTaStillingTilBarn &&
                                                    vilkårsbehandleNyeBarn ===
                                                        EVilkårsbehandleBarnValg.IKKE_VALGT
                                                )
                                            );
                                            if (kanStarteRevurdering) {
                                                lagRevurdering({
                                                    fagsakId: fagsak.id,
                                                    barn:
                                                        vilkårsbehandleNyeBarn ===
                                                        EVilkårsbehandleBarnValg.VILKÅRSBEHANDLE
                                                            ? nyeBarnSidenForrigeBehandling.nyeBarn
                                                            : [],
                                                    behandlingsårsak: valgtBehandlingsårsak,
                                                    kravMottatt: valgtDato,
                                                    vilkårsbehandleNyeBarn: vilkårsbehandleNyeBarn,
                                                });
                                            } else {
                                                settFeilmeldingModal(
                                                    'Vennligst fyll ut alle felter'
                                                );
                                            }
                                        }}
                                    >
                                        Opprett
                                    </StyledHovedknapp>
                                    <Flatknapp
                                        onClick={() => {
                                            settVisModal(false);
                                        }}
                                    >
                                        Avbryt
                                    </Flatknapp>
                                </KnappeWrapper>
                            </FlexDiv>
                        </>
                    );
                }}
            </DataViewer>
            {feilmeldingModal && <AlertStripeFeil>{feilmeldingModal}</AlertStripeFeil>}
        </>
    );
};
