import React, { Dispatch, SetStateAction } from 'react';
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
import { Ressurs } from '../../App/typer/ressurs';
import { BarnForRevurdering } from '../../App/typer/revurderingstype';
import { StyledSelect } from './LagBehandlingModal';
import { Normaltekst } from 'nav-frontend-typografi';

const StyledFamilieDatovelgder = styled(FamilieDatovelger)`
    margin-top: 2rem;
`;

const StyledCheckboxGruppe = styled(CheckboxGruppe)`
    margin-top: 2rem;
`;

const TekstForCheckboxGruppe = styled(Normaltekst)`
    margin-bottom: 1rem;
`;

interface IProps {
    kanLeggeTilNyeBarnPåRevurdering: boolean;
    nyeBarnSidenForrigeBehandling: Ressurs<BarnForRevurdering[]>;
    valgtBehandlingsårsak: Behandlingsårsak | undefined;
    settValgtBehandlingsårsak: Dispatch<SetStateAction<Behandlingsårsak | undefined>>;
    valgtBehandlingstype: Behandlingstype;
    skalViseValgmulighetForSanksjon: boolean;
    settValgtDato: Dispatch<SetStateAction<string | undefined>>;
    valgtDato: string | undefined;
    settValgtBarn: Dispatch<SetStateAction<BarnForRevurdering[]>>;
}

export const LagRevurdering: React.FunctionComponent<IProps> = ({
    kanLeggeTilNyeBarnPåRevurdering,
    nyeBarnSidenForrigeBehandling,
    valgtBehandlingsårsak,
    settValgtBehandlingsårsak,
    valgtBehandlingstype,
    skalViseValgmulighetForSanksjon,
    settValgtDato,
    valgtDato,
    settValgtBarn,
}) => {
    return (
        <DataViewer response={{ nyeBarnSidenForrigeBehandling }}>
            {({ nyeBarnSidenForrigeBehandling }) => {
                const harNyeBarnSidenForrigeBehandling = nyeBarnSidenForrigeBehandling.length > 0;
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
                                            behandlingsårsak !== Behandlingsårsak.SANKSJON_1_MND ||
                                            skalViseValgmulighetForSanksjon
                                    )
                                    .map((behandlingsårsak: Behandlingsårsak, index: number) => (
                                        <option key={index} value={behandlingsårsak}>
                                            {behandlingsårsakTilTekst[behandlingsårsak]}
                                        </option>
                                    ))}
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
                            <StyledCheckboxGruppe legend={'Velg barn for revurderingen'}>
                                <TekstForCheckboxGruppe>
                                    Barna listet opp nedenfor har ikke vært en del av behandlingen
                                    tidligere. Gjør en vurdering på hvorvidt disse skal inkluderes i
                                    den nye revurderingen og velg de som er relevante.
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
                    </>
                );
            }}
        </DataViewer>
    );
};
