import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button, ExpansionCard } from '@navikt/ds-react';
import styled from 'styled-components';
import { DokumentInfo, IJournalpost } from '../../../App/typer/journalføring';
import { DokumentPanelHeader } from './DokumentPanelHeader';
import { FamilieReactSelect, ISelectOption } from '@navikt/familie-form-elements';
import { dokumentTitlerMultiSelect, mapDokumentTittel } from '../Felles/utils';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { åpneFilIEgenTab } from '../../../App/utils/utils';

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
    dokument: DokumentInfo;
    hentDokument: (dokumentInfoId: string) => void;
    settDokumentTitler: Dispatch<SetStateAction<Record<string, string> | undefined>>;
}

const MultiSelect = styled(FamilieReactSelect)`
    margin-bottom: -1rem;
`;

const utledDokumentTittel = (
    gammelTittel: string | undefined,
    nyTittel: string | undefined
): string => nyTittel || gammelTittel || 'ukjent';

const DokumentPanel: React.FC<Props> = ({ dokument, journalpost }) => {
    const [nyDokumentTittel, settNyDokumentTittel] = useState<string | undefined>(undefined);
    const [nyAnnetInnholdsliste, settNyAnnetInnholdsliste] = useState<string[]>([]);

    const erDokumentPanelValgt = dokument.dokumentInfoId === dokument.dokumentInfoId;
    const defaultTittelValue = dokument.tittel ? mapDokumentTittel(dokument.tittel) : undefined;
    const dokumentTittel = utledDokumentTittel(dokument.tittel, nyDokumentTittel);

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
                            settNyDokumentTittel(
                                value ? (value as ISelectOption).value : undefined
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
                        onChange={(values: unknown) => {
                            settNyAnnetInnholdsliste(
                                (values as ISelectOption[]).map((value) => value.value)
                            );
                        }}
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
