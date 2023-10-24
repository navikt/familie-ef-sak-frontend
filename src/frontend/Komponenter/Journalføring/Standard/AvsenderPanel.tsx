import React, { useState } from 'react';
import { Checkbox, CopyButton, ExpansionCard, HStack, Label, TextField } from '@navikt/ds-react';
import styled from 'styled-components';
import { IJournalpostResponse } from '../../../App/typer/journalføring';
import { EnvelopeClosedFillIcon, EnvelopeClosedIcon } from '@navikt/aksel-icons';
import { ABlue500 } from '@navikt/ds-tokens/dist/tokens';
import { JournalføringStateRequest } from '../../../App/hooks/useJournalføringState';

const ExpansionCardHeader = styled(ExpansionCard.Header)`
    padding-bottom: 0.35rem;
`;

const ExpansionCardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-bottom: 1rem;
`;

const IconContainer = styled.div`
    color: ${ABlue500};
`;

const KopierPersonIdent = styled(CopyButton)`
    z-index: 2;
`;

const utledAvsender = (
    erAvsenderBruker: boolean,
    harRedigertAvsender: boolean,
    nyAvsender: string,
    gammelAvsender: string
): string => {
    if (erAvsenderBruker) return gammelAvsender;
    else if (nyAvsender !== '') return nyAvsender;
    else if (gammelAvsender !== '' && !harRedigertAvsender) return gammelAvsender;
    return harRedigertAvsender ? '' : 'Ukjent avsender';
};

interface Props {
    journalpostResponse: IJournalpostResponse;
    journalpostState: JournalføringStateRequest;
}

const AvsenderPanel: React.FC<Props> = ({ journalpostResponse, journalpostState }) => {
    const { journalpost, navn, personIdent } = journalpostResponse;
    const { nyAvsender, settNyAvsender } = journalpostState;

    const [erPanelEkspandert, settErPanelEkspandert] = useState<boolean>(false);
    const [erBrukerAvsender, settErBrukerAvsender] = useState<boolean>(navn !== '');
    const [harRedigertAvsender, settHarRedigertAvsender] = useState<boolean>(false);

    const avsender = utledAvsender(erBrukerAvsender, harRedigertAvsender, nyAvsender, navn);
    const brukerErAvsender = erBrukerAvsender || avsender === navn;

    return (
        <ExpansionCard
            id={journalpost.journalpostId}
            size="small"
            aria-label="journalpost"
            defaultOpen={avsender === 'Ukjent avsender'}
            onToggle={() => settErPanelEkspandert((prevState) => !prevState)}
        >
            <ExpansionCardHeader>
                <HStack gap="4">
                    <IconContainer>
                        {erPanelEkspandert ? (
                            <EnvelopeClosedFillIcon fontSize={'3.5rem'} />
                        ) : (
                            <EnvelopeClosedIcon fontSize={'3.5rem'} />
                        )}
                    </IconContainer>
                    <HStack align="center">
                        {brukerErAvsender ? (
                            <>
                                <Label as={'p'}>{`${avsender} - ${personIdent}`}</Label>
                                <KopierPersonIdent copyText={personIdent} variant="action" />
                            </>
                        ) : (
                            <Label as={'p'}>{avsender}</Label>
                        )}
                    </HStack>
                </HStack>
            </ExpansionCardHeader>
            <ExpansionCard.Content>
                <ExpansionCardContent>
                    <Checkbox
                        onChange={() => {
                            settErBrukerAvsender((prevState) => !prevState);
                            if (harRedigertAvsender) settHarRedigertAvsender(false);
                            settNyAvsender(
                                utledAvsender(
                                    erBrukerAvsender,
                                    harRedigertAvsender,
                                    nyAvsender,
                                    navn
                                )
                            );
                        }}
                        value={erBrukerAvsender}
                        checked={erBrukerAvsender}
                    >
                        Avsender er bruker
                    </Checkbox>
                    <TextField
                        disabled={erBrukerAvsender}
                        label={'Navn'}
                        onChange={(event) => {
                            settNyAvsender(event.target.value);
                            if (!harRedigertAvsender) settHarRedigertAvsender(true);
                        }}
                        size={'small'}
                        value={avsender}
                    />
                </ExpansionCardContent>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};

export default AvsenderPanel;
