import React, { FC, useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { Alert } from '@navikt/ds-react';
import styled from 'styled-components';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

export const TaAvVentModal: FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { visTaAvVentModal, settVisTaAvVentModal, hentBehandling } = useBehandling();

    const { axiosRequest } = useApp();

    const [låsKnapp, settLåsKnapp] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();

    const lukkModal = () => {
        settFeilmelding('');
        settVisTaAvVentModal(false);
    };

    const fortsettBehandling = () => {
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

    return (
        <ModalWrapper
            tittel={'Sett behandling på vent'}
            visModal={visTaAvVentModal}
            onClose={() => settVisTaAvVentModal(false)}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => fortsettBehandling(),
                    tekst: 'Fortsett behandling og tilbakestill data',
                    disabled: låsKnapp,
                },
                lukkKnapp: {
                    onClick: () => settVisTaAvVentModal(false),
                    tekst: 'Avbryt',
                },
            }}
            ariaLabel={'Fortsett behandling'}
        >
            Så flott at du vil fortsette behandlingen. Siden det har blitt fattet et annet vedtak på
            denne fagsaken i tidsrommet denne behandlingen har vært på vent, er vi nødt til å
            tilbakestille vedtak og beregningssiden, samt brevsiden. Dette fordi det forrige
            vedtaket kan ha påvirket denne behandlingen. Ligger det informasjon på disse sidene du
            vil ha med videre må du velge “AVBRYT”, deretter kopiere det du vil ta vare på, og så ta
            den av vent.
            {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
        </ModalWrapper>
    );
};
