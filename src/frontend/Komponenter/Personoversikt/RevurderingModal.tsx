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
import { useHistory } from 'react-router-dom';

const StyledSelect = styled(Select)`
    margin-top: 2rem;
`;

const KnappeWrapper = styled.div`
    margin-top: 16rem;
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
}

const RevurderingsModal: React.FunctionComponent<IProps> = ({
    visModal,
    settVisModal,
    fagsakId,
}) => {
    const [feilmeldingModal, settFeilmeldingModal] = useState<string>();
    const [valgtBehandlingstype, settValgtBehandlingstype] = useState<Behandlingstype>();
    const [valgtBehandlingsårsak, settValgtBehandlingsårsak] = useState<Behandlingsårsak>();
    const [valgtDato, settValgtDato] = useState<string>();
    const [senderInnRevurdering, settSenderInnRevurdering] = useState<boolean>(false);
    const kanStarteRevurdering = (): boolean => {
        return !!(valgtBehandlingstype && valgtBehandlingsårsak && valgtDato);
    };
    const { axiosRequest } = useApp();
    const history = useHistory();

    const opprettRevurdering = () => {
        settFeilmeldingModal('');
        if (kanStarteRevurdering()) {
            settSenderInnRevurdering(true);
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
                        history.push(`/behandling/${response.data}`);
                    } else {
                        settFeilmeldingModal(response.frontendFeilmelding || response.melding);
                    }
                })
                .finally(() => {
                    settSenderInnRevurdering(false);
                });
        } else {
            settFeilmeldingModal('Vennligst fyll ut alle felter');
        }
    };

    return (
        <UIModalWrapper
            modal={{
                tittel: 'Opprett ny behandling',
                lukkKnapp: true,
                visModal: visModal,
                onClose: () => settVisModal(false),
                className: 'long',
            }}
        >
            <StyledSelect
                label="Behandlingstype"
                value={valgtBehandlingstype || ''}
                onChange={(e) => {
                    settValgtBehandlingstype(e.target.value as Behandlingstype);
                    settValgtBehandlingsårsak(undefined);
                }}
            >
                <option value="">Velg</option>
                <option value={Behandlingstype.REVURDERING}>Revurdering</option>
            </StyledSelect>
            <StyledSelect
                label="Årsak"
                value={valgtBehandlingsårsak || ''}
                onChange={(e) => {
                    settValgtBehandlingsårsak(e.target.value as Behandlingsårsak);
                }}
            >
                <option value="">Velg</option>
                {valgtBehandlingstype === Behandlingstype.REVURDERING &&
                    behandlingsårsaker.map((behandlingsårsak: Behandlingsårsak, index: number) => (
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
            <KnappeWrapper>
                <StyledHovedknapp
                    onClick={() => {
                        if (!senderInnRevurdering) {
                            opprettRevurdering();
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

export default RevurderingsModal;
