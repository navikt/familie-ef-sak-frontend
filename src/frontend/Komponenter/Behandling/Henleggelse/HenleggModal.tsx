import React, { FC } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import Modal from 'nav-frontend-modal';
import { Systemtittel } from 'nav-frontend-typografi';

export const HenleggModal: FC = () => {
    const { visHenleggModal, settVisHenleggModal } = useBehandling();

    return (
        <Modal
            isOpen={visHenleggModal}
            onRequestClose={() => settVisHenleggModal(false)}
            closeButton={true}
            contentLabel={'Velg årsak til henleggelse'}
        >
            <Systemtittel>Hvem skal motta vedtaksbrevet?</Systemtittel>
            <p>Test</p>
        </Modal>
    );
};
