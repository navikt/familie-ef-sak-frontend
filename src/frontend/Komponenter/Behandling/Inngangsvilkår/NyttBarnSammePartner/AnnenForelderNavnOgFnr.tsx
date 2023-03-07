import React from 'react';
import { IAnnenForelder } from '../Aleneomsorg/typer';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { FlexDiv } from '../../../Oppgavebenk/OppgaveFiltrering';
import { harVerdi } from '../../../../App/utils/utils';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { LenkeTilPersonopplysningsside } from '../../../../Felles/Lenker/LenkeTilPersonopplysningsside';
import styled from 'styled-components';

interface Props {
    forelder: IAnnenForelder;
}

const FlexDivMedGap = styled(FlexDiv)`
    gap: 0.5rem;
`;

export const AnnenForelderNavnOgFnr: React.FC<Props> = ({ forelder }) => {
    const { navn, fødselsnummer, fødselsdato, dødsfall } = forelder;

    return (
        <FlexDivMedGap>
            <LenkeTilPersonopplysningsside personIdent={fødselsnummer}>
                {harVerdi(navn) && navn !== 'ikke oppgitt' ? `${navn}` : 'Ikke oppgitt navn'}
            </LenkeTilPersonopplysningsside>
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
        </FlexDivMedGap>
    );
};
