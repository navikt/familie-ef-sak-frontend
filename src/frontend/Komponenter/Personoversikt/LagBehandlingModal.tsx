import React, { useEffect, useState } from 'react';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import { Behandlingsårsak } from '../../App/typer/Behandlingsårsak';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import UIModalWrapper from '../../Felles/Modal/UIModalWrapper';
import styled from 'styled-components';
import { Select } from 'nav-frontend-skjema';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { BarnForRevurdering, RevurderingInnhold } from '../../App/typer/revurderingstype';
import { useNavigate } from 'react-router-dom';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';
import { EToast } from '../../App/typer/toast';
import { LagRevurdering } from './LagRevurdering';

export const StyledSelect = styled(Select)`
    margin-top: 2rem;
`;

const KnappeWrapper = styled.div`
    margin-top: 2rem;
    margin-bottom: 1rem;
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
    const kanLeggeTilNyeBarnPåRevurdering = toggles[ToggleName.kanLeggeTilNyeBarnPaaRevurdering];
    const visOpprettTilbakekreving = toggles[ToggleName.visOpprettTilbakekreving];
    const [feilmeldingModal, settFeilmeldingModal] = useState<string>();
    const [valgtBehandlingstype, settValgtBehandlingstype] = useState<Behandlingstype>();
    const [valgtBehandlingsårsak, settValgtBehandlingsårsak] = useState<Behandlingsårsak>();
    const [valgtDato, settValgtDato] = useState<string>();
    const [valgtBarn, settValgtBarn] = useState<BarnForRevurdering[]>([]);
    const [senderInnBehandling, settSenderInnBehandling] = useState<boolean>(false);
    const kanStarteRevurdering = (): boolean => {
        return !!(valgtBehandlingstype && valgtBehandlingsårsak && valgtDato);
    };
    const { axiosRequest, settToast } = useApp();
    const navigate = useNavigate();

    const [nyeBarnSidenForrigeBehandling, settNyeBarnSidenForrigeBehandling] = useState<
        Ressurs<BarnForRevurdering[]>
    >(byggTomRessurs());

    useEffect(() => {
        axiosRequest<BarnForRevurdering[], null>({
            url: `familie-ef-sak/api/behandling/barn/fagsak/${fagsakId}/nye-barn`,
        }).then((response: RessursSuksess<BarnForRevurdering[]> | RessursFeilet) => {
            settNyeBarnSidenForrigeBehandling(response);
        });
    }, [axiosRequest, fagsakId]);

    const opprettTilbakekrevingBehandling = () => {
        if (valgtBehandlingstype === Behandlingstype.TILBAKEKREVING) {
            settSenderInnBehandling(true);

            axiosRequest<Ressurs<void>, null>({
                method: 'POST',
                url: `/familie-ef-sak/api/tilbakekreving/fagsak/${fagsakId}/opprett-tilbakekreving`,
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
    };

    const opprettRevurdering = () => {
        settFeilmeldingModal('');

        if (valgtBehandlingstype === Behandlingstype.REVURDERING) {
            if (kanStarteRevurdering()) {
                settSenderInnBehandling(true);
                const revurderingInnhold: RevurderingInnhold = {
                    fagsakId: fagsakId,
                    behandlingsårsak: valgtBehandlingsårsak as Behandlingsårsak,
                    kravMottatt: valgtDato as string,
                    barn: valgtBarn,
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
            } else {
                settFeilmeldingModal('Vennligst fyll ut alle felter');
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
                <option disabled={!visOpprettTilbakekreving} value={Behandlingstype.TILBAKEKREVING}>
                    Tilbakekreving
                </option>
            </StyledSelect>

            {valgtBehandlingstype === Behandlingstype.REVURDERING && (
                <LagRevurdering
                    kanLeggeTilNyeBarnPåRevurdering={kanLeggeTilNyeBarnPåRevurdering}
                    nyeBarnSidenForrigeBehandling={nyeBarnSidenForrigeBehandling}
                    settValgtBarn={settValgtBarn}
                    settValgtBehandlingsårsak={settValgtBehandlingsårsak}
                    settValgtDato={settValgtDato}
                    skalViseValgmulighetForSanksjon={skalViseValgmulighetForSanksjon}
                    valgtBehandlingstype={valgtBehandlingstype}
                    valgtBehandlingsårsak={valgtBehandlingsårsak}
                    valgtDato={valgtDato}
                />
            )}
            <KnappeWrapper>
                <StyledHovedknapp
                    onClick={() => {
                        if (!senderInnBehandling) {
                            if (valgtBehandlingstype === Behandlingstype.REVURDERING) {
                                opprettRevurdering();
                            } else if (valgtBehandlingstype === Behandlingstype.TILBAKEKREVING) {
                                opprettTilbakekrevingBehandling();
                            } else {
                                settFeilmeldingModal('Du må velge behandlingstype');
                            }
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
            {feilmeldingModal && <AlertStripeFeil>{feilmeldingModal}</AlertStripeFeil>}
        </UIModalWrapper>
    );
};

export default LagBehandlingModal;
