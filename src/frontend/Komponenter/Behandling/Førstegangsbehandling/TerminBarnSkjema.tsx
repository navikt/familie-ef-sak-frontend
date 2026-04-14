import React, { useEffect } from 'react';
import { BarnSomSkalFødes } from '../../../App/hooks/useJournalføringState';
import { BodyLong, BodyShort, Heading } from '@navikt/ds-react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { erGyldigDato } from '../../../App/utils/dato';
import { Datovelger } from '../../../Felles/Datovelger/Datovelger';
import LeggTilKnapp from '../../../Felles/Knapper/LeggTilKnapp';
import FjernKnapp from '../../../Felles/Knapper/FjernKnapp';
import { Accent400 } from "@navikt/ds-tokens/js";

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
    barnSomSkalFødes: BarnSomSkalFødes[];
    oppdaterBarnSomSkalFødes: (terminbarn: BarnSomSkalFødes[]) => void;
    tittel: string;
    tekst: string;
}

export const TerminBarnSkjema: React.FC<Props> = ({
    barnSomSkalFødes,
    oppdaterBarnSomSkalFødes,
    tittel,
    tekst,
}) => {
    useEffect(() => () => oppdaterBarnSomSkalFødes([]), [oppdaterBarnSomSkalFødes]);

    const leggTilBarn = () => oppdaterBarnSomSkalFødes([...barnSomSkalFødes, { _id: uuidv4() }]);

    const fjernBarn = (terminbarnSomSkalSlettes: BarnSomSkalFødes) =>
        oppdaterBarnSomSkalFødes(
            barnSomSkalFødes.filter((barn) => barn !== terminbarnSomSkalSlettes)
        );

    const oppdaterTermindato = (id: string, dato: string) =>
        oppdaterBarnSomSkalFødes(
            barnSomSkalFødes.map((barn) =>
                barn._id === id
                    ? {
                          ...barn,
                          fødselTerminDato: dato as string,
                      }
                    : barn
            )
        );

    return (
        <div>
            <Tittel spacing size="xsmall" level="6">
                {tittel}
            </Tittel>
            <FlexColumn>
                <BodyLong>{tekst}</BodyLong>
                {barnSomSkalFødes.map((barn, index) => (
                    <Grid key={barn._id}>
                        <BodyShort>Terminbarn {index + 1}</BodyShort>
                        <Datovelger
                            id={'Termindato'}
                            label={''}
                            placeholder={'Termindato'}
                            settVerdi={(dato) => oppdaterTermindato(barn._id, dato as string)}
                            verdi={barn.fødselTerminDato}
                            feil={
                                barn.fødselTerminDato && !erGyldigDato(barn.fødselTerminDato)
                                    ? 'Ugyldig dato'
                                    : undefined
                            }
                        />
                        <FjernKnapp onClick={() => fjernBarn(barn)} />
                    </Grid>
                ))}
                <LeggTilKnapp
                    variant={'tertiary'}
                    size={'small'}
                    onClick={leggTilBarn}
                    knappetekst={'Legg til termindato'}
                />
            </FlexColumn>
        </div>
    );
};
