import { Modal, BodyLong, Button } from '@navikt/ds-react';
import React, { FC } from 'react';

export const MarkereGodkjenneVedtakModal: FC<{
    open: boolean;
    setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => {
    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            header={{
                heading:
                    'Følgende oppgaver skal opprettes automatisk ved godkjenning av dette vedtaket:',
                size: 'small',
                closeButton: false,
            }}
            width="small"
        >
            <Modal.Body>
                <BodyLong>TEST: Denne skal være toggelet av i prod.</BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" onClick={() => setOpen(false)}>
                    Send til beslutter
                </Button>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
