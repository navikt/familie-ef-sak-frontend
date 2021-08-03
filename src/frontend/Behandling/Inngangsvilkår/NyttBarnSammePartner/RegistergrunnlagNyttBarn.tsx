import React, { FC } from 'react';
import { RegistergrunnlagNyttBarn } from './typer';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import LiteBarn from '../../../ikoner/LiteBarn';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { formaterNullableIsoDato } from '../../../utils/formatter';
import { AnnenForelderNavnOgFnr } from './AnnenForelderNavnOgFnr';
import { harVerdi } from '../../../utils/utils';

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
                <Element>{barn.navn}</Element>
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
