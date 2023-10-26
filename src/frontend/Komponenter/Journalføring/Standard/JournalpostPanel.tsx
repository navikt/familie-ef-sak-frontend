import React, { useState } from 'react';
import { BodyShort, ExpansionCard, Heading, Select } from '@navikt/ds-react';
import styled from 'styled-components';
import { FolderFileFillIcon, FolderFileIcon } from '@navikt/aksel-icons';
import { ABlue500 } from '@navikt/ds-tokens/dist/tokens';
import {
    behandlingstemaTilTemaTekst,
    Stønadstype,
    stønadstypeTilTekst,
} from '../../../App/typer/behandlingstema';
import { IJournalpost } from '../../../App/typer/journalføring';
import { formaterIsoDato } from '../../../App/utils/formatter';
import {
    Journalføringsårsak,
    journalføringsårsakTilTekst,
    valgbareJournalføringsårsaker,
} from '../Felles/utils';
import { JournalføringStateRequest } from '../../../App/hooks/useJournalføringState';

const FlexRow = styled.div`
    display: flex;
    gap: 1rem;
`;

const IkonContainer = styled.div`
    color: ${ABlue500};
`;

const ExpansionCardHeader = styled(ExpansionCard.Header)`
    padding-bottom: 0.25rem;
`;

const ExpansionCardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-bottom: 1rem;
`;

const StyledSelect = styled(Select)`
    max-width: 13rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, max-content);
    column-gap: 1.5rem;
`;

interface Props {
    journalpost: IJournalpost;
    journalpostState: JournalføringStateRequest;
}

const JournalpostPanel: React.FC<Props> = ({ journalpost, journalpostState }) => {
    const { journalføringsårsak, settJournalføringsårsak, stønadstype, settStønadstype } =
        journalpostState;

    const [erPanelEkspandert, settErPanelEkspandert] = useState<boolean>(false);

    const tema = behandlingstemaTilTemaTekst(journalpost.behandlingstema);
    const datoMottatt = formaterIsoDato(journalpost.datoMottatt);
    const kanRedigere = journalføringsårsak !== Journalføringsårsak.DIGITAL_SØKNAD;
    const valgbareStønadstyper = [
        Stønadstype.OVERGANGSSTØNAD,
        Stønadstype.BARNETILSYN,
        Stønadstype.SKOLEPENGER,
    ];

    return (
        <ExpansionCard
            id={journalpost.journalpostId}
            size="small"
            aria-label="journalpost"
            onToggle={() => settErPanelEkspandert((prevState) => !prevState)}
        >
            <ExpansionCardHeader>
                <FlexRow>
                    <IkonContainer>
                        {erPanelEkspandert ? (
                            <FolderFileFillIcon fontSize={'3.5rem'} />
                        ) : (
                            <FolderFileIcon fontSize={'3.5rem'} />
                        )}
                    </IkonContainer>
                    <Grid>
                        <Heading size={'small'} level={'2'}>
                            Tema:
                        </Heading>
                        <Heading size={'small'} level={'2'}>
                            Stønadstype:
                        </Heading>
                        <Heading size={'small'} level={'2'}>
                            Type:
                        </Heading>
                        <Heading size={'small'} level={'2'}>
                            Mottatt:
                        </Heading>
                        <BodyShort>{tema}</BodyShort>
                        <BodyShort>
                            {stønadstype ? stønadstypeTilTekst[stønadstype] : 'Ikke valgt'}
                        </BodyShort>
                        <BodyShort>{journalføringsårsakTilTekst[journalføringsårsak]}</BodyShort>
                        <BodyShort>{datoMottatt}</BodyShort>
                    </Grid>
                </FlexRow>
            </ExpansionCardHeader>
            <ExpansionCard.Content>
                <ExpansionCardContent>
                    <StyledSelect
                        label="Stønadstype"
                        size="small"
                        value={stønadstype}
                        onChange={(event) => {
                            settStønadstype(event.target.value as Stønadstype);
                        }}
                        disabled={!kanRedigere}
                    >
                        <option key={'Ikke valgt'} value={''}>
                            Ikke valgt
                        </option>
                        {valgbareStønadstyper.map((stønadstype) => {
                            return (
                                <option key={stønadstype} value={stønadstype}>
                                    {stønadstypeTilTekst[stønadstype]}
                                </option>
                            );
                        })}
                    </StyledSelect>
                    <StyledSelect
                        label="Type"
                        size="small"
                        value={journalføringsårsak}
                        onChange={(event) =>
                            settJournalføringsårsak(event.target.value as Journalføringsårsak)
                        }
                        disabled={!kanRedigere}
                    >
                        {valgbareJournalføringsårsaker.map((type) => (
                            <option key={type} value={type}>
                                {journalføringsårsakTilTekst[type]}
                            </option>
                        ))}
                    </StyledSelect>
                </ExpansionCardContent>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};

export default JournalpostPanel;
