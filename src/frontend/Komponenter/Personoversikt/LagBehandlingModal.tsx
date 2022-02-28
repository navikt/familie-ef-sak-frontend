import React, { Dispatch, useState } from 'react';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import UIModalWrapper from '../../Felles/Modal/UIModalWrapper';
import styled from 'styled-components';
import { Select } from 'nav-frontend-skjema';
import { Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';
import { EToast } from '../../App/typer/toast';
import { LagRevurdering } from './LagRevurdering';
import { RevurderingInnhold } from '../../App/typer/revurderingstype';

export const StyledSelect = styled(Select)`
    margin-top: 2rem;
`;

export const KnappeWrapper = styled.div`
    margin-top: 2rem;
    margin-bottom: 1rem;
`;

export const StyledHovedknapp = styled(Hovedknapp)`
    margin-right: 1rem;
`;

interface IProps {
    visModal: boolean;
    settVisModal: (bool: boolean) => void;
    fagsakId: string;
    hentTilbakekrevinger: Dispatch<void>;
}

const LagBehandlingModal: React.FunctionComponent<IProps> = ({
    visModal,
    settVisModal,
    fagsakId,
    hentTilbakekrevinger,
}) => {
    const { toggles } = useToggles();

    const visOpprettTilbakekreving = toggles[ToggleName.visOpprettTilbakekreving];
    const [feilmeldingModal, settFeilmeldingModal] = useState<string>();
    const [valgtBehandlingstype, settValgtBehandlingstype] = useState<Behandlingstype>();

    const [senderInnBehandling, settSenderInnBehandling] = useState<boolean>(false);
    const { axiosRequest, settToast } = useApp();
    const navigate = useNavigate();

    const opprettTilbakekrevingBehandling = () => {
        if (valgtBehandlingstype === Behandlingstype.TILBAKEKREVING) {
            settSenderInnBehandling(true);

            axiosRequest<Ressurs<void>, null>({
                method: 'POST',
                url: `/familie-ef-sak/api/tilbakekreving/fagsak/${fagsakId}/opprett-tilbakekreving`,
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

        settSenderInnBehandling(true);
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
                    settFeilmeldingModal(undefined);
                }}
            >
                <option value="">Velg</option>
                <option value={Behandlingstype.REVURDERING}>Revurdering</option>
                <option disabled={!visOpprettTilbakekreving} value={Behandlingstype.TILBAKEKREVING}>
                    Tilbakekreving
                </option>
            </StyledSelect>

            {valgtBehandlingstype === Behandlingstype.REVURDERING && (
                <LagRevurdering
                    fagsakId={fagsakId}
                    valgtBehandlingstype={valgtBehandlingstype}
                    lagRevurdering={lagRevurdering}
                    settVisModal={settVisModal}
                />
            )}

            {valgtBehandlingstype === Behandlingstype.TILBAKEKREVING && (
                <KnappeWrapper>
                    <StyledHovedknapp
                        onClick={() => {
                            if (!senderInnBehandling) {
                                opprettTilbakekrevingBehandling();
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
