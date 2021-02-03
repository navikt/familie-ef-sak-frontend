import React, { FC } from 'react';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { Element, EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { VilkårStatus, VilkårStatusIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { IBarnMedSamvær, skalBarnetBoHosSøkerTilTekst } from './typer';
import Bosted from './Bosted';
import { formaterNullableFødsesnummer, formaterNullableIsoDato } from '../../../../utils/formatter';
import Samvær from './Samvær';

interface Props {
    barnMedSamvær: IBarnMedSamvær[];
    vilkårStatus: VilkårStatus;
    barneId?: string;
}

const AleneomsorgVisning: FC<Props> = ({ barnMedSamvær, vilkårStatus, barneId }) => {
    const gjeldendeBarn = barnMedSamvær.find((it) => it.barneId === barneId);
    if (gjeldendeBarn === undefined) return null;
    const { registergrunnlag, søknadsgrunnlag } = gjeldendeBarn;
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
                <Normaltekst>
                    {formaterNullableFødsesnummer(registergrunnlag.fødselsnummer)}
                </Normaltekst>
                <Søknadsgrunnlag />
                <Normaltekst>
                    {søknadsgrunnlag.erBarnetFødt ? 'Fødselsdato' : 'Termindato'}
                </Normaltekst>
                <Normaltekst>
                    {formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato)}
                </Normaltekst>
                <Bosted
                    harSammeAdresseRegister={registergrunnlag.harSammeAdresse}
                    harSammeAdresseSøknad={søknadsgrunnlag.harSammeAdresse}
                />
                {søknadsgrunnlag.skalBoBorHosSøker && (
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Skal bo hos søker</Normaltekst>
                        <Normaltekst>
                            {skalBarnetBoHosSøkerTilTekst[søknadsgrunnlag.skalBoBorHosSøker]}
                        </Normaltekst>
                    </>
                )}
                {(registergrunnlag.forelder || søknadsgrunnlag.forelder) && (
                    <Samvær
                        forelderRegister={registergrunnlag.forelder}
                        søknadsgrunnlag={søknadsgrunnlag}
                    />
                )}
            </StyledTabell>
        </>
    );
};

export default AleneomsorgVisning;
