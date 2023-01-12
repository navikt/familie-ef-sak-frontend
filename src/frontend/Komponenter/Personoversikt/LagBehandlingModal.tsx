import React, { Dispatch, useState } from 'react';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import styled from 'styled-components';
import { Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { EToast } from '../../App/typer/toast';
import { LagRevurdering } from './Revurdering/LagRevurdering';
import { RevurderingInnhold } from '../../App/typer/revurderingstype';
import { Fagsak } from '../../App/typer/fagsak';
import OpprettKlage from './Klage/OpprettKlage';
import { ModalWrapper } from '../../Felles/Modal/ModalWrapper';
import { Alert, Button, Select } from '@navikt/ds-react';
import { AlertError } from '../../Felles/Visningskomponenter/Alerts';

export const StyledSelect = styled(Select)`
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: 33.5rem;
`;

const Alerts = styled.div`
    > :not(:first-child) {
        margin-top: 1rem;
    }
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
    visModal: boolean;
    settVisModal: (bool: boolean) => void;
    fagsak: Fagsak;
    hentTilbakekrevinger: Dispatch<void>;
    hentKlageBehandlinger: Dispatch<void>;
    kanStarteRevurdering: boolean;
    kanOppretteKlagebehandling: boolean;
}

const LagBehandlingModal: React.FunctionComponent<IProps> = ({
    visModal,
    settVisModal,
    fagsak,
    hentTilbakekrevinger,
    hentKlageBehandlinger,
    kanStarteRevurdering,
    kanOppretteKlagebehandling,
}) => {
    const [feilmeldingModal, settFeilmeldingModal] = useState<string>();
    const [valgtBehandlingstype, settValgtBehandlingstype] = useState<Behandlingstype>();

    const [senderInnBehandling, settSenderInnBehandling] = useState<boolean>(false);
    const { axiosRequest, settToast } = useApp();
    const navigate = useNavigate();

    const opprettTilbakekrevingBehandling = () => {
        if (valgtBehandlingstype === Behandlingstype.TILBAKEKREVING && !senderInnBehandling) {
            settSenderInnBehandling(true);
            axiosRequest<Ressurs<void>, null>({
                method: 'POST',
                url: `/familie-ef-sak/api/tilbakekreving/fagsak/${fagsak.id}/opprett-tilbakekreving`,
            })
                .then((response) => {
                    if (response.status === RessursStatus.SUKSESS) {
                        hentTilbakekrevinger();
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
    };

    const lagRevurdering = (revurderingInnhold: RevurderingInnhold) => {
        settFeilmeldingModal('');

        if (!senderInnBehandling) {
            settSenderInnBehandling(true);
            axiosRequest<Ressurs<void>, RevurderingInnhold>({
                method: 'POST',
                url: `/familie-ef-sak/api/revurdering/${fagsak.id}`,
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
    };

    const opprettKlage = (mottattDato: string) => {
        settFeilmeldingModal('');

        if (!senderInnBehandling) {
            settSenderInnBehandling(true);
            axiosRequest<Ressurs<void>, { mottattDato: string }>({
                method: 'POST',
                url: `/familie-ef-sak/api/klage/fagsak/${fagsak.id}`,
                data: { mottattDato },
            })
                .then((response) => {
                    if (response.status === RessursStatus.SUKSESS) {
                        hentKlageBehandlinger();
                        settVisModal(false);
                        settToast(EToast.KLAGE_OPPRETTET);
                    } else {
                        settFeilmeldingModal(response.frontendFeilmelding || response.melding);
                    }
                })
                .finally(() => {
                    settSenderInnBehandling(false);
                });
        }
    };

    return (
        <ModalWrapper
            tittel={'Opprett ny behandling'}
            visModal={visModal}
            onClose={() => settVisModal(false)}
        >
            <Alerts>
                {!kanStarteRevurdering && (
                    <Alert variant={'info'}>
                        Merk at det er ikke mulig å opprette en revurdering da det allerede finnes
                        en åpen behandling på fagsaken. Det er kun mulig å opprette en
                        tilbakekreving.
                    </Alert>
                )}
                {!kanOppretteKlagebehandling && (
                    <Alert variant={'info'}>
                        Merk at det er ikke mulig å opprette en klagebehandling da det allerede
                        finnes en åpen klagebehandling på fagsaken
                    </Alert>
                )}
            </Alerts>
            <StyledSelect
                label="Behandlingstype"
                value={valgtBehandlingstype || ''}
                onChange={(e) => {
                    settValgtBehandlingstype(e.target.value as Behandlingstype);
                    settFeilmeldingModal(undefined);
                }}
            >
                <option value="">Velg</option>
                {kanStarteRevurdering && (
                    <option value={Behandlingstype.REVURDERING}>Revurdering</option>
                )}
                <option value={Behandlingstype.TILBAKEKREVING}>Tilbakekreving</option>
                {kanOppretteKlagebehandling && <option value={Behandlingstype.KLAGE}>Klage</option>}
            </StyledSelect>
            {valgtBehandlingstype === Behandlingstype.REVURDERING && (
                <LagRevurdering
                    fagsak={fagsak}
                    valgtBehandlingstype={valgtBehandlingstype}
                    lagRevurdering={lagRevurdering}
                    settVisModal={settVisModal}
                />
            )}
            {valgtBehandlingstype === Behandlingstype.TILBAKEKREVING && (
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
                        onClick={() => {
                            if (!senderInnBehandling) {
                                opprettTilbakekrevingBehandling();
                            }
                        }}
                    >
                        Opprett
                    </ModalKnapp>
                </ButtonContainer>
            )}
            {valgtBehandlingstype === Behandlingstype.KLAGE && (
                <OpprettKlage opprettKlage={opprettKlage} settVisModal={settVisModal} />
            )}
            {feilmeldingModal && <AlertError>{feilmeldingModal}</AlertError>}
        </ModalWrapper>
    );
};

export default LagBehandlingModal;
