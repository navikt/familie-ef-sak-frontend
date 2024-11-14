import React, { Dispatch, SetStateAction, useState } from 'react';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { DokumentPanelEndreTittel } from './DokumentPanelEndreTittel';
import { Dokumentinfo } from '../../../App/typer/dokumentliste';

interface Props {
    dokument: Dokumentinfo;
    settValgtDokumentId: Dispatch<SetStateAction<string>>;
}

export const EndreDokumenttittelModal: React.FC<Props> = ({ dokument, settValgtDokumentId }) => {
    const [dokumentTittel, settDokumentTittel] = useState<string>(dokument.tittel);
    const [logiskeVedlegg, settLogiskeVedlegg] = useState<string[]>(
        dokument.logiskeVedlegg.map((vedlegg) => vedlegg.tittel)
    );

    const skalViseModal = dokument !== null && dokument !== undefined;

    const validerOgSendInnDokument = () => {
        // TODO: Valider og send til backend
        // For tittel ønsker å validere: ikke tom streng
        // For logiske vedlegg ønsker å validere: ikke tom streng
        // For logiske vedlegg må vi mappe om til label value struktur. Bruk uuid v4 som id: {label: logisk-vedlegg-tittel, id: uuidv4()}
    };

    // const endreDokument = useCallback(
    //     (personIdent: string, stønadstype: Stønadstype) => {
    //         axiosRequest<null, Dokumentinfo>({
    //             method: 'POST',
    //             url: `/familie-ef-sak/api/fagsak`,
    //             data: { personIdent, stønadstype },
    //         });
    //     },
    //     [axiosRequest]
    // );

    return (
        <ModalWrapper
            tittel={'Endre tittel på dokument'}
            visModal={skalViseModal}
            ariaLabel={'Endre tittel på dokument'}
            onClose={() => settValgtDokumentId('')}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => validerOgSendInnDokument(),
                    tekst: 'Lagre',
                },
                lukkKnapp: {
                    onClick: () => settValgtDokumentId(''),
                    tekst: 'Avbryt',
                },
                marginTop: 2,
            }}
        >
            {dokument && (
                <DokumentPanelEndreTittel
                    dokumentTittel={dokumentTittel}
                    oppdaterDokumentTittel={settDokumentTittel}
                    logiskeVedlegg={logiskeVedlegg}
                    oppdaterLogiskeVedlegg={settLogiskeVedlegg}
                    dokumentId={dokument.dokumentinfoId}
                />
            )}
        </ModalWrapper>
    );
};
