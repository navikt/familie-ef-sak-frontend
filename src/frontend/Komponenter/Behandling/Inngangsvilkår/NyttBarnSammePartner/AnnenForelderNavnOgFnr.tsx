import React from 'react';
import { IAnnenForelder, IBarnMedSamværSøknadsgrunnlag } from '../Aleneomsorg/typer';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { harVerdi } from '../../../../App/utils/utils';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { LenkeTilPersonopplysningsside } from '../../../../Felles/Lenker/LenkeTilPersonopplysningsside';
import { HStack } from '@navikt/ds-react';

interface Props {
    forelder: IAnnenForelder;
    søknadsgrunnlag?: IBarnMedSamværSøknadsgrunnlag;
    skalViseDato?: boolean;
}

export const AnnenForelderNavnOgFnr: React.FC<Props> = ({
    forelder,
    søknadsgrunnlag,
    skalViseDato,
}) => {
    const { navn, fødselsnummer, fødselsdato, dødsfall } = forelder;

    const { ikkeOppgittAnnenForelderBegrunnelse } = søknadsgrunnlag || {};
    const { fødselsdato: fødselsdatoAnnenForelder } = søknadsgrunnlag?.forelder || {};

    return (
        <HStack gap={'space-4'} align={'center'}>
            <LenkeTilPersonopplysningsside personIdent={fødselsnummer}>
                {harVerdi(navn) && navn?.toLocaleLowerCase() !== 'ikke oppgitt'
                    ? `${navn}`
                    : 'Ikke oppgitt:'}
            </LenkeTilPersonopplysningsside>

            <BodyShortSmall>
                {ikkeOppgittAnnenForelderBegrunnelse && ikkeOppgittAnnenForelderBegrunnelse}
                {fødselsdatoAnnenForelder && formaterNullableIsoDato(fødselsdatoAnnenForelder)}

                {fødselsnummer ? (
                    <KopierbartNullableFødselsnummer fødselsnummer={fødselsnummer} />
                ) : fødselsdato ? (
                    formaterNullableIsoDato(fødselsdato)
                ) : (
                    ''
                )}
            </BodyShortSmall>

            {dødsfall && <EtikettDød dødsdato={dødsfall} skalViseDato={skalViseDato} />}
        </HStack>
    );
};
