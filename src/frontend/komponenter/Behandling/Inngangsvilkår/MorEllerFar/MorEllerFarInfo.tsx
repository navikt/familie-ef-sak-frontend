import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import React, { FC } from 'react';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import LiteBarn from '../../../../ikoner/LiteBarn';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { formaterNullableFødsesnummer, formaterNullableIsoDato } from '../../../../utils/formatter';
interface Props {
    barnMedSamvær: IBarnMedSamvær[];
}

const MorEllerFarInfo: FC<Props> = ({ barnMedSamvær }) => {
    return (
        <>
            {barnMedSamvær.map((barn: IBarnMedSamvær) => {
                const { søknadsgrunnlag, registergrunnlag } = barn;
                const barnUtenNavn: string = søknadsgrunnlag.erBarnetFødt
                    ? 'Ikke fylt ut'
                    : 'Ikke født';
                return (
                    <React.Fragment key={barn.barnId}>
                        <GridTabell>
                            {registergrunnlag.navn ? (
                                <>
                                    <LiteBarn />
                                    <Element>{registergrunnlag.navn}</Element>
                                </>
                            ) : (
                                <>
                                    <LiteBarn />
                                    <Element>
                                        {søknadsgrunnlag.navn ? søknadsgrunnlag.navn : barnUtenNavn}
                                    </Element>
                                </>
                            )}
                            {registergrunnlag.fødselsnummer ? (
                                <>
                                    <Registergrunnlag />
                                    <Normaltekst>Fødsels- eller D-nummer</Normaltekst>
                                    <Normaltekst>
                                        {formaterNullableFødsesnummer(
                                            registergrunnlag.fødselsnummer
                                        )}
                                    </Normaltekst>
                                </>
                            ) : søknadsgrunnlag.fødselsnummer ? (
                                <>
                                    <Søknadsgrunnlag />
                                    <Normaltekst>Fødsels- eller D-nummer</Normaltekst>
                                    <Normaltekst>
                                        {formaterNullableFødsesnummer(
                                            søknadsgrunnlag.fødselsnummer
                                        )}
                                    </Normaltekst>
                                </>
                            ) : (
                                <>
                                    <Søknadsgrunnlag />
                                    <Normaltekst>
                                        {søknadsgrunnlag.erBarnetFødt
                                            ? 'Fødselsdato'
                                            : 'Termindato'}
                                    </Normaltekst>
                                    <Normaltekst>
                                        {formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato)}
                                    </Normaltekst>
                                </>
                            )}
                        </GridTabell>
                    </React.Fragment>
                );
            })}
        </>
    );
};

export default MorEllerFarInfo;
