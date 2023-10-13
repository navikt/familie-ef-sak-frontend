import React, { useState } from 'react';
import { Checkbox, ExpansionCard, Label, TextField } from '@navikt/ds-react';
import styled from 'styled-components';
import { IJournalpostResponse } from '../../../App/typer/journalføring';
import { EnvelopeClosedFillIcon, EnvelopeClosedIcon } from '@navikt/aksel-icons';
import { ABlue500 } from '@navikt/ds-tokens/dist/tokens';

const ExpansionCardHeader = styled(ExpansionCard.Header)`
    padding-bottom: 0.35rem;
`;

const ExpansionCardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding-bottom: 1rem;
`;

const FlexRow = styled.div`
    display: flex;
    gap: 1rem;
`;

const IconContainer = styled.div`
    color: ${ABlue500};
`;

const Tittel = styled.div`
    display: flex;
    align-items: center;
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
}

const AvsenderPanel: React.FC<Props> = ({ journalpostResponse }) => {
    const [erBrukerAvsender, settErBrukerAvsender] = useState<boolean>(false);
    const [harRedigertAvsender, settHarRedigertAvsender] = useState<boolean>(false);
    const [nyAvsender, settNyAvsender] = useState<string>('');
    const valgt = false;
    const avsender = utledAvsender(
        erBrukerAvsender,
        harRedigertAvsender,
        nyAvsender,
        journalpostResponse.navn
    );

    return (
        <ExpansionCard
            id={journalpostResponse.journalpost.journalpostId}
            size="small"
            aria-label="journalpost"
            defaultOpen={avsender === 'Ukjent avsender'}
        >
            <ExpansionCardHeader>
                <FlexRow>
                    <IconContainer>
                        {valgt ? (
                            <EnvelopeClosedFillIcon fontSize={'3.5rem'} />
                        ) : (
                            <EnvelopeClosedIcon fontSize={'3.5rem'} />
                        )}
                    </IconContainer>
                    <Tittel>
                        <Label as={'p'}>{avsender}</Label>
                    </Tittel>
                </FlexRow>
            </ExpansionCardHeader>
            <ExpansionCard.Content>
                <ExpansionCardContent>
                    <Checkbox
                        onChange={() => {
                            settErBrukerAvsender((prevState) => !prevState);
                            if (harRedigertAvsender) settHarRedigertAvsender(false);
                        }}
                        value={erBrukerAvsender}
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
                        value={avsender}
                    />
                </ExpansionCardContent>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};

export default AvsenderPanel;
