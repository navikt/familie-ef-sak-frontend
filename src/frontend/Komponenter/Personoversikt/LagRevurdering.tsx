import React, { useEffect, useState } from 'react';
import {
    Behandlingsårsak,
    behandlingsårsaker,
    behandlingsårsakTilTekst,
} from '../../App/typer/Behandlingsårsak';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { FamilieDatovelger } from '@navikt/familie-form-elements';
import { byggTomRessurs, Ressurs, RessursFeilet, RessursSuksess } from '../../App/typer/ressurs';
import { BarnForRevurdering, RevurderingInnhold } from '../../App/typer/revurderingstype';
import { StyledHovedknapp, StyledSelect } from './LagBehandlingModal';
import { ToggleName } from '../../App/context/toggles';
import { useToggles } from '../../App/context/TogglesContext';
import { useApp } from '../../App/context/AppContext';
import { Flatknapp } from 'nav-frontend-knapper';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { BodyShort, Label } from '@navikt/ds-react';
import { fødselsdatoTilAlder } from '../../App/utils/utils';

const StyledFamilieDatovelgder = styled(FamilieDatovelger)`
    margin-top: 2rem;
`;

const NyeBarn = styled.div`
    margin-top: 2rem;
`;

const FlexDiv = styled.div`
    display: flex;
    justify-content: space-between;
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

    const kanLeggeTilNyeBarnPåRevurdering = toggles[ToggleName.kanLeggeTilNyeBarnPaaRevurdering];
    const skalViseValgmulighetForSanksjon = toggles[ToggleName.visValgmulighetForSanksjon];
    const [feilmeldingModal, settFeilmeldingModal] = useState<string>();

    const [nyeBarnSidenForrigeBehandling, settNyeBarnSidenForrigeBehandling] = useState<
        Ressurs<BarnForRevurdering[]>
    >(byggTomRessurs());
    const [valgtBehandlingsårsak, settValgtBehandlingsårsak] = useState<Behandlingsårsak>();
    const [valgtDato, settValgtDato] = useState<string>();

    useEffect(() => {
        axiosRequest<BarnForRevurdering[], null>({
            url: `familie-ef-sak/api/behandling/barn/fagsak/${fagsakId}/nye-barn`,
        }).then((response: RessursSuksess<BarnForRevurdering[]> | RessursFeilet) => {
            settNyeBarnSidenForrigeBehandling(response);
        });
    }, [axiosRequest, fagsakId]);

    return (
        <>
            <DataViewer response={{ nyeBarnSidenForrigeBehandling }}>
                {({ nyeBarnSidenForrigeBehandling }) => {
                    const harNyeBarnSidenForrigeBehandling =
                        nyeBarnSidenForrigeBehandling.length > 0;

                    console.log('NYE', nyeBarnSidenForrigeBehandling);
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
                                        .filter(
                                            (behandlingsårsak) =>
                                                behandlingsårsak !==
                                                    Behandlingsårsak.SANKSJON_1_MND ||
                                                skalViseValgmulighetForSanksjon
                                        )
                                        .map(
                                            (behandlingsårsak: Behandlingsårsak, index: number) => (
                                                <option key={index} value={behandlingsårsak}>
                                                    {behandlingsårsakTilTekst[behandlingsårsak]}
                                                </option>
                                            )
                                        )}
                            </StyledSelect>
                            <StyledFamilieDatovelgder
                                id={'krav-mottatt'}
                                label={'Krav mottatt'}
                                onChange={(dato) => {
                                    settValgtDato(dato as string);
                                }}
                                valgtDato={valgtDato}
                            />
                            {kanLeggeTilNyeBarnPåRevurdering && harNyeBarnSidenForrigeBehandling && (
                                <NyeBarn>
                                    <Label>Barn som ikke tidligere er behandlet</Label>
                                    <BodyShort>
                                        Barna listet opp nedenfor har blitt lagt til i
                                        Folkeregisteret etter at saken sist ble vurdert. De blir nå
                                        tatt med inn i behandlingen og saksbehandler må vurdere om
                                        vilkårene skal vurderes på nytt.
                                    </BodyShort>
                                    <ul>
                                        {nyeBarnSidenForrigeBehandling?.map((nyttBarn) => {
                                            return (
                                                <li>
                                                    {nyttBarn.navn} (
                                                    {fødselsdatoTilAlder(nyttBarn.fødselsdato)},{' '}
                                                    {nyttBarn.personIdent})
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </NyeBarn>
                            )}
                            <FlexDiv>
                                <KnappeWrapper>
                                    <StyledHovedknapp
                                        onClick={() => {
                                            const kanStarteRevurdering = !!(
                                                valgtBehandlingsårsak && valgtDato
                                            );
                                            if (kanStarteRevurdering) {
                                                lagRevurdering({
                                                    fagsakId,
                                                    barn: nyeBarnSidenForrigeBehandling,
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
