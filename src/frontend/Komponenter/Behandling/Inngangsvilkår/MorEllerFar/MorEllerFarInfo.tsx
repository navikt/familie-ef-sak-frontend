import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import LiteBarn from '../../../../Felles/Ikoner/LiteBarn';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';

interface Props {
    barnMedSamvær: IBarnMedSamvær[];
    skalSkjuleSøknadsdata?: boolean;
}

const MorEllerFarInfo: FC<Props> = ({ barnMedSamvær, skalSkjuleSøknadsdata }) => {
    return (
        <>
            {barnMedSamvær.map((barn: IBarnMedSamvær) => {
                const { søknadsgrunnlag, registergrunnlag } = barn;

                return (
                    <React.Fragment key={barn.barnId}>
                        <GridTabell>
                            {registergrunnlag.navn ? (
                                <>
                                    <LiteBarn />
                                    <Element>{registergrunnlag.navn}</Element>
                                </>
                            ) : !skalSkjuleSøknadsdata ? (
                                <>
                                    <LiteBarn />
                                    <Element>
                                        {søknadsgrunnlag.navn ? søknadsgrunnlag.navn : 'Ikke født'}
                                    </Element>
                                </>
                            ) : null}
                            {registergrunnlag.fødselsnummer ? (
                                <>
                                    <Registergrunnlag />
                                    <Normaltekst>Fødsels- eller D-nummer</Normaltekst>
                                    <KopierbartNullableFødselsnummer
                                        fødselsnummer={registergrunnlag.fødselsnummer}
                                    />
                                </>
                            ) : !skalSkjuleSøknadsdata ? (
                                <>
                                    <Søknadsgrunnlag />
                                    <Normaltekst>Termindato</Normaltekst>
                                    <Normaltekst>
                                        {formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato)}
                                    </Normaltekst>
                                </>
                            ) : null}
                        </GridTabell>
                    </React.Fragment>
                );
            })}
        </>
    );
};

export default MorEllerFarInfo;
