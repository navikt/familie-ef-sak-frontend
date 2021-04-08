import React from 'react';
import { IAnnenForelder } from './typer';
import { harVerdi } from '../../../../utils/utils';
import { AnnenForelderNavnogFnr } from '../NyttBarnSammePartner/AnnenForelderNavnOgFnr';
import { KopierbartNullableFødselsnummer } from '../../../Felleskomponenter/KopierbartNullableFødselsnummer';
import { formaterNullableIsoDato } from '../../../../utils/formatter';

interface Props {
    forelder?: IAnnenForelder;
    ikkeOppgittAnnenForelderBegrunnelse?: string;
}

export const AnnenForelderSøknad: React.FC<Props> = ({
    forelder,
    ikkeOppgittAnnenForelderBegrunnelse,
}) => {
    const { navn, fødselsnummer, fødselsdato } = forelder || {};

    const erFnrEllerFødselsdatoUtfylt: boolean = harVerdi(fødselsnummer) || harVerdi(fødselsdato);

    if (harVerdi(navn)) {
        return <AnnenForelderNavnogFnr forelder={forelder} />;
    } else if (erFnrEllerFødselsdatoUtfylt) {
        return (
            <>
                {`Ikke oppgitt navn - `}
                {fødselsnummer ? (
                    <KopierbartNullableFødselsnummer fødselsnummer={fødselsnummer} />
                ) : (
                    formaterNullableIsoDato(fødselsdato)
                )}
            </>
        );
    } else {
        return <>`Ikke oppgitt: ${ikkeOppgittAnnenForelderBegrunnelse}`</>;
    }
};
