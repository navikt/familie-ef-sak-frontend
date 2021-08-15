import React from 'react';
import { IAnnenForelder } from '../Aleneomsorg/typer';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { FlexDiv } from '../../../Oppgavebenk/OppgaveFiltrering';
import { Normaltekst } from 'nav-frontend-typografi';
import { harVerdi } from '../../../../App/utils/utils';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';

interface Props {
    forelder: IAnnenForelder;
}

export const AnnenForelderNavnOgFnr: React.FC<Props> = ({ forelder }) => {
    const { navn, fødselsnummer, fødselsdato, dødsfall } = forelder;

    return (
        <FlexDiv>
            <Normaltekst>
                {harVerdi(navn) && navn !== 'ikke oppgitt' ? `${navn} - ` : 'Ikke oppgitt navn - '}
            </Normaltekst>
            <Normaltekst>
                {fødselsnummer ? (
                    <KopierbartNullableFødselsnummer fødselsnummer={fødselsnummer} />
                ) : fødselsdato ? (
                    formaterNullableIsoDato(fødselsdato)
                ) : (
                    '- '
                )}
            </Normaltekst>
            {dødsfall && <EtikettDød dødsdato={dødsfall} />}
        </FlexDiv>
    );
};
