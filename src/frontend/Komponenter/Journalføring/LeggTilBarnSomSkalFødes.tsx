import React, { useEffect } from 'react';
import { FamilieDatovelger } from '@navikt/familie-form-elements';
import LeggtilMedSirkel from '../../Felles/Ikoner/LeggtilMedSirkel';
import SlettSøppelkasse from '../../Felles/Ikoner/SlettSøppelkasse';
import { BarnSomSkalFødes } from '../../App/hooks/useJournalføringState';
import { Button, Heading } from '@navikt/ds-react';
import styled from 'styled-components';
import { NavdsGlobalColorBlue300 } from '@navikt/ds-tokens/dist/tokens';
import { v4 as uuidv4 } from 'uuid';
import { erGyldigDato } from '../../App/utils/dato';

const Tittel = styled(Heading)`
    color: ${NavdsGlobalColorBlue300};
`;

const LeggTilBarnContent = styled.div`
    margin: 0.5rem 0;
`;

const InlineContent = styled.div`
    border-left: 2px solid ${NavdsGlobalColorBlue300};
    padding-left: 1rem;
    margin-left: 1rem;
`;

const TerminbarnMedDatovelger = styled.div`
    display: grid;
    grid-auto-columns: minmax(auto, 12rem);
    grid-auto-flow: column;

    > * {
        align-self: flex-end;
        padding: 0.5rem 0.5rem;
    }
`;

const FjernBarnKnapp = styled(Button)`
    width: 4rem;
    margin-bottom: 0.5rem;
`;
const LeggTilBarnKnapp = styled(Button)`
    margin-top: 1rem;
`;

const LeggTilBarnSomSkalFødes: React.FC<{
    barnSomSkalFødes: BarnSomSkalFødes[];
    oppdaterBarnSomSkalFødes: (terminbarn: BarnSomSkalFødes[]) => void;
}> = ({ barnSomSkalFødes, oppdaterBarnSomSkalFødes }) => {
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
        <LeggTilBarnContent>
            <Tittel spacing size="xsmall" level="6">
                Journalføre papirsøknad?
            </Tittel>
            <InlineContent>
                Dersom søkeren har terminbarn i søknaden må disse legges til her.
                {barnSomSkalFødes.map((barn, index) => (
                    <TerminbarnMedDatovelger key={barn._id}>
                        <div>Terminbarn {index + 1}</div>
                        <FamilieDatovelger
                            id={'Termindato'}
                            label={'Termindato'}
                            onChange={(dato) => oppdaterTermindato(barn._id, dato as string)}
                            valgtDato={barn.fødselTerminDato}
                            feil={
                                barn.fødselTerminDato && !erGyldigDato(barn.fødselTerminDato)
                                    ? 'Ugyldig dato'
                                    : undefined
                            }
                        />
                        <FjernBarnKnapp
                            variant="tertiary"
                            size="small"
                            onClick={() => fjernBarn(barn)}
                            icon={<SlettSøppelkasse withDefaultStroke={false} />}
                        />
                    </TerminbarnMedDatovelger>
                ))}
                <div>
                    <LeggTilBarnKnapp
                        variant="tertiary"
                        size="small"
                        onClick={leggTilBarn}
                        icon={<LeggtilMedSirkel width={24} heigth={24} />}
                    >
                        <span>Legg til termindato</span>
                    </LeggTilBarnKnapp>
                </div>
            </InlineContent>
        </LeggTilBarnContent>
    );
};

export default LeggTilBarnSomSkalFødes;
