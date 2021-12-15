import React, { FC } from 'react';
import { RegistergrunnlagNyttBarn } from './typer';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import LiteBarn from '../../../../Felles/Ikoner/LiteBarn';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { AnnenForelderNavnOgFnr } from './AnnenForelderNavnOgFnr';
import { harVerdi } from '../../../../App/utils/utils';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';

interface Props {
    barn: RegistergrunnlagNyttBarn;
}

const RegistergrunnlagNyttBarn: FC<Props> = ({ barn }) => {
    const { annenForelderRegister } = barn;

    const ikkeOppgittAnnenForelderBegrunnelse = barn.ikkeOppgittAnnenForelderBegrunnelse;

    return (
        <GridTabell>
            <>
                <LiteBarn />
                <Element>
                    {barn.navn}
                    {barn.dødsdato && <EtikettDød dødsdato={barn.dødsdato} />}
                </Element>
            </>
            <>
                <Registergrunnlag />
                <Normaltekst>Fødsels eller D-nummer</Normaltekst>
                <Normaltekst>{barn.fødselsnummer}</Normaltekst>
            </>

            {annenForelderRegister && (
                <>
                    <Registergrunnlag />
                    <Normaltekst>Annen forelder fra folkeregister</Normaltekst>
                    <AnnenForelderNavnOgFnr forelder={annenForelderRegister} />
                </>
            )}

            {harVerdi(ikkeOppgittAnnenForelderBegrunnelse) && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Annen forelder</Normaltekst>
                    <Normaltekst>
                        {ikkeOppgittAnnenForelderBegrunnelse === 'donorbarn'
                            ? ikkeOppgittAnnenForelderBegrunnelse
                            : `Ikke oppgitt: ${ikkeOppgittAnnenForelderBegrunnelse}`}
                    </Normaltekst>
                </>
            )}

            {barn.annenForelderRegister?.dødsfall && (
                <>
                    <Registergrunnlag />
                    <Normaltekst>Annen forelder dødsdato</Normaltekst>
                    <Normaltekst>
                        {formaterNullableIsoDato(barn.annenForelderRegister.dødsfall)}
                    </Normaltekst>
                </>
            )}
        </GridTabell>
    );
};

export default RegistergrunnlagNyttBarn;
