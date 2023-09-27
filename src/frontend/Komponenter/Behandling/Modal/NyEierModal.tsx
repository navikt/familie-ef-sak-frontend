import React, { FC } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { BodyLong } from '@navikt/ds-react';

export enum ModalState {
    LUKKET = 'LUKKET',
    ÅPEN = 'ÅPEN',
    SKAL_IKKE_ÅPNES = 'SKAL IKKE ÅPNES',
}

export const utledModalState = (
    forrigeModalState: ModalState,
    innloggetSaksbehandlerKanRedigereBehandling: boolean
): ModalState => {
    if (innloggetSaksbehandlerKanRedigereBehandling) {
        return ModalState.LUKKET;
    } else if (forrigeModalState === ModalState.LUKKET) {
        return ModalState.ÅPEN;
    }
    return ModalState.SKAL_IKKE_ÅPNES;
};

export const NyEierModal: FC = () => {
    const { ansvarligSaksbehandler, nyEierModalState, settNyEierModalState } = useBehandling();

    const lukkModal = () => {
        settNyEierModalState(() => ModalState.SKAL_IKKE_ÅPNES);
    };

    return (
        <ModalWrapper
            tittel={'Behandlingen har en ny eier'}
            visModal={nyEierModalState === ModalState.ÅPEN}
            onClose={() => lukkModal()}
            ariaLabel={'Behandlingen har ny ansvarlig saksbehandler'}
        >
            <DataViewer response={{ ansvarligSaksbehandler }}>
                {({ ansvarligSaksbehandler }) => {
                    return (
                        <BodyLong>
                            {`Behandlingen er i lesemodus fordi ${ansvarligSaksbehandler.fornavn} ${ansvarligSaksbehandler.etternavn} er satt som ny ansvarlig saksbehandler.`}
                        </BodyLong>
                    );
                }}
            </DataViewer>
        </ModalWrapper>
    );
};
