import React, { FC } from 'react';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { Element, EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { VilkårStatus, VilkårStatusIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { IAleneomsorgInngangsvilkår } from './typer';
import Bosted from './Bosted';
import AnnenForelder from './AnnenForelder';

interface Props {
    aleneomsorg: IAleneomsorgInngangsvilkår[];
    vilkårStatus: VilkårStatus;
    barneId?: string;
}

const AleneomsorgVisning: FC<Props> = ({ aleneomsorg, vilkårStatus, barneId }) => {
    const { registergrunnlag, søknadsgrunnlag } = aleneomsorg.find((it) => it.barneId === barneId);
    return (
        <>
            <StyledTabell>
                <VilkårStatusIkon vilkårStatus={vilkårStatus} />
                <div className="tittel">
                    <Undertittel>Aleneomsorg</Undertittel>
                    <EtikettLiten>§15-4</EtikettLiten>
                </div>
                <Registergrunnlag />
                <Element>{registergrunnlag.navn}</Element>
                <Registergrunnlag />
                <Normaltekst>Fødsels eller D-nummer</Normaltekst>
                <Normaltekst>{registergrunnlag.fødselsnummer}</Normaltekst>
                <Søknadsgrunnlag />
                <Normaltekst>
                    {søknadsgrunnlag.erBarnetFødt ? 'Fødselsdato' : 'Termindato'}
                </Normaltekst>
                <Normaltekst>{søknadsgrunnlag.fødselTermindato}</Normaltekst>
                <Bosted
                    harSammeAdresseRegister={registergrunnlag.harSammeAdresse}
                    harSammeAdresseSøknad={søknadsgrunnlag.harSammeAdresse}
                />
                // TODO: Skal barnet ha adresse hos søker rad
                {(registergrunnlag.forelder || søknadsgrunnlag.forelder) && (
                    <AnnenForelder
                        forelderRegister={registergrunnlag.forelder}
                        søknadsgrunnlag={søknadsgrunnlag}
                    />
                )}
            </StyledTabell>
        </>
    );
};

export default AleneomsorgVisning;
