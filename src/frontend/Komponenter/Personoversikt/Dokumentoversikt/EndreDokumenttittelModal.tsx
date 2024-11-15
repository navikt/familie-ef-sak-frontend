import React, { Dispatch, SetStateAction, useState } from 'react';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { DokumentPanelEndreTittel } from './DokumentPanelEndreTittel';
import { Dokumentinfo } from '../../../App/typer/dokumentliste';
import { v4 as uuidv4 } from 'uuid';
import { LogiskVedlegg } from '../../../App/typer/journalføring';

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

    const mapLogiskeVedleggMedNyId = (logiskeVedlegg: string[]) => {
        const listeMEdLogiskeVedLegg: LogiskVedlegg[] = logiskeVedlegg.map((vedlegg) => {
            return {
                tittel: vedlegg,
                logiskVedleggId: uuidv4(),
            };
        });

        return listeMEdLogiskeVedLegg;
    };

    const validerOgSendInnDokument = () => {
        if (dokumentTittel !== '' && logiskeVedlegg.map((vedlegg) => vedlegg !== '')) {
            const listeMedLogiskeVedlegg = mapLogiskeVedleggMedNyId(logiskeVedlegg);
            console.log(listeMedLogiskeVedlegg);
        }
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
