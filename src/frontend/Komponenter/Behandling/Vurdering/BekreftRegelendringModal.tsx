import React, { FC } from 'react';
import { BodyLong, Button, Modal } from '@navikt/ds-react';
import { regelverkLabel } from '../../../App/typer/behandlingstype';

interface Props {
    open: boolean;
    nyVerdi: boolean | null;
    onBekreft: () => void;
    onAvbryt: () => void;
}

export const BekreftRegelendringModal: FC<Props> = ({ open, nyVerdi, onBekreft, onAvbryt }) => {
    const valgtRegelverkLabel = (
        nyVerdi ? regelverkLabel.NYTT_REGELVERK.tekst : regelverkLabel.TIDLIGERE_REGELVERK.tekst
    ).toLowerCase();

    return (
        <Modal open={open} onClose={onAvbryt} header={{ heading: 'Bekreft endring av regelverk' }}>
            <Modal.Body>
                <BodyLong>Er du sikker på at du vil bytte til {valgtRegelverkLabel}?</BodyLong>
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
