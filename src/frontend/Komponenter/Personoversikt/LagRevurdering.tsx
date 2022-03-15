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
import { BodyShort, Label, RadioGroup, Radio } from '@navikt/ds-react';
import { fødselsdatoTilAlder } from '../../App/utils/utils';
import { Behandling } from '../../App/typer/fagsak';

enum EVilkårsbehandleBarnValg {
    VILKÅRSBEHANDLE = 'VILKÅRSBEHANDLE',
    IKKE_VILKÅRSBEHANDLE = 'IKKE_VILKÅRSBEHANDLE',
    IKKE_VALGT = 'IKKE_VALGT',
}

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

const StyledRadioGroup = styled(RadioGroup)`
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
    behandlinger: Behandling[];
}

export const LagRevurdering: React.FunctionComponent<IProps> = ({
    fagsakId,
    valgtBehandlingstype,
    lagRevurdering,
    settVisModal,
    behandlinger,
}) => {
    const { toggles } = useToggles();
    const { axiosRequest } = useApp();

    const harMigrering = behandlinger.some(
        (behandling) => behandling.behandlingsårsak === Behandlingsårsak.SØKNAD
    );

    const kanLeggeTilNyeBarnPåRevurdering = toggles[ToggleName.kanLeggeTilNyeBarnPaaRevurdering];
    const skalViseValgmulighetForSanksjon = toggles[ToggleName.visValgmulighetForSanksjon];
    const [feilmeldingModal, settFeilmeldingModal] = useState<string>();

    const [nyeBarnSidenForrigeBehandling, settNyeBarnSidenForrigeBehandling] = useState<
        Ressurs<BarnForRevurdering[]>
    >(byggTomRessurs());
    const [valgtBehandlingsårsak, settValgtBehandlingsårsak] = useState<Behandlingsårsak>();
    const [valgtDato, settValgtDato] = useState<string>();
    const [vilkårsbehandleVedMigrering, settVilkårsbehandleVedMigrering] =
        useState<EVilkårsbehandleBarnValg>(EVilkårsbehandleBarnValg.IKKE_VALGT);

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
                            {kanLeggeTilNyeBarnPåRevurdering &&
                                harNyeBarnSidenForrigeBehandling &&
                                !harMigrering && (
                                    <NyeBarn>
                                        <Label>Barn som ikke tidligere er behandlet</Label>
                                        <BodyShort>
                                            Barna listet opp nedenfor har blitt lagt til i
                                            Folkeregisteret etter at saken sist ble vurdert. De blir
                                            nå tatt med inn i behandlingen og saksbehandler må
                                            vurdere om vilkårene skal vurderes på nytt.
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
                            {kanLeggeTilNyeBarnPåRevurdering &&
                                harNyeBarnSidenForrigeBehandling &&
                                harMigrering && (
                                    <NyeBarn>
                                        <Label>Barn som ikke tidligere er behandlet</Label>
                                        <BodyShort>
                                            Da dette er en migrert sak er brukerens barn ikke
                                            tidligere vilkårsbehandlet i EF Sak. Vurder om det er
                                            behov for å vilkårsbehandle barna i EF Sak, eller om det
                                            holder å vise til tidligere vurdering i Gosys. Merk at
                                            om brukerens barn ikke skal vilkårsbehandles i EF Sak
                                            vil de heller ikke vises i behandlingen.
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
                                        <StyledRadioGroup legend="" size="medium">
                                            <Radio
                                                value={EVilkårsbehandleBarnValg.VILKÅRSBEHANDLE}
                                                checked={
                                                    vilkårsbehandleVedMigrering ===
                                                    EVilkårsbehandleBarnValg.VILKÅRSBEHANDLE
                                                }
                                                onChange={(e) => {
                                                    settVilkårsbehandleVedMigrering(e.target.value);
                                                }}
                                            >
                                                Vilkårsbehandle barn i EF Sak
                                            </Radio>
                                            <Radio
                                                value={
                                                    EVilkårsbehandleBarnValg.IKKE_VILKÅRSBEHANDLE
                                                }
                                                checked={
                                                    vilkårsbehandleVedMigrering ===
                                                    EVilkårsbehandleBarnValg.IKKE_VILKÅRSBEHANDLE
                                                }
                                                onChange={(e) => {
                                                    settVilkårsbehandleVedMigrering(e.target.value);
                                                }}
                                            >
                                                Ikke vilkårsbehandle barn i EF Sak
                                            </Radio>
                                        </StyledRadioGroup>
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
                                        disabled={
                                            harMigrering &&
                                            vilkårsbehandleVedMigrering ===
                                                EVilkårsbehandleBarnValg.IKKE_VALGT
                                        }
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
