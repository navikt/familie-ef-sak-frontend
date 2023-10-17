import React from 'react';
import { Button, ExpansionCard } from '@navikt/ds-react';
import styled from 'styled-components';
import { DokumentInfo, IJournalpost } from '../../../App/typer/journalføring';
import { DokumentPanelHeader } from './DokumentPanelHeader';
import { FamilieReactSelect, ISelectOption } from '@navikt/familie-form-elements';
import { dokumentTitlerMultiSelect, mapDokumentTittel } from '../Felles/utils';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { åpneFilIEgenTab } from '../../../App/utils/utils';
import { JournalføringStateRequest } from '../../../App/hooks/useJournalføringState';

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

const MultiSelect = styled(FamilieReactSelect)`
    margin-bottom: -1rem;
`;

interface Props {
    journalpost: IJournalpost;
    journalpostState: JournalføringStateRequest;
    dokument: DokumentInfo;
    hentDokument: (dokumentInfoId: string) => void;
}

const DokumentPanel: React.FC<Props> = ({ journalpost, journalpostState, dokument }) => {
    const endreDokumentNavn = (dokumentInfoId: string, nyttDokumentNavn: string) => {
        settDokumentTitler((prevState: Record<string, string> | undefined) => ({
            ...prevState,
            [dokumentInfoId]: nyttDokumentNavn,
        }));
    };

    const { dokumentTitler, settDokumentTitler } = journalpostState;

    const erDokumentPanelValgt = dokument.dokumentInfoId === dokument.dokumentInfoId;
    const dokumentTittel =
        (dokumentTitler && dokumentTitler[dokument.dokumentInfoId]) || dokument.tittel || 'Ukjent';
    const defaultTittelValue = dokumentTittel ? mapDokumentTittel(dokumentTittel) : undefined;

    return (
        <ExpansionCard id={dokument.dokumentInfoId} size="small" aria-label="journalpost">
            <ExpansionCardHeader>
                <DokumentPanelHeader
                    dokument={dokument}
                    dokumentTittel={dokumentTittel}
                    valgt={erDokumentPanelValgt}
                />
            </ExpansionCardHeader>
            <ExpansionCard.Content>
                <ExpansionCardContent>
                    <MultiSelect
                        placeholder={'Velg tittel'}
                        label={'Dokumenttittel'}
                        options={dokumentTitlerMultiSelect}
                        creatable={true}
                        menuPortalTarget={document.querySelector('body')}
                        isMulti={false}
                        isDisabled={false}
                        defaultValue={defaultTittelValue}
                        feil={null}
                        onChange={(value: unknown) => {
                            endreDokumentNavn(
                                dokument.dokumentInfoId,
                                value ? (value as ISelectOption).value : ''
                            );
                        }}
                    />
                    <MultiSelect
                        placeholder={'Velg innhold'}
                        label={'Annet innhold'}
                        creatable={true}
                        menuPortalTarget={document.querySelector('body')}
                        isMulti={true}
                        isDisabled={false}
                        defaultValue={undefined}
                        feil={null}
                        onChange={(values: unknown) => {}}
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
