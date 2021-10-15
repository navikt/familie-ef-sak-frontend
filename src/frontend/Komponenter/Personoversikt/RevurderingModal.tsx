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
    hentFagsak: () => void;
    settSkalNavigereTilBehandlingen: (bool: boolean) => void;
    settKanStarteRevurdering: (bool: boolean) => void;
}

const RevurderingsModal: React.FunctionComponent<IProps> = ({
    visModal,
    settVisModal,
    fagsakId,
    hentFagsak,
    settSkalNavigereTilBehandlingen,
    settKanStarteRevurdering,
}) => {
    const [feilmeldingModal, settFeilmeldingModal] = useState<string>();
    const [valgtBehandlingstype, settValgtBehandlingstype] = useState<Behandlingstype>(
        Behandlingstype.REVURDERING
    );
    const [valgtBehandlingsårsak, settValgtBehandlingsårsak] = useState<Behandlingsårsak>();
    const [valgtDato, settValgtDato] = useState<string>();

    const validerKanStarteRevurdering = (): boolean => {
        return !!(valgtBehandlingstype && valgtBehandlingsårsak && valgtDato);
    };
    const { axiosRequest } = useApp();

    const opprettRevurdering = (fagsakId: string) => {
        settFeilmeldingModal('');
        if (validerKanStarteRevurdering()) {
            settKanStarteRevurdering(false);
            settVisModal(false);
            axiosRequest<Ressurs<void>, { fagsakId: string }>({
                method: 'POST',
                url: `/familie-ef-sak/api/revurdering/${fagsakId}`,
                data: {
                    fagsakId,
                    behandlingsårsak: valgtBehandlingsårsak,
                    kravMottatt: valgtDato,
                },
            }).then((response) => {
                if (response.status === RessursStatus.SUKSESS) {
                    settSkalNavigereTilBehandlingen(true);
                    hentFagsak();
                } else {
                    settFeilmeldingModal(response.frontendFeilmelding || response.melding);
                }
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
                }}
            >
                <option value={Behandlingstype.REVURDERING}>Revurdering</option>
            </StyledSelect>
            {Behandlingstype.REVURDERING && (
                <StyledSelect
                    label="Årsak revurdering"
                    value={valgtBehandlingsårsak || ''}
                    onChange={(e) => {
                        settValgtBehandlingsårsak(e.target.value as Behandlingsårsak);
                    }}
                >
                    {behandlingsårsaker.map((behandlingsårsak: Behandlingsårsak, index: number) => (
                        <option key={index} value={behandlingsårsak}>
                            {behandlingsårsakTilTekst[behandlingsårsak]}
                        </option>
                    ))}
                </StyledSelect>
            )}
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
                        opprettRevurdering(fagsakId);
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

RevurderingsModal.propTypes = {};

export default RevurderingsModal;
