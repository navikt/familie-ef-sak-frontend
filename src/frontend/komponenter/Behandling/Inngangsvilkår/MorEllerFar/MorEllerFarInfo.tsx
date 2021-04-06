import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import React, { FC } from 'react';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import LiteBarn from '../../../../ikoner/LiteBarn';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
import { KopierbartNullableFødselsnummer } from '../../../Felleskomponenter/KopierbartNullableFødselsnummer';
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
                    : 'Ikke født ennå';
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
                                    <KopierbartNullableFødselsnummer
                                        fødselsnummer={registergrunnlag.fødselsnummer}
                                    />
                                </>
                            ) : søknadsgrunnlag.fødselsnummer ? (
                                <>
                                    <Søknadsgrunnlag />
                                    <Normaltekst>Fødsels- eller D-nummer</Normaltekst>
                                    <KopierbartNullableFødselsnummer
                                        fødselsnummer={søknadsgrunnlag.fødselsnummer}
                                    />
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
