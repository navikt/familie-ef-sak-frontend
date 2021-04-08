import React from 'react';
import { IAnnenForelder } from '../Aleneomsorg/typer';
import { KopierbartNullableFødselsnummer } from '../../../Felleskomponenter/KopierbartNullableFødselsnummer';
import { formaterNullableIsoDato } from '../../../../utils/formatter';

export const AnnenForelderNavnogFnr: React.FC<{ forelder?: IAnnenForelder }> = ({ forelder }) => {
    if (!forelder || !forelder.navn || forelder.navn === 'ikke oppgitt') {
        return null;
    } else if (forelder?.fødselsnummer) {
        return (
            <>
                {forelder.navn + ' - '}
                <KopierbartNullableFødselsnummer fødselsnummer={forelder.fødselsnummer} />
            </>
        );
    } else {
        return (
            <>
                {`${forelder?.navn} ${
                    forelder?.fødselsdato
                        ? '- ' + formaterNullableIsoDato(forelder.fødselsdato)
                        : ''
                } `}
            </>
        );
    }
};
