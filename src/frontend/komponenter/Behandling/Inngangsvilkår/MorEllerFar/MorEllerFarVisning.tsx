import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import { VilkårsresultatIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import React, { FC } from 'react';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { Element, EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import LiteBarn from '../../../../ikoner/LiteBarn';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { formaterNullableFødsesnummer, formaterNullableIsoDato } from '../../../../utils/formatter';
import { Vilkårsresultat } from '../vilkår';
interface Props {
    barnMedSamvær: IBarnMedSamvær[];
    vilkårsresultat: Vilkårsresultat;
}

const MorEllerFarVisning: FC<Props> = ({ barnMedSamvær, vilkårsresultat }) => {
    return (
        <>
            {barnMedSamvær.map((barn: IBarnMedSamvær, indeks) => {
                const { søknadsgrunnlag, registergrunnlag } = barn;
                const barnUtenNavn: string = søknadsgrunnlag.erBarnetFødt
                    ? 'Ikke fylt ut'
                    : 'Ikke født ennå';
                return (
                    <React.Fragment key={barn.barnId}>
                        <GridTabell>
                            {!indeks && (
                                <>
                                    <VilkårsresultatIkon
                                        className={'vilkårStatusIkon'}
                                        vilkårsresultat={vilkårsresultat}
                                    />
                                    <div className="tittel">
                                        <Undertittel>Mor eller Far</Undertittel>
                                        <EtikettLiten>§15-4</EtikettLiten>
                                    </div>
                                </>
                            )}
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

export default MorEllerFarVisning;
