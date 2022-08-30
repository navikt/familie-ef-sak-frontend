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
import { NyeBarn } from '../../../Felles/NyeBarn/NyeBarn.tsx/NyeBarn';
import { Select } from 'nav-frontend-skjema';

enum EVilkårsbehandleBarnValg {
    VILKÅRSBEHANDLE = 'VILKÅRSBEHANDLE',
    IKKE_VILKÅRSBEHANDLE = 'IKKE_VILKÅRSBEHANDLE',
    IKKE_VALGT = 'IKKE_VALGT',
}

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
    fagsakId: string;
    valgtBehandlingstype: Behandlingstype;
    lagRevurdering: (revurderingInnhold: RevurderingInnhold) => void;
    settVisModal: (bool: boolean) => void;
}

export const LagRevurdering: React.FunctionComponent<IProps> = ({
    fagsakId,
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
    const [vilkårsbehandleVedMigrering, settVilkårsbehandleVedMigrering] =
        useState<EVilkårsbehandleBarnValg>(EVilkårsbehandleBarnValg.IKKE_VALGT);

    useEffect(() => {
        axiosRequest<NyeBarnSidenForrigeBehandling, null>({
            url: `familie-ef-sak/api/behandling/barn/fagsak/${fagsakId}`,
        }).then((response: RessursSuksess<NyeBarnSidenForrigeBehandling> | RessursFeilet) => {
            settNyeBarnSidenForrigeBehandling(response);
        });
    }, [axiosRequest, fagsakId]);

    useEffect(() => {
        settVilkårsbehandleVedMigrering(EVilkårsbehandleBarnValg.IKKE_VALGT);
    }, [valgtBehandlingsårsak]);

    const erGOmregning = valgtBehandlingsårsak === Behandlingsårsak.G_OMREGNING;
    const måTaStillingTilBarn =
        nyeBarnSidenForrigeBehandling.status === RessursStatus.SUKSESS &&
        !nyeBarnSidenForrigeBehandling.data.harBarnISisteIverksatteBehandling &&
        !erGOmregning;

    const skalTaMedAlleBarn =
        (!måTaStillingTilBarn ||
            vilkårsbehandleVedMigrering === EVilkårsbehandleBarnValg.VILKÅRSBEHANDLE) &&
        !erGOmregning;

    const skalViseÅrsak = (behandlingsårsak: Behandlingsårsak) => {
        switch (behandlingsårsak) {
            case Behandlingsårsak.KORRIGERING_UTEN_BREV:
                return skalViseValgmulighetForKorrigering;
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
                                />
                                {skalViseNyeBarnValg && (
                                    <NyeBarn
                                        nyeBarnSidenForrigeBehandling={
                                            nyeBarnSidenForrigeBehandling.nyeBarn
                                        }
                                        måTaStillingTilBarn={måTaStillingTilBarn}
                                        vilkårsbehandleNyeBarn={vilkårsbehandleVedMigrering}
                                        settVilkårsbehandleNyeBarn={settVilkårsbehandleVedMigrering}
                                    />
                                )}

                                <KnappeWrapper>
                                    <StyledHovedknapp
                                        onClick={() => {
                                            const kanStarteRevurdering = !!(
                                                valgtBehandlingsårsak &&
                                                valgtDato &&
                                                !(
                                                    harNyeBarnSidenForrigeBehandling &&
                                                    måTaStillingTilBarn &&
                                                    vilkårsbehandleVedMigrering ===
                                                        EVilkårsbehandleBarnValg.IKKE_VALGT
                                                )
                                            );
                                            if (kanStarteRevurdering) {
                                                lagRevurdering({
                                                    fagsakId,
                                                    barn: skalTaMedAlleBarn
                                                        ? nyeBarnSidenForrigeBehandling.nyeBarn
                                                        : [],
                                                    behandlingsårsak: valgtBehandlingsårsak,
                                                    kravMottatt: valgtDato,
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
