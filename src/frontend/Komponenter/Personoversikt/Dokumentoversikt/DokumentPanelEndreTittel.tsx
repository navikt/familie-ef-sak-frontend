import React from 'react';
import { ExpansionCard } from '@navikt/ds-react';
import styled from 'styled-components';
import { DokumentPanelHeader } from '../../Journalføring/Standard/DokumentPanelHeader';
import { FamilieReactSelect } from '@navikt/familie-form-elements';
import {
    dokumentTitlerMultiSelect,
    mapDokumentTittelTilMultiselectValue,
    mapLogiskeVedleggTilMultiselectValue,
} from '../../Journalføring/Felles/utils';
import { Dokumentinfo } from '../../../App/typer/dokumentliste';

const ExpansionCardHeader = styled(ExpansionCard.Header)`
    padding-bottom: 0.35rem;
`;

const ExpansionCardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding-bottom: 1rem;
`;

const MultiSelect = styled(FamilieReactSelect)`
    margin-bottom: -1rem;
`;

interface Props {
    dokument: Dokumentinfo;
}

export const DokumentPanelEndreTittel: React.FC<Props> = ({ dokument }) => {
    const defaultTittelValue = mapDokumentTittelTilMultiselectValue(dokument.tittel);
    const defaultLogiskeVedleggValue = mapLogiskeVedleggTilMultiselectValue(
        dokument.logiskeVedlegg
    );

    return (
        <ExpansionCard id={dokument.dokumentinfoId} size="small" aria-label="journalpost">
            <ExpansionCardHeader>
                <DokumentPanelHeader
                    dokumentTittel={dokument.tittel}
                    erValgt={true}
                    logiskeVedlegg={dokument.logiskeVedlegg}
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
                        onChange={() => null}
                    />
                    <MultiSelect
                        placeholder={'Velg innhold'}
                        label={'Annet innhold'}
                        creatable={true}
                        options={dokumentTitlerMultiSelect}
                        menuPortalTarget={document.querySelector('body')}
                        isMulti={true}
                        isDisabled={false}
                        defaultValue={defaultLogiskeVedleggValue}
                        feil={null}
                        onChange={() => null}
                    />
                </ExpansionCardContent>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};
