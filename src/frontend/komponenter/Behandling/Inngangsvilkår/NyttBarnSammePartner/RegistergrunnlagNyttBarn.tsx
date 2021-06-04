import React, { FC } from 'react';
import { RegistergrunnlagNyttBarn } from './typer';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import LiteBarn from '../../../../ikoner/LiteBarn';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Registergrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { FlexDiv } from '../../../Oppgavebenk/OppgaveFiltrering';
import { KopierbartNullableFødselsnummer } from '../../../Felleskomponenter/KopierbartNullableFødselsnummer';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
import { EtikettDød } from './NyttBarnSammePartnerInfo';

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
                <Element>Fødsels eller D-nummer</Element>
                <Normaltekst>{barn.fødselsnummer}</Normaltekst>
            </>
            <>
                <Registergrunnlag />
                <Element>Annen forelder fra folkeregister</Element>
                <FlexDiv>
                    <Normaltekst>{barn.annenForelderRegister?.navn} – </Normaltekst>
                    {barn.annenForelderRegister?.fødselsnummer ? (
                        <KopierbartNullableFødselsnummer
                            fødselsnummer={barn.annenForelderRegister?.fødselsnummer}
                        />
                    ) : (
                        <Normaltekst>-</Normaltekst>
                    )}
                    {barn.annenForelderRegister?.dødsfall && (
                        <EtikettDød mini type="info">
                            Død
                        </EtikettDød>
                    )}
                </FlexDiv>
            </>
            {barn.annenForelderRegister?.dødsfall && (
                <>
                    <Registergrunnlag />
                    <Element>Annen forelder dødsdato</Element>
                    <Normaltekst>
                        {formaterNullableIsoDato(barn.annenForelderRegister.dødsfall)}
                    </Normaltekst>
                </>
            )}
        </GridTabell>
    );
};

export default RegistergrunnlagNyttBarn;
