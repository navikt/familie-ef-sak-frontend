import React, { FC, useEffect, useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { Alert } from '@navikt/ds-react';
import styled from 'styled-components';
import { ETaAvVentStatus } from '../../../App/typer/behandlingstatus';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

export const TaAvVentModal: FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { taAvVentStatus, hentBehandling } = useBehandling();
    const [visTaAvVentModal, settVisTaAvVentModal] = useState(false);

    const { axiosRequest } = useApp();

    const [låsKnapp, settLåsKnapp] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();

    useEffect(() => {
        if (
            taAvVentStatus === ETaAvVentStatus.ANNEN_BEHANDLING_MÅ_FERDIGSTILLES ||
            taAvVentStatus === ETaAvVentStatus.MÅ_NULSTILLE_VEDTAK
        ) {
            settVisTaAvVentModal(true);
        }
    }, [taAvVentStatus]);

    const lukkModal = () => {
        settFeilmelding('');
        settVisTaAvVentModal(false);
    };

    const taAvVent = () => {
        if (låsKnapp) {
            return;
        }

        settLåsKnapp(true);

        axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandlingId}/aktiver`,
        })
            .then((respons: RessursFeilet | RessursSuksess<string>) => {
                if (respons.status == RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    lukkModal();
                } else {
                    settFeilmelding(respons.frontendFeilmelding);
                }
            })
            .finally(() => settLåsKnapp(false));
    };

    const tittel =
        taAvVentStatus === ETaAvVentStatus.MÅ_NULSTILLE_VEDTAK
            ? 'Behandlingen kan miste data!'
            : 'Kan ikke ta behandling av vent';

    return (
        <ModalWrapper
            tittel={tittel}
            visModal={visTaAvVentModal}
            onClose={() => settVisTaAvVentModal(false)}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => taAvVent(),
                    tekst: 'Fortsett behandling og tilbakestill data',
                    disabled:
                        låsKnapp ||
                        taAvVentStatus === ETaAvVentStatus.ANNEN_BEHANDLING_MÅ_FERDIGSTILLES,
                },
                lukkKnapp: {
                    onClick: () => settVisTaAvVentModal(false),
                    tekst: 'Avbryt',
                },
            }}
            ariaLabel={'Fortsett behandling'}
        >
            {taAvVentStatus === ETaAvVentStatus.ANNEN_BEHANDLING_MÅ_FERDIGSTILLES && (
                <>Behandling kan ikke tas av vent før annen behandling er ferdigstilt.</>
            )}
            {taAvVentStatus === ETaAvVentStatus.MÅ_NULSTILLE_VEDTAK && (
                <>
                    Siden det har blitt fattet et annet vedtak på denne fagsaken i tidsrommet denne
                    behandlingen har vært på vent, er vi nødt til å tilbakestille vedtak- og
                    beregningssiden og brevsiden. Dette er fordi det forrige vedtaket kan påvirke
                    denne behandlingen.
                    <br />
                    <br />
                    Hvis det ligger informasjon på en av disse sidene som du vil ha med videre, må
                    du velge "AVBRYT". Deretter kopierer du det du vil ta vare på før du tar
                    behandlingen av vent.
                </>
            )}

            {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
        </ModalWrapper>
    );
};
