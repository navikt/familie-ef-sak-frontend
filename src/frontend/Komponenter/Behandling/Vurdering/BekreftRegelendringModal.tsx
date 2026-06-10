import React, { FC } from 'react';
import { BodyLong, Button, Modal } from '@navikt/ds-react';

interface Props {
    open: boolean;
    nyVerdi: boolean | null;
    onBekreft: () => void;
    onAvbryt: () => void;
}

export const BekreftRegelendringModal: FC<Props> = ({ open, nyVerdi, onBekreft, onAvbryt }) => {
    const regelverkLabel = nyVerdi ? 'nytt regelverk (fra 01.07.2026)' : 'gammelt regelverk';

    return (
        <Modal open={open} onClose={onAvbryt} header={{ heading: 'Bekreft endring av regelverk' }}>
            <Modal.Body>
                <BodyLong>Er du sikker på at du vil bytte til {regelverkLabel}?</BodyLong>
                <BodyLong>
                    Dette vil fjerne data du allerede har fylt inn i senere behandlingssteg.
                </BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" onClick={onBekreft}>
                    Ja, bytt regelverk
                </Button>
                <Button type="button" variant="secondary" onClick={onAvbryt}>
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
