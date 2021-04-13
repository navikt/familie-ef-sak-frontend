import React from 'react';
import { IAnnenForelder } from '../Aleneomsorg/typer';
import { harVerdi } from '../../../../utils/utils';
import { KopierbartNullableFødselsnummer } from '../../../Felleskomponenter/KopierbartNullableFødselsnummer';
import { formaterNullableIsoDato } from '../../../../utils/formatter';

interface Props {
    forelder?: IAnnenForelder;
    ikkeOppgittAnnenForelderBegrunnelse?: string;
}

export const AnnenForelderNavnOgFnr: React.FC<Props> = ({
    forelder,
    ikkeOppgittAnnenForelderBegrunnelse,
}) => {
    const { navn, fødselsnummer, fødselsdato } = forelder || {};

    const erFnrEllerFødselsdatoUtfylt: boolean = harVerdi(fødselsnummer) || harVerdi(fødselsdato);

    if (!forelder && !ikkeOppgittAnnenForelderBegrunnelse) {
        return null;
    } else if (erFnrEllerFødselsdatoUtfylt) {
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
    } else {
        return <>{`Ikke oppgitt: ${ikkeOppgittAnnenForelderBegrunnelse}`}</>;
    }
};
