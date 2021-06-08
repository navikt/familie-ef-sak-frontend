import React, { FC } from 'react';
import { RegistergrunnlagNyttBarn } from './typer';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import LiteBarn from '../../../../ikoner/LiteBarn';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Registergrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
import { AnnenForelderNavnOgFnr } from './AnnenForelderNavnOgFnr';

interface Props {
    barn: RegistergrunnlagNyttBarn;
}

const RegistergrunnlagNyttBarn: FC<Props> = ({ barn }) => {
    return (
        <GridTabell>
            <>
                <LiteBarn />
                <Element>{barn.navn}</Element>
            </>
            <>
                <Registergrunnlag />
                <Normaltekst>Fødsels eller D-nummer</Normaltekst>
                <Normaltekst>{barn.fødselsnummer}</Normaltekst>
            </>
            <>
                <Registergrunnlag />
                <Normaltekst>Annen forelder fra folkeregister</Normaltekst>
                {barn.annenForelderRegister ? (
                    <AnnenForelderNavnOgFnr forelder={barn.annenForelderRegister} />
                ) : (
                    '-'
                )}
            </>
            {barn.annenForelderRegister?.dødsfall && (
                <>
                    <Registergrunnlag />
                    <Normaltekst>Annen forelder dødsdato</Normaltekst>
                    <Normaltekst>
                        {formaterNullableIsoDato(barn.annenForelderRegister.dødsfall)}
                    </Normaltekst>
                </>
            )}
            {barn.annenForelderSoknad && (
                <>
                    <Registergrunnlag />
                    <Normaltekst>Annen forelder fra søknad</Normaltekst>
                    {barn.annenForelderSoknad ? (
                        <AnnenForelderNavnOgFnr forelder={barn.annenForelderSoknad} />
                    ) : (
                        '-'
                    )}
                </>
            )}
            {barn.annenForelderSoknad?.dødsfall && (
                <>
                    <Registergrunnlag />
                    <Normaltekst>Annen forelder dødsdato</Normaltekst>
                    <Normaltekst>
                        {formaterNullableIsoDato(barn.annenForelderSoknad.dødsfall)}
                    </Normaltekst>
                </>
            )}
        </GridTabell>
    );
};

export default RegistergrunnlagNyttBarn;
