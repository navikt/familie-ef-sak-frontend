import React, { Dispatch, SetStateAction, useState } from 'react';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { DokumentPanelEndreTittel } from './DokumentPanelEndreTittel';
import { Dokumentinfo } from '../../../App/typer/dokumentliste';
import { v4 as uuidv4 } from 'uuid';
import { LogiskVedlegg } from '../../../App/typer/journalføring';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';
import { useApp } from '../../../App/context/AppContext';
import { RessursStatus } from '../../../App/typer/ressurs';

interface Props {
    dokument: Dokumentinfo;
    settValgtDokumentId: Dispatch<SetStateAction<string>>;
    hentDokumenter: () => void;
}

interface OppdaterJournalpostMedDokumenterRequest {
    dokumenttitler: Record<string, string> | null;
    logiskeVedlegg: Record<string, LogiskVedlegg[]> | null;
}

export const EndreDokumenttittelModal: React.FC<Props> = ({
    dokument,
    settValgtDokumentId,
    hentDokumenter,
}) => {
    const { axiosRequest } = useApp();
    const [dokumentTittel, settDokumentTittel] = useState<string>(dokument.tittel);
    const [logiskeVedlegg, settLogiskeVedlegg] = useState<string[]>(
        dokument.logiskeVedlegg.map((vedlegg) => vedlegg.tittel)
    );
    const [feilmedling, settFeilmelding] = useState<string>('');
    const [senderInnDokument, settSenderInnDokument] = useState<boolean>(false);

    const utledTittelErEndret = (): boolean => dokument.tittel !== dokumentTittel;

    const lukkModal = () => {
        settValgtDokumentId('');
    };

    const utledLogiskeVedleggErEndret = (): boolean =>
        dokument.logiskeVedlegg.length !== logiskeVedlegg.length ||
        dokument.logiskeVedlegg.some((vedlegg) => !logiskeVedlegg.includes(vedlegg.tittel));

    const validerDokument = (tittelErEndret: boolean, logiskeVedleggErEndret: boolean) => {
        if (!tittelErEndret && !logiskeVedleggErEndret) {
            return 'Enten tittel eller minst et logisk vedlegg må endres på før innsending.';
        }
        if (dokumentTittel === '') {
            return 'Vennligst fyll inn ny dokumenttittel.';
        }
        if (logiskeVedlegg.some((vedlegg) => vedlegg === '')) {
            return 'Et eller flere logiske vedlegg mangler tittel.';
        }
        return '';
    };

    const leggTilIdPåLogiskVedlegg = (vedleggTitler: string[]): LogiskVedlegg[] =>
        vedleggTitler.map((vedlegg) => {
            return {
                tittel: vedlegg,
                logiskVedleggId: uuidv4(),
            };
        });

    const lagRequest = (
        tittelErEndret: boolean,
        logiskeVedleggErEndret: boolean
    ): OppdaterJournalpostMedDokumenterRequest => {
        return {
            dokumenttitler: tittelErEndret ? { [dokument.dokumentinfoId]: dokumentTittel } : null,
            logiskeVedlegg: logiskeVedleggErEndret
                ? { [dokument.dokumentinfoId]: leggTilIdPåLogiskVedlegg(logiskeVedlegg) }
                : null,
        };
    };

    const sendInnDokument = (tittelErEndret: boolean, logiskeVedleggErEndret: boolean) => {
        settSenderInnDokument(true);
        const request = lagRequest(tittelErEndret, logiskeVedleggErEndret);

        axiosRequest<string, OppdaterJournalpostMedDokumenterRequest>({
            method: 'POST',
            url: `/familie-ef-sak/api/journalpost/${dokument.journalpostId}/oppdater-dokumenter`,
            data: request,
        }).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                lukkModal();
                hentDokumenter();
            } else {
                settFeilmelding(res.frontendFeilmelding);
            }
            settSenderInnDokument(false);
        });
    };

    const validerOgSendInnDokument = () => {
        if (senderInnDokument) {
            return;
        }

        const tittelErEndret = utledTittelErEndret();
        const logiskeVedleggErEndret = utledLogiskeVedleggErEndret();

        const feilmelding = validerDokument(tittelErEndret, logiskeVedleggErEndret);
        settFeilmelding(feilmelding);
        if (feilmelding === '') {
            sendInnDokument(tittelErEndret, logiskeVedleggErEndret);
        }
    };

    return (
        <ModalWrapper
            tittel={'Endre tittel på dokument'}
            visModal={true}
            ariaLabel={'Endre tittel på dokument'}
            onClose={() => lukkModal()}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => validerOgSendInnDokument(),
                    tekst: 'Lagre',
                },
                lukkKnapp: {
                    onClick: () => lukkModal(),
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
            {feilmedling && <AlertError>{feilmedling}</AlertError>}
        </ModalWrapper>
    );
};
