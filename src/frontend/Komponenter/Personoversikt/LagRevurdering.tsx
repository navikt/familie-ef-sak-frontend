import React, { useEffect, useState } from 'react';
import {
    Behandlingsårsak,
    behandlingsårsaker,
    behandlingsårsakTilTekst,
} from '../../App/typer/Behandlingsårsak';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { FamilieDatovelger } from '@navikt/familie-form-elements';
import { byggTomRessurs, Ressurs, RessursFeilet, RessursSuksess } from '../../App/typer/ressurs';
import { BarnForRevurdering, RevurderingInnhold } from '../../App/typer/revurderingstype';
import { StyledHovedknapp, StyledSelect } from './LagBehandlingModal';
import { Normaltekst } from 'nav-frontend-typografi';
import { ToggleName } from '../../App/context/toggles';
import { useToggles } from '../../App/context/TogglesContext';
import { useApp } from '../../App/context/AppContext';
import { Flatknapp } from 'nav-frontend-knapper';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

const StyledFamilieDatovelgder = styled(FamilieDatovelger)`
    margin-top: 2rem;
    margin-bottom: 17.5rem;
`;

const StyledCheckboxGruppe = styled(CheckboxGruppe)`
    margin-top: 2rem;
`;

const TekstForCheckboxGruppe = styled(Normaltekst)`
    margin-bottom: 1rem;
`;

const FlexDiv = styled.div`
    display: flex;
    justify-content: space-between;
`;

const KnappeWrapper = styled.div`
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
    const [valgtBarn, settValgtBarn] = useState<BarnForRevurdering[]>([]);

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
                            {kanLeggeTilNyeBarnPåRevurdering && harNyeBarnSidenForrigeBehandling && (
                                <StyledCheckboxGruppe legend={'Velg barn for revurderingen'}>
                                    <TekstForCheckboxGruppe>
                                        Barna listet opp nedenfor har ikke vært en del av
                                        behandlingen tidligere. Gjør en vurdering på hvorvidt disse
                                        skal inkluderes i den nye revurderingen og velg de som er
                                        relevante.
                                    </TekstForCheckboxGruppe>
                                    {nyeBarnSidenForrigeBehandling.map((nyttBarn) => {
                                        return (
                                            <Checkbox
                                                key={nyttBarn.personIdent}
                                                onClick={(e) => {
                                                    if ((e.target as HTMLInputElement).checked) {
                                                        settValgtBarn((prevState) => [
                                                            ...prevState,
                                                            nyttBarn,
                                                        ]);
                                                    } else {
                                                        settValgtBarn((prevState) =>
                                                            prevState.filter(
                                                                (barn) =>
                                                                    barn.personIdent !==
                                                                    nyttBarn.personIdent
                                                            )
                                                        );
                                                    }
                                                }}
                                                label={`${nyttBarn.navn} (${nyttBarn.personIdent})`}
                                            />
                                        );
                                    })}
                                </StyledCheckboxGruppe>
                            )}
                            <FlexDiv>
                                <StyledFamilieDatovelgder
                                    id={'krav-mottatt'}
                                    label={'Krav mottatt'}
                                    onChange={(dato) => {
                                        settValgtDato(dato as string);
                                    }}
                                    valgtDato={valgtDato}
                                />
                                <KnappeWrapper>
                                    <StyledHovedknapp
                                        onClick={() => {
                                            const kanStarteRevurdering = !!(
                                                valgtBehandlingsårsak && valgtDato
                                            );
                                            if (kanStarteRevurdering) {
                                                lagRevurdering({
                                                    fagsakId,
                                                    barn: valgtBarn,
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
