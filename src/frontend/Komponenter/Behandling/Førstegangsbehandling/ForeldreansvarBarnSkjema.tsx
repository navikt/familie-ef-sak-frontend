import React, { useEffect } from 'react';
import { ForeldreansvarBarn } from '../../../App/hooks/useJournalføringState';
import { BodyLong, BodyShort, Heading, TextField } from '@navikt/ds-react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { fnr } from '@navikt/fnrvalidator';
import LeggTilKnapp from '../../../Felles/Knapper/LeggTilKnapp';
import FjernKnapp from '../../../Felles/Knapper/FjernKnapp';
import { Accent400 } from '@navikt/ds-tokens/js';

const Tittel = styled(Heading)`
    color: ${Accent400};
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    border-left: 2px solid ${Accent400};
    padding-left: 2rem;
    margin-left: 1rem;
    gap: 0.5rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, max-content);
    column-gap: 1rem;
    align-items: center;

    .navds-form-field {
        gap: 0;
    }
`;

interface Props {
    foreldreansvarBarn: ForeldreansvarBarn[];
    oppdaterForeldreansvarBarn: (foreldreansvarBarn: ForeldreansvarBarn[]) => void;
}

export const ForeldreansvarBarnSkjema: React.FC<Props> = ({
    foreldreansvarBarn,
    oppdaterForeldreansvarBarn,
}) => {
    useEffect(() => () => oppdaterForeldreansvarBarn([]), [oppdaterForeldreansvarBarn]);

    const leggTilBarn = () =>
        oppdaterForeldreansvarBarn([...foreldreansvarBarn, { _id: uuidv4() }]);

    const fjernBarn = (barnSomSkalSlettes: ForeldreansvarBarn) =>
        oppdaterForeldreansvarBarn(
            foreldreansvarBarn.filter((barn) => barn !== barnSomSkalSlettes)
        );

    const oppdaterFødselsnummer = (id: string, fødselsnummer: string) =>
        oppdaterForeldreansvarBarn(
            foreldreansvarBarn.map((barn) => (barn._id === id ? { ...barn, fødselsnummer } : barn))
        );

    const fnrFeil = (fødselsnummer?: string): string | undefined => {
        if (!fødselsnummer || fødselsnummer.trim() === '') return undefined;
        return fnr(fødselsnummer).status === 'invalid' ? 'Ugyldig fødselsnummer' : undefined;
    };

    return (
        <div>
            <Tittel spacing size="xsmall" level="6">
                Foreldreansvar barn
            </Tittel>
            <FlexColumn>
                <BodyLong>
                    Barn som bruker har overtatt foreldreansvaret for etter Barneloven § 38
                </BodyLong>
                {foreldreansvarBarn.map((barn, index) => (
                    <Grid key={barn._id}>
                        <BodyShort>Foreldreansvar barn {index + 1}</BodyShort>
                        <TextField
                            label=""
                            placeholder="Fødselsnummer"
                            autoComplete="off"
                            size="small"
                            value={barn.fødselsnummer ?? ''}
                            onChange={(e) => oppdaterFødselsnummer(barn._id, e.target.value)}
                            error={fnrFeil(barn.fødselsnummer)}
                        />
                        <FjernKnapp onClick={() => fjernBarn(barn)} />
                    </Grid>
                ))}
                <LeggTilKnapp
                    variant={'tertiary'}
                    size={'small'}
                    onClick={leggTilBarn}
                    knappetekst={'Legg til foreldreansvar barn'}
                />
            </FlexColumn>
        </div>
    );
};
