import React, { FC } from 'react';
import { RegistergrunnlagNyttBarn } from './typer';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import LiteBarn from '../../../../Felles/Ikoner/LiteBarn';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { AnnenForelderNavnOgFnr } from './AnnenForelderNavnOgFnr';
import { harVerdi } from '../../../../App/utils/utils';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';
import { Label } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { utledNavnLabel } from '../utils';

interface Props {
    barn: RegistergrunnlagNyttBarn;
}

const RegistergrunnlagNyttBarnInnhold: FC<Props> = ({ barn }) => {
    const { annenForelderRegister, fødselsdato, navn } = barn;

    const ikkeOppgittAnnenForelderBegrunnelse = barn.ikkeOppgittAnnenForelderBegrunnelse;

    return (
        <GridTabell>
            <>
                <LiteBarn />
                <Label size={'small'} as={'div'}>
                    {utledNavnLabel(navn, fødselsdato)}
                    {barn.dødsdato && <EtikettDød dødsdato={barn.dødsdato} />}
                </Label>
            </>
            <>
                <Registergrunnlag />
                <BodyShortSmall>Fødsels eller D-nummer</BodyShortSmall>
                <BodyShortSmall>{barn.fødselsnummer}</BodyShortSmall>
            </>

            {annenForelderRegister && (
                <>
                    <Registergrunnlag />
                    <BodyShortSmall>Annen forelder fra folkeregister</BodyShortSmall>
                    <AnnenForelderNavnOgFnr forelder={annenForelderRegister} />
                </>
            )}

            {harVerdi(ikkeOppgittAnnenForelderBegrunnelse) && (
                <>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Annen forelder</BodyShortSmall>
                    <BodyShortSmall>
                        {ikkeOppgittAnnenForelderBegrunnelse === 'donorbarn'
                            ? ikkeOppgittAnnenForelderBegrunnelse
                            : `Ikke oppgitt: ${ikkeOppgittAnnenForelderBegrunnelse}`}
                    </BodyShortSmall>
                </>
            )}

            {barn.annenForelderRegister?.dødsfall && (
                <>
                    <Registergrunnlag />
                    <BodyShortSmall>Annen forelder dødsdato</BodyShortSmall>
                    <BodyShortSmall>
                        {formaterNullableIsoDato(barn.annenForelderRegister.dødsfall)}
                    </BodyShortSmall>
                </>
            )}
        </GridTabell>
    );
};

export default RegistergrunnlagNyttBarnInnhold;
