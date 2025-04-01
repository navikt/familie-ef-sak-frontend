import { BodyLong, Button, Modal } from '@navikt/ds-react';
import React, { FC } from 'react';
import { InngangsvilkårType, VilkårType } from '../Inngangsvilkår/vilkår';

export const ModalGjenbrukVilkårsvurdering: FC<{
    visModal: boolean;
    settVisModal: React.Dispatch<React.SetStateAction<boolean>>;
    gjenbrukVilkårsvurdering: () => void;
    vilkårType: VilkårType;
}> = ({ visModal, settVisModal, gjenbrukVilkårsvurdering, vilkårType }) => {
    if (!visModal) {
        return null;
    }

    const headerTekst =
        vilkårType === InngangsvilkårType.ALENEOMSORG
            ? 'Gjenbruk av vilkårsvurdering og samværsavtale'
            : 'Gjenbruk av vilkårsvurdering';

    const bodyTekst =
        vilkårType === InngangsvilkårType.ALENEOMSORG
            ? 'Er du sikker på at du vil gjenbruke vilkårsvurdering og tilhørende samværsavtale fra tidligere behandling? Inngangsvilkåret og samværsavtalen vil bli overskrevet.'
            : 'Er du sikker på at du vil gjenbruke vilkårsvurdering fra tidligere behandling? Inngangsvilkåret vil bli overskrevet.';

    return (
        <Modal
            onClose={() => settVisModal(false)}
            open={visModal}
            aria-labelledby="modal-heading"
            header={{ heading: headerTekst }}
        >
            <Modal.Body>
                <BodyLong>{bodyTekst}</BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type="button"
                    onClick={() => {
                        gjenbrukVilkårsvurdering();
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
