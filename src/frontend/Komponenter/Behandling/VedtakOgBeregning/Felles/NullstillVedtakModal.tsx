import React, { useState } from 'react';
import { useApp } from '../../../../App/context/AppContext';
import { RessursStatus } from '@navikt/familie-typer';
import { Alert, Button, Ingress, Modal } from '@navikt/ds-react';
import styled from 'styled-components';
import { EToast } from '../../../../App/typer/toast';
import { useBehandling } from '../../../../App/context/BehandlingContext';

const MidtstiltDiv = styled.div`
    display: flex;
    justify-content: center;
    gap: 2rem;
`;

const Container = styled.div`
    width: 40rem;
    padding: 2rem;
`;

export const NullstillVedtakModal: React.FC<{
    visModal: boolean;
    settVisModal: React.Dispatch<React.SetStateAction<boolean>>;
    behandlingId: string;
}> = ({ visModal, settVisModal, behandlingId }) => {
    const { axiosRequest, settToast } = useApp();
    const { hentBehandling } = useBehandling();
    const [feilmelding, settFeilmelding] = useState('');

    const nullstillVedtak = () => {
        axiosRequest<string, null>({
            method: 'DELETE',
            url: `familie-ef-sak/api/vedtak/${behandlingId}`,
        }).then((resp) => {
            if (resp.status === RessursStatus.SUKSESS) {
                settFeilmelding('');
                hentBehandling.rerun();
                settVisModal(false);
                settToast(EToast.VEDTAK_NULLSTILT);
            } else {
                settFeilmelding(resp.frontendFeilmelding);
            }
        });
    };
    return (
        <Modal onClose={() => settVisModal(false)} open={visModal}>
            <Modal.Content>
                <Container>
                    <Ingress>
                        Er du sikker på at du vil nullstille lagret vedtak? Du vil miste alle
                        lagrede opplysninger på vedtak og beregningssiden.
                    </Ingress>
                </Container>
                <MidtstiltDiv>
                    <Button variant={'primary'} onClick={nullstillVedtak}>
                        Nullstill
                    </Button>
                    <Button variant={'tertiary'} onClick={() => settVisModal(false)}>
                        Avbryt
                    </Button>
                </MidtstiltDiv>
                {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
            </Modal.Content>
        </Modal>
    );
};
