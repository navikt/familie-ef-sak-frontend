import React from 'react';
import { BodyShort, ExpansionCard, Heading, Select } from '@navikt/ds-react';
import styled from 'styled-components';
import { FolderFileFillIcon } from '@navikt/aksel-icons';
import { ABlue500 } from '@navikt/ds-tokens/dist/tokens';
import {
    behandlingstemaTilTekst,
    behandlingstemaTilTemaTekst,
} from '../../../App/typer/behandlingstema';
import { IJournalpost } from '../../../App/typer/journalføring';
import { formaterIsoDato } from '../../../App/utils/formatter';

const FlexRow = styled.div`
    display: flex;
    gap: 1rem;
`;

const IconContainer = styled.div`
    color: ${ABlue500};
`;

const ExpansionCardHeader = styled(ExpansionCard.Header)`
    padding-bottom: 0.25rem; // TODO: Er denne ønskelig?
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
}

const JournalpostPanel: React.FC<Props> = ({ journalpost }) => {
    const tema = behandlingstemaTilTemaTekst(journalpost.behandlingstema);
    const stønadstype = journalpost.behandlingstema
        ? behandlingstemaTilTekst[journalpost.behandlingstema]
        : undefined;
    const datoMottatt = formaterIsoDato(journalpost.datoMottatt);

    return (
        <ExpansionCard id={journalpost.journalpostId} size="small" aria-label="journalpost">
            <ExpansionCardHeader>
                <FlexRow>
                    <IconContainer>
                        <FolderFileFillIcon fontSize={'3.5rem'} />
                    </IconContainer>
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
                        <BodyShort>{stønadstype}</BodyShort>
                        {/*TODO: Hvordan utlede denne (ettersending, søknad, etc.)*/}
                        <BodyShort>Hvordan utlede denne?</BodyShort>
                        <BodyShort>{datoMottatt}</BodyShort>
                    </Grid>
                </FlexRow>
            </ExpansionCardHeader>
            <ExpansionCard.Content>
                <ExpansionCardContent>
                    <StyledSelect label="Tema" size="small">
                        <option>Overgangsstønad</option>
                        <option>Barnetilsyn</option>
                        <option>Skolpenger</option>
                    </StyledSelect>
                    <StyledSelect label="Gjelder" size="small">
                        <option>Overgangsstønad</option>
                        <option>Barnetilsyn</option>
                        <option>Skolpenger</option>
                    </StyledSelect>
                    <StyledSelect label="Type" size="small">
                        <option>Overgangsstønad</option>
                        <option>Barnetilsyn</option>
                        <option>Skolpenger</option>
                    </StyledSelect>
                </ExpansionCardContent>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};

export default JournalpostPanel;
