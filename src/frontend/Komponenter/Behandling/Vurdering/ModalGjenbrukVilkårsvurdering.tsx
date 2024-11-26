import { Button, Modal, BodyLong } from '@navikt/ds-react';
import React, { FC } from 'react';

const ModalGjenbrukVilkårsvurdering: FC<{
    visModal: boolean;
    settVisModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleGjenbrukEnkelVilkårsvurdering: () => void;
}> = ({ visModal, settVisModal, handleGjenbrukEnkelVilkårsvurdering }) => {
    if (!visModal) {
        return null;
    }

    return (
        <Modal
            onClose={() => settVisModal(false)}
            open={visModal}
            aria-labelledby="modal-heading"
            header={{ heading: 'Gjenbruk av vilkårsvurdering' }}
        >
            <Modal.Body>
                <BodyLong>
                    Er du sikker på at du vil gjenbruke vilkårsvurdering fra tidligere behandling?
                    Inngangsvilkåret vil bli overskrevet.
                </BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type="button"
                    onClick={() => {
                        handleGjenbrukEnkelVilkårsvurdering();
                        settVisModal(false);
                    }}
                >
                    Gjenbruk
                </Button>
                <Button type="button" variant="secondary" onClick={() => settVisModal(false)}>
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalGjenbrukVilkårsvurdering;
