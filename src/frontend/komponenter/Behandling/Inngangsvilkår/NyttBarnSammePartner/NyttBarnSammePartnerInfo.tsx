import React, { FC } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import {
    mapBarnNavnTekst,
    mapTilRegistergrunnlagNyttBarn,
    mapTilSøknadsgrunnlagNyttBarn,
} from './utils';
import { FlexDiv } from '../../../Oppgavebenk/OppgaveFiltrering';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import LiteBarn from '../../../../ikoner/LiteBarn';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { AnnenForelderNavnOgFnr } from './AnnenForelderNavnOgFnr';
import { KopierbartNullableFødselsnummer } from '../../../Felleskomponenter/KopierbartNullableFødselsnummer';
import styled from 'styled-components';
import EtikettBase from 'nav-frontend-etiketter';

interface Props {
    barnMedSamvær: IBarnMedSamvær[];
}

const Overskrift = styled(Element)`
    margin-left: 0.5rem;
    margin-bottom: 1rem;
`;

const EtikettDød = styled(EtikettBase)`
    background-color: black;
    color: #eee;
    margin-left: 0.5rem;
    border: none;
`;

const NyttBarnSammePartnerInfo: FC<Props> = ({ barnMedSamvær }) => {
    const registergrunnlagNyttBarn = mapTilRegistergrunnlagNyttBarn(barnMedSamvær);
    const søknadsgrunnlagNyttBarn = mapTilSøknadsgrunnlagNyttBarn(barnMedSamvær);

    return (
        <>
            <div>
                <FlexDiv>
                    <Registergrunnlag />
                    <Overskrift className="tittel" tag="h3">
                        Brukers barn registrert i folkeregisteret
                    </Overskrift>
                </FlexDiv>
                {registergrunnlagNyttBarn.map((barn) => {
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
                                    <KopierbartNullableFødselsnummer
                                        fødselsnummer={barn.annenForelderRegister?.fødselsnummer}
                                    />
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
                                        {formaterNullableIsoDato(
                                            barn.annenForelderRegister.dødsfall
                                        )}
                                    </Normaltekst>
                                </>
                            )}
                        </GridTabell>
                    );
                })}
            </div>
            <div>
                <FlexDiv>
                    <Søknadsgrunnlag />
                    <Overskrift className="tittel" tag="h3">
                        Brukers fremtidige barn lagt til i søknad
                    </Overskrift>
                </FlexDiv>
                {søknadsgrunnlagNyttBarn.map((barn) => (
                    <GridTabell>
                        <>
                            <LiteBarn />
                            <Element>{mapBarnNavnTekst(barn)}</Element>
                        </>
                        <>
                            <Søknadsgrunnlag />
                            <Element>Termindato</Element>
                            <Normaltekst>
                                {formaterNullableIsoDato(barn.fødselTermindato)}
                            </Normaltekst>
                        </>
                        <>
                            <Søknadsgrunnlag />
                            <Element>Annen forelder lagt til i søknad</Element>
                            <Normaltekst>
                                <AnnenForelderNavnOgFnr
                                    forelder={barn.annenForelderSoknad}
                                    ikkeOppgittAnnenForelderBegrunnelse={
                                        barn.ikkeOppgittAnnenForelderBegrunnelse
                                    }
                                />
                            </Normaltekst>
                        </>
                    </GridTabell>
                ))}
            </div>
        </>
    );
};
export default NyttBarnSammePartnerInfo;
