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

export const SettPåVentModal: FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { visSettpåVentModal, settVisSettpåVentModal, hentBehandling } = useBehandling();

    const { axiosRequest } = useApp();

    const [låsKnapp, settLåsKnapp] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();

    const lukkModal = () => {
        settFeilmelding('');
        settVisSettpåVentModal(false);
    };

    const settPåVent = () => {
        if (låsKnapp) {
            return;
        }

        settLåsKnapp(true);

        axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandlingId}/vent`,
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
            visModal={visSettpåVentModal}
            onClose={() => settVisSettpåVentModal(false)}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => settPåVent(),
                    tekst: 'Sett på vent',
                    disabled: låsKnapp,
                },
                lukkKnapp: { onClick: () => settVisSettpåVentModal(false), tekst: 'Avbryt' },
            }}
            ariaLabel={'Velg årsak til henleggelse av behandlingen'}
        >
            Vil du sette behandlingen på vent?
            {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
        </ModalWrapper>
    );
};
