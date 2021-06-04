import React from 'react';
import { IAnnenForelder } from '../Aleneomsorg/typer';
import { KopierbartNullableFødselsnummer } from '../../../Felleskomponenter/KopierbartNullableFødselsnummer';
import { formaterNullableIsoDato } from '../../../../utils/formatter';

interface Props {
    forelder: IAnnenForelder;
}

export const AnnenForelderNavnOgFnr: React.FC<Props> = ({ forelder }) => {
    const { navn, fødselsnummer, fødselsdato } = forelder;
    console.log(forelder);

    return (
        <>
            {navn !== 'ikke oppgitt' ? `${navn} - ` : 'Ikke oppgitt navn - '}
            {fødselsnummer ? (
                <KopierbartNullableFødselsnummer fødselsnummer={fødselsnummer} />
            ) : (
                formaterNullableIsoDato(fødselsdato)
            )}
        </>
    );
};
