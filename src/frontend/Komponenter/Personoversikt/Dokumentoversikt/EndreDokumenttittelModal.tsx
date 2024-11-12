import React, { Dispatch, SetStateAction } from 'react';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { DokumentPanelEndreTittel } from './DokumentPanelEndreTittel';
import { Dokumentinfo } from '../../../App/typer/dokumentliste';

interface Props {
    valgtDokument: Dokumentinfo | undefined;
    settValgtDokumentId: Dispatch<SetStateAction<string>>;
}

export const EndreDokumenttittelModal: React.FC<Props> = ({
    valgtDokument,
    settValgtDokumentId,
}) => {
    const skalViseModal = valgtDokument !== null && valgtDokument !== undefined;
    return (
        <ModalWrapper
            tittel={'Endre tittel på dokument'}
            visModal={skalViseModal}
            ariaLabel={'Endre tittel på dokument'}
            onClose={() => settValgtDokumentId('')}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => null,
                    tekst: 'Lagre',
                },
                lukkKnapp: {
                    onClick: () => settValgtDokumentId(''),
                    tekst: 'Avbryt',
                },
                marginTop: 2,
            }}
        >
            {valgtDokument && <DokumentPanelEndreTittel dokument={valgtDokument} />}
        </ModalWrapper>
    );
};
