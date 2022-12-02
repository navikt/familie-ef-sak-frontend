import React from 'react';
import { IAnnenForelder } from '../Aleneomsorg/typer';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { FlexDiv } from '../../../Oppgavebenk/OppgaveFiltrering';
import { harVerdi } from '../../../../App/utils/utils';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';

interface Props {
    forelder: IAnnenForelder;
}

export const AnnenForelderNavnOgFnr: React.FC<Props> = ({ forelder }) => {
    const { navn, fødselsnummer, fødselsdato, dødsfall } = forelder;

    return (
        <FlexDiv>
            <BodyShortSmall>
                {harVerdi(navn) && navn !== 'ikke oppgitt' ? `${navn} - ` : 'Ikke oppgitt navn - '}
            </BodyShortSmall>
            <BodyShortSmall>
                {fødselsnummer ? (
                    <KopierbartNullableFødselsnummer fødselsnummer={fødselsnummer} />
                ) : fødselsdato ? (
                    formaterNullableIsoDato(fødselsdato)
                ) : (
                    '- '
                )}
            </BodyShortSmall>
            {dødsfall && <EtikettDød dødsdato={dødsfall} />}
        </FlexDiv>
    );
};
