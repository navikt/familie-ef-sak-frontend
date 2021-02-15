import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import { VilkårStatus, VilkårStatusIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import React, { FC } from 'react';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { Element, EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import LiteBarn from '../../../../ikoner/LiteBarn';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';

interface Props {
    barnMedSamvær: IBarnMedSamvær[];
    årsakEnslig?: string;
    vilkårStatus: VilkårStatus;
}

const MorEllerFarVisning: FC<Props> = ({ barnMedSamvær, årsakEnslig, vilkårStatus }) => {
    return (
        <StyledTabell>
            <VilkårStatusIkon className={'vilkårStatusIkon'} vilkårStatus={vilkårStatus} />
            <div className="tittel">
                <Undertittel>Mor eller Far</Undertittel>
                <EtikettLiten>§15-4</EtikettLiten>
            </div>
            {barnMedSamvær.map((barn: IBarnMedSamvær) => {
                const { søknadsgrunnlag, registergrunnlag } = barn;
                const barnUtenNavn: string = søknadsgrunnlag.erBarnetFødt
                    ? 'Ikke fylt ut'
                    : 'Ikke født ennå';
                return (
                    <>
                        {registergrunnlag.navn ? (
                            <>
                                <LiteBarn />
                                <Element>{registergrunnlag.navn}</Element>
                            </>
                        ) : (
                            <>
                                <Søknadsgrunnlag />
                                <Element>
                                    {søknadsgrunnlag.navn ? søknadsgrunnlag.navn : barnUtenNavn}
                                </Element>
                            </>
                        )}
                        {!søknadsgrunnlag.erBarnetFødt && søknadsgrunnlag.fødselTermindato && (
                            <>
                                <Søknadsgrunnlag />
                                <Normaltekst>Termindato</Normaltekst>
                                <Normaltekst>{søknadsgrunnlag.fødselTermindato}</Normaltekst>
                            </>
                        )}
                        {søknadsgrunnlag.erBarnetFødt && registergrunnlag.fødselsnummer && (
                            <>
                                <Registergrunnlag />
                                <Normaltekst>Fødsels- eller D-nummer</Normaltekst>
                                <Normaltekst>{registergrunnlag.fødselsnummer}</Normaltekst>
                            </>
                        )}
                        {!!årsakEnslig && (
                            <>
                                <Søknadsgrunnlag />
                                <Normaltekst>Fødsels- eller D-nummer</Normaltekst>
                                <Normaltekst>{søknadsgrunnlag.fødselsnummer}</Normaltekst>
                            </>
                        )}
                    </>
                );
            })}
        </StyledTabell>
    );
};

export default MorEllerFarVisning;
