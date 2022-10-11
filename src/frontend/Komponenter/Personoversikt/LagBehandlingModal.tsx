import React, { Dispatch, useState } from 'react';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import styled from 'styled-components';
import { Select } from 'nav-frontend-skjema';
import { Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { EToast } from '../../App/typer/toast';
import { LagRevurdering } from './Revurdering/LagRevurdering';
import { RevurderingInnhold } from '../../App/typer/revurderingstype';
import { Fagsak } from '../../App/typer/fagsak';
import OpprettKlage from './Klage/OpprettKlage';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';
import { ModalWrapper } from '../../Felles/Modal/ModalWrapper';
import { Alert, Button } from '@navikt/ds-react';

export const StyledSelect = styled(Select)`
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: 33.5rem;
`;

export const KnappeWrapper = styled.div`
    margin-top: 2rem;
    margin-bottom: 1rem;
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
}

const LagBehandlingModal: React.FunctionComponent<IProps> = ({
    visModal,
    settVisModal,
    fagsak,
    hentTilbakekrevinger,
    hentKlageBehandlinger,
    kanStarteRevurdering,
}) => {
    const { toggles } = useToggles();
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

    const opprettKlage = (behandlingId: string, mottattDato: string) => {
        settFeilmeldingModal('');

        if (!senderInnBehandling) {
            settSenderInnBehandling(true);
            axiosRequest<Ressurs<void>, { mottattDato: string }>({
                method: 'POST',
                url: `/familie-ef-sak/api/klage/${behandlingId}`,
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
            lukkKnappDisabled={false}
            hovedKnappDisabled={false}
            lukkKnappTekst={'Avbryt'}
            hovedKnappTekst={'Bekreft'}
            skjulKnapper={true}
        >
            {!kanStarteRevurdering && (
                <Alert variant={'info'}>
                    Merk at det er ikke mulig å opprette en revurdering da det allerede finnes en
                    åpen behandling på fagsaken. Det er kun mulig å opprette en tilbakekreving.
                </Alert>
            )}
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
                {toggles[ToggleName.visOpprettKlage] && (
                    <option value={Behandlingstype.KLAGE}>Klage</option>
                )}
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
                <OpprettKlage
                    fagsak={fagsak}
                    opprettKlage={opprettKlage}
                    settVisModal={settVisModal}
                />
            )}
            {feilmeldingModal && <AlertStripeFeil>{feilmeldingModal}</AlertStripeFeil>}
        </ModalWrapper>
    );
};

export default LagBehandlingModal;
