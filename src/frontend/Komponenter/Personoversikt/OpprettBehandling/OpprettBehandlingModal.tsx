import React, { Dispatch, useState } from 'react';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import styled from 'styled-components';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { EToast } from '../../../App/typer/toast';
import { RevurderingInnhold } from '../../../App/typer/revurderingstype';
import { Fagsak } from '../../../App/typer/fagsak';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';
import { utledKanOppretteRevurdering } from '../utils';
import { ModalAlerts } from './ModalAlerts';
import { BehandlingstypeSelect } from './BehandlingstypeSelect';
import { BehandlingstypeSwitch } from './BehandlingstypeSwitch';
import { OpprettKlagebehandlingRequest } from '../../../App/typer/klage';

const FormContainer = styled.div`
    width: 33.5rem;
    padding-top: 1rem;
    padding-bottom: 1rem;

    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

interface Props {
    visModal: boolean;
    settVisModal: (bool: boolean) => void;
    fagsak: Fagsak;
    hentTilbakekrevinger: Dispatch<void>;
    hentKlageBehandlinger: Dispatch<void>;
    harÅpenKlage: boolean;
}

export const OpprettBehandlingModal: React.FunctionComponent<Props> = ({
    visModal,
    settVisModal,
    fagsak,
    hentTilbakekrevinger,
    hentKlageBehandlinger,
    harÅpenKlage,
}) => {
    const [feilmelding, settFeilmelding] = useState<string>('');
    const [valgtBehandlingstype, settValgtBehandlingstype] = useState<Behandlingstype>();

    const [senderInnBehandling, settSenderInnBehandling] = useState<boolean>(false);
    const { axiosRequest, settToast } = useApp();
    const navigate = useNavigate();
    const { harKunHenlagteBehandlinger, kanOppretteRevurdering } =
        utledKanOppretteRevurdering(fagsak);

    const opprettTilbakekreving = () => {
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
                        settFeilmelding(response.frontendFeilmelding || response.melding);
                    }
                })
                .finally(() => {
                    settSenderInnBehandling(false);
                });
        }
    };

    const opprettRevurdering = (revurderingInnhold: RevurderingInnhold) => {
        settFeilmelding('');

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
                        settFeilmelding(response.frontendFeilmelding || response.melding);
                    }
                })
                .finally(() => {
                    settSenderInnBehandling(false);
                });
        }
    };

    const opprettKlagebehandling = (data: OpprettKlagebehandlingRequest) => {
        settFeilmelding('');

        if (!senderInnBehandling) {
            settSenderInnBehandling(true);
            axiosRequest<Ressurs<void>, OpprettKlagebehandlingRequest>({
                method: 'POST',
                url: `/familie-ef-sak/api/klage/fagsak/${fagsak.id}`,
                data: data,
            })
                .then((response) => {
                    if (response.status === RessursStatus.SUKSESS) {
                        hentKlageBehandlinger();
                        settVisModal(false);
                        settToast(EToast.KLAGE_OPPRETTET);
                    } else {
                        settFeilmelding(response.frontendFeilmelding || response.melding);
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
            <ModalAlerts
                harÅpenKlage={harÅpenKlage}
                kanOppretteRevurdering={kanOppretteRevurdering}
                harKunHenlagteBehandlinger={harKunHenlagteBehandlinger}
            />
            <FormContainer>
                <BehandlingstypeSelect
                    valgtBehandlingstype={valgtBehandlingstype}
                    settValgtBehandlingstype={settValgtBehandlingstype}
                    settFeilmelding={settFeilmelding}
                    kanOppretteRevurdering={kanOppretteRevurdering}
                />
                <BehandlingstypeSwitch
                    fagsak={fagsak}
                    valgtBehandlingstype={valgtBehandlingstype}
                    settVisModal={settVisModal}
                    opprettRevurdering={opprettRevurdering}
                    opprettTilbakekreving={opprettTilbakekreving}
                    opprettKlagebehandling={opprettKlagebehandling}
                />
                {feilmelding && <AlertError>{feilmelding}</AlertError>}
            </FormContainer>
        </ModalWrapper>
    );
};
