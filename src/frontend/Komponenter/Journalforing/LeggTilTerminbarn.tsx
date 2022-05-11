import React from 'react';
import { FamilieDatovelger } from '@navikt/familie-form-elements';
import LeggtilMedSirkel from '../../Felles/Ikoner/LeggtilMedSirkel';
import SlettSøppelkasse from '../../Felles/Ikoner/SlettSøppelkasse';
import { Terminbarn } from '../../App/hooks/useJournalføringState';
import { Button, Heading } from '@navikt/ds-react';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';

const Tittel = styled(Heading)`
    color: ${navFarger.navBlaLighten40};
`;

const LeggTilTerminbarnContent = styled.div`
    margin: 0.5rem 0;
`;

const InlineContent = styled.div`
    border-left: 2px solid ${navFarger.navBlaLighten40};
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

const FjernTerminbarnKnapp = styled(Button)`
    width: 4rem;
`;
const LeggTilTerminbarnKnapp = styled(Button)`
    margin-top: 1rem;
`;

const LeggTilTerminbarn: React.FC<{
    terminbarn: Terminbarn[];
    oppdaterTerminbarn: (terminbarn: Terminbarn[]) => void;
}> = ({ terminbarn: terminbarnliste, oppdaterTerminbarn }) => {
    const leggTilTerminbarn = () => oppdaterTerminbarn([...terminbarnliste, {}]);

    const fjernTerminbarn = (terminbarnSomSkalSlettes: Terminbarn) =>
        oppdaterTerminbarn(terminbarnliste.filter((t) => t !== terminbarnSomSkalSlettes));

    const oppdaterTermindato = (terminbarnSomSkalOppdateres: Terminbarn, dato: string) =>
        oppdaterTerminbarn(
            terminbarnliste.map((t) =>
                t === terminbarnSomSkalOppdateres ? { fødselTerminDato: dato as string } : t
            )
        );

    return (
        <LeggTilTerminbarnContent>
            <Tittel spacing size="xsmall" level="6">
                Journalføre papirsøknad?
            </Tittel>
            <InlineContent>
                Noe tekst
                {terminbarnliste.map((terminbarn, index) => (
                    <TerminbarnMedDatovelger key={index}>
                        <div>Terminbarn {index + 9}</div>
                        <FamilieDatovelger
                            id={'Termindato'}
                            label={'Termindato'}
                            onChange={(dato) => oppdaterTermindato(terminbarn, dato as string)}
                            valgtDato={terminbarn.fødselTerminDato}
                        />
                        <FjernTerminbarnKnapp
                            variant="tertiary"
                            size="small"
                            onClick={() => fjernTerminbarn(terminbarn)}
                        >
                            <SlettSøppelkasse withDefaultStroke={false} />
                        </FjernTerminbarnKnapp>
                    </TerminbarnMedDatovelger>
                ))}
                <div>
                    <LeggTilTerminbarnKnapp
                        variant="tertiary"
                        size="small"
                        onClick={leggTilTerminbarn}
                    >
                        <LeggtilMedSirkel width={24} heigth={24} />
                        <span>Legg til termindato</span>
                    </LeggTilTerminbarnKnapp>
                </div>
            </InlineContent>
        </LeggTilTerminbarnContent>
    );
};

export default LeggTilTerminbarn;
