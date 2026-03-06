import React, { useState } from 'react';
import { Button, ExpansionCard, UNSAFE_Combobox } from '@navikt/ds-react';
import styled from 'styled-components';
import { DokumentInfo, IJournalpost } from '../../../App/typer/journalføring';
import { DokumentPanelHeader } from './DokumentPanelHeader';
import { dokumentTitlerMultiSelect } from '../Felles/utils';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { åpneFilIEgenTab } from '../../../App/utils/utils';
import { JournalføringStateRequest } from '../../../App/hooks/useJournalføringState';
import { v4 as uuidv4 } from 'uuid';

const ExpansionCardHeader = styled(ExpansionCard.Header)`
    padding-bottom: 0.35rem;
`;

const ExpansionCardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding-bottom: 1rem;
`;

const EksternLenkeKnapp = styled(Button)`
    width: fit-content;
`;

interface Props {
    journalpost: IJournalpost;
    journalpostState: JournalføringStateRequest;
    dokument: DokumentInfo;
    hentDokument: (dokumentInfoId: string) => void;
}

const DokumentPanel: React.FC<Props> = ({ journalpost, journalpostState, dokument }) => {
    const {
        dokumentTitler,
        hentDokumentResponse,
        logiskeVedleggPåDokument,
        settDokumentTitler,
        settLogiskeVedleggPåDokument,
        settValgtDokumentPanel,
        valgtDokumentPanel,
    } = journalpostState;
    const [tittelSøk, settTittelSøk] = useState('');
    const [innholdSøk, settInnholdSøk] = useState('');

    const { hentDokument } = hentDokumentResponse;

    const endreDokumentNavn = (dokumentInfoId: string, nyttDokumentNavn: string) => {
        settDokumentTitler((prevState: Record<string, string> | undefined) => ({
            ...prevState,
            [dokumentInfoId]: nyttDokumentNavn,
        }));
    };

    const endreLogiskeVedlegg = (dokumentInfoId: string, nyeLogiskeVedlegg: string[]) => {
        settLogiskeVedleggPåDokument((prevState) => ({
            ...prevState,
            [dokumentInfoId]: nyeLogiskeVedlegg.map((tittel) => {
                return { logiskVedleggId: uuidv4(), tittel: tittel };
            }),
        }));
    };

    const dokumentPanelErValgt = valgtDokumentPanel === dokument.dokumentInfoId;
    const dokumentTittel =
        (dokumentTitler && dokumentTitler[dokument.dokumentInfoId]) || dokument.tittel || 'Ukjent';

    const logiskeVedlegg = logiskeVedleggPåDokument
        ? logiskeVedleggPåDokument[dokument.dokumentInfoId]
        : undefined;

    const logiskeVedleggString: string[] =
        logiskeVedlegg !== undefined ? logiskeVedlegg.map((vedlegg) => vedlegg.tittel) : [];
    const dokumentTittelOptions = dokumentTitlerMultiSelect.map((option) => option.value);

    return (
        <ExpansionCard
            id={dokument.dokumentInfoId}
            size="small"
            aria-label="journalpost"
            onToggle={() => {
                if (!dokumentPanelErValgt) {
                    hentDokument(dokument.dokumentInfoId);
                    settValgtDokumentPanel(dokument.dokumentInfoId);
                }
            }}
        >
            <ExpansionCardHeader>
                <DokumentPanelHeader
                    dokumentTittel={dokumentTittel}
                    erValgt={dokumentPanelErValgt}
                    logiskeVedlegg={logiskeVedleggString}
                />
            </ExpansionCardHeader>
            <ExpansionCard.Content>
                <ExpansionCardContent>
                    <UNSAFE_Combobox
                        label={'Dokumenttittel'}
                        options={dokumentTittelOptions}
                        allowNewValues
                        selectedOptions={dokumentTittel ? [dokumentTittel] : []}
                        onToggleSelected={(option, isSelected) => {
                            endreDokumentNavn(dokument.dokumentInfoId, isSelected ? option : '');
                            settTittelSøk('');
                        }}
                        value={tittelSøk}
                        onChange={settTittelSøk}
                    />

                    <UNSAFE_Combobox
                        label={'Annet innhold'}
                        options={dokumentTittelOptions}
                        allowNewValues
                        isMultiSelect
                        selectedOptions={logiskeVedleggString}
                        onToggleSelected={(option, isSelected) => {
                            const oppdaterteVedlegg = isSelected
                                ? Array.from(new Set([...logiskeVedleggString, option]))
                                : logiskeVedleggString.filter((vedlegg) => vedlegg !== option);

                            endreLogiskeVedlegg(dokument.dokumentInfoId, oppdaterteVedlegg);
                            settInnholdSøk('');
                        }}
                        value={innholdSøk}
                        onChange={settInnholdSøk}
                    />

                    <EksternLenkeKnapp
                        type={'button'}
                        variant={'tertiary'}
                        size={'small'}
                        icon={<ExternalLinkIcon aria-hidden />}
                        iconPosition={'right'}
                        onClick={() =>
                            åpneFilIEgenTab(
                                journalpost.journalpostId,
                                dokument.dokumentInfoId,
                                dokumentTittel
                            )
                        }
                    >
                        Åpne i ny fane
                    </EksternLenkeKnapp>
                </ExpansionCardContent>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};

export default DokumentPanel;
