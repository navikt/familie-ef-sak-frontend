import React, { useEffect, useState } from 'react';
import { FamilieDatovelger } from '@navikt/familie-form-elements';
import { Flatknapp } from 'nav-frontend-knapper';
import LeggtilMedSirkel from '../../Felles/Ikoner/LeggtilMedSirkel';
import { formaterIsoDato } from '../../App/utils/formatter';
import LenkeKnapp from '../../Felles/Knapper/LenkeKnapp';
import SlettSøppelkasse from '../../Felles/Ikoner/SlettSøppelkasse';
import { Terminbarn } from '../../App/hooks/useJournalføringState';

const LeggTilTerminbarn: React.FC<{
    oppdaterTerminbarn: (terminbarn: Terminbarn[]) => void;
}> = ({ oppdaterTerminbarn }) => {
    const [terminbarn, settTerminbarn] = useState<Terminbarn[]>([]);
    const [termindato, settTermindato] = useState<string>();

    useEffect(() => oppdaterTerminbarn(terminbarn), [oppdaterTerminbarn, terminbarn]);

    const leggTilTerminbarn = () => {
        if (!termindato) return;
        settTerminbarn((prevState) => [...prevState, { fødselTerminDato: termindato }]);
        settTermindato(undefined);
    };

    const fjernTerminbarn = (terminbarnSomSkalSlettes: Terminbarn) =>
        settTerminbarn((prevState) => prevState.filter((t) => t !== terminbarnSomSkalSlettes));

    return (
        <>
            <FamilieDatovelger
                id={'legg-til.termindato'}
                label={'Termindato'}
                onChange={(dato) => {
                    settTermindato(dato as string);
                }}
                valgtDato={termindato}
            />
            <Flatknapp onClick={leggTilTerminbarn}>
                <LeggtilMedSirkel />
                <span>Legg til termindato</span>
            </Flatknapp>

            {terminbarn.map((terminbarn, index) => (
                <div key={index}>
                    {formaterIsoDato(terminbarn.fødselTerminDato)}
                    <LenkeKnapp onClick={() => fjernTerminbarn(terminbarn)}>
                        <SlettSøppelkasse withDefaultStroke={false} />
                    </LenkeKnapp>
                </div>
            ))}
        </>
    );
};

export default LeggTilTerminbarn;
