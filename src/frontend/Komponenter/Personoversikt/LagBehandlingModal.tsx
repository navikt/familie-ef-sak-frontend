import React, { useState } from 'react';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import {
    Behandlingsårsak,
    behandlingsårsaker,
    behandlingsårsakTilTekst,
} from '../../App/typer/Behandlingsårsak';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import UIModalWrapper from '../../Felles/Modal/UIModalWrapper';
import styled from 'styled-components';
import { Select } from 'nav-frontend-skjema';
import { FamilieDatovelger } from '@navikt/familie-form-elements';
import { Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { RevurderingInnhold } from '../../App/typer/revurderingstype';
import { useNavigate } from 'react-router-dom';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';
import { EToast } from '../../App/typer/toast';

const StyledSelect = styled(Select)`
    margin-top: 2rem;
`;

const KnappeWrapper = styled.div`
    margin-top: 2rem;
    margin-bottom: 1rem;
`;

const StyledFamilieDatovelgder = styled(FamilieDatovelger)`
    margin-top: 2rem;
`;

const StyledHovedknapp = styled(Hovedknapp)`
    margin-right: 1rem;
`;

interface IProps {
    visModal: boolean;
    settVisModal: (bool: boolean) => void;
    fagsakId: string;
    settHentTilbakekrevinger: (bool: boolean) => void;
}

const LagBehandlingModal: React.FunctionComponent<IProps> = ({
    visModal,
    settVisModal,
    fagsakId,
    settHentTilbakekrevinger,
}) => {
    const { toggles } = useToggles();
    const skalViseValgmulighetForSanksjon = toggles[ToggleName.visValgmulighetForSanksjon];
    const [feilmeldingModal, settFeilmeldingModal] = useState<string>();
    const [valgtBehandlingstype, settValgtBehandlingstype] = useState<Behandlingstype>();
    const [valgtBehandlingsårsak, settValgtBehandlingsårsak] = useState<Behandlingsårsak>();
    const [valgtDato, settValgtDato] = useState<string>();
    const [senderInnBehandling, settSenderInnBehandling] = useState<boolean>(false);
    const kanStarteRevurdering = (): boolean => {
        return !!(valgtBehandlingstype && valgtBehandlingsårsak && valgtDato);
    };
    const { axiosRequest, settToast } = useApp();
    const navigate = useNavigate();

    const opprettBehandling = () => {
        settFeilmeldingModal('');

        if (valgtBehandlingstype === Behandlingstype.TILBAKEKREVING) {
            settSenderInnBehandling(true);

            axiosRequest<Ressurs<void>, null>({
                method: 'POST',
                url: `/familie-ef-sak/api/tilbakekreving/fagsak/{fagsakId}/opprett-tilbakekreving`,
            })
                .then((response) => {
                    if (response.status === RessursStatus.SUKSESS) {
                        settHentTilbakekrevinger(true);
                        settVisModal(false);
                        settToast(EToast.TILBAKEKREVING_OPPRETTET);
                    } else {
                        settFeilmeldingModal(response.frontendFeilmelding || response.melding);
                    }
                })
                .finally(() => {
                    settSenderInnBehandling(false);
                });
        }

        if (valgtBehandlingstype === Behandlingstype.REVURDERING) {
            if (!kanStarteRevurdering()) {
                settFeilmeldingModal('Vennligst fyll ut alle felter');
            } else {
                settSenderInnBehandling(true);
                const revurderingInnhold: RevurderingInnhold = {
                    fagsakId: fagsakId,
                    behandlingsårsak: valgtBehandlingsårsak as Behandlingsårsak,
                    kravMottatt: valgtDato as string,
                };
                axiosRequest<Ressurs<void>, RevurderingInnhold>({
                    method: 'POST',
                    url: `/familie-ef-sak/api/revurdering/${fagsakId}`,
                    data: revurderingInnhold,
                })
                    .then((response) => {
                        if (response.status === RessursStatus.SUKSESS) {
                            navigate(`/behandling/${response.data}`);
                        } else {
                            settFeilmeldingModal(response.frontendFeilmelding || response.melding);
                        }
                    })
                    .finally(() => {
                        settSenderInnBehandling(false);
                    });
            }
        }
    };

    return (
        <UIModalWrapper
            modal={{
                tittel: 'Opprett ny behandling',
                lukkKnapp: true,
                visModal: visModal,
                onClose: () => settVisModal(false),
            }}
        >
            <StyledSelect
                label="Behandlingstype"
                value={valgtBehandlingstype || ''}
                onChange={(e) => {
                    settValgtBehandlingstype(e.target.value as Behandlingstype);
                    settValgtBehandlingsårsak(undefined);
                    settFeilmeldingModal(undefined);
                }}
            >
                <option value="">Velg</option>
                <option value={Behandlingstype.REVURDERING}>Revurdering</option>
                <option value={Behandlingstype.TILBAKEKREVING}>Tilbakekreving</option>
            </StyledSelect>

            {valgtBehandlingstype === Behandlingstype.REVURDERING && (
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
                </>
            )}

            {valgtBehandlingstype && (
                <KnappeWrapper>
                    <StyledHovedknapp
                        onClick={() => {
                            if (!senderInnBehandling) {
                                opprettBehandling();
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
            )}
            {feilmeldingModal && <AlertStripeFeil>{feilmeldingModal}</AlertStripeFeil>}
        </UIModalWrapper>
    );
};

export default LagBehandlingModal;
