import React, { useState } from 'react';
import { ExpansionCard, UNSAFE_Combobox } from '@navikt/ds-react';
import styled from 'styled-components';
import { DokumentPanelHeader } from '../../Journalføring/Standard/DokumentPanelHeader';
import { Dokumentinfo } from '../../../App/typer/dokumentliste';
import { dokumentTitler } from '../../utils';

const ExpansionCardHeader = styled(ExpansionCard.Header)`
    padding-bottom: 0.35rem;
`;

const ExpansionCardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding-bottom: 1rem;
`;

interface Props {
    dokument: Dokumentinfo;
}

export const DokumentPanelEndreTittel: React.FC<Props> = ({ dokument }) => {
    const [dokumentTittel, settDokumentTittel] = useState<string>(dokument.tittel);
    const [logiskeVedlegg, settLogiskeVedlegg] = useState<string[]>(
        dokument.logiskeVedlegg.map((vedlegg) => vedlegg.tittel)
    );
    const [value, setValue] = useState<string>('');

    const onTittelSelect = (option: string, isSelected: boolean) => {
        if (isSelected) {
            settDokumentTittel(() => option);
        }
    };

    const onLogiskVedleggSelect = (option: string, isSelected: boolean) => {
        if (isSelected) {
            settLogiskeVedlegg((prevState) => [...prevState, option]);
        } else {
            settLogiskeVedlegg((prevState) => prevState.filter((vedlegg) => vedlegg !== option));
        }
    };

    return (
        <ExpansionCard
            id={dokument.dokumentinfoId}
            size="small"
            aria-label="journalpost"
            open={true}
        >
            <ExpansionCardHeader>
                <DokumentPanelHeader
                    dokumentTittel={dokumentTittel}
                    erValgt={true}
                    logiskeVedlegg={dokument.logiskeVedlegg}
                />
            </ExpansionCardHeader>
            <ExpansionCard.Content>
                <ExpansionCardContent>
                    <UNSAFE_Combobox
                        allowNewValues
                        label={'Dokumenttittel'}
                        options={dokumentTitler}
                        defaultValue={dokumentTittel}
                        onToggleSelected={onTittelSelect}
                        shouldAutocomplete
                    />
                    <UNSAFE_Combobox
                        allowNewValues
                        placeholder={'Velg innhold'}
                        label={'Annet innhold'}
                        options={dokumentTitler}
                        isMultiSelect
                        selectedOptions={logiskeVedlegg}
                        onChange={setValue}
                        onToggleSelected={onLogiskVedleggSelect}
                        value={value}
                    />
                </ExpansionCardContent>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};
