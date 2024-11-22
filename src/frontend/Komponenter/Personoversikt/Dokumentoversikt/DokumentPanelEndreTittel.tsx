import React, { Dispatch, SetStateAction, useState } from 'react';
import { ExpansionCard, UNSAFE_Combobox } from '@navikt/ds-react';
import styled from 'styled-components';
import { DokumentPanelHeader } from '../../Journalføring/Standard/DokumentPanelHeader';
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
    dokumentTittel: string;
    oppdaterDokumentTittel: Dispatch<SetStateAction<string>>;
    logiskeVedlegg: string[];
    oppdaterLogiskeVedlegg: Dispatch<SetStateAction<string[]>>;
    dokumentId: string;
}

export const DokumentPanelEndreTittel: React.FC<Props> = ({
    dokumentTittel,
    oppdaterDokumentTittel,
    logiskeVedlegg,
    oppdaterLogiskeVedlegg,
    dokumentId,
}) => {
    const [value, setValue] = useState<string>('');

    const onTittelSelect = (option: string, isSelected: boolean) => {
        if (isSelected) {
            oppdaterDokumentTittel(() => option);
        }
    };

    const onLogiskVedleggSelect = (option: string, isSelected: boolean) => {
        if (isSelected) {
            oppdaterLogiskeVedlegg((prevState) => [...prevState, option]);
        } else {
            oppdaterLogiskeVedlegg((prevState) =>
                prevState.filter((vedlegg) => vedlegg !== option)
            );
        }
    };

    return (
        <ExpansionCard id={dokumentId} size="small" aria-label="journalpost" open={true}>
            <ExpansionCardHeader>
                <DokumentPanelHeader
                    dokumentTittel={dokumentTittel}
                    erValgt={true}
                    logiskeVedlegg={logiskeVedlegg}
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
