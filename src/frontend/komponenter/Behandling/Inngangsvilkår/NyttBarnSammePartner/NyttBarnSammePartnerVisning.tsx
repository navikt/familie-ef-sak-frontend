import { VilkårsresultatIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import React, { FC } from 'react';
import { Element, EtikettLiten, Undertittel } from 'nav-frontend-typografi';
import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import { RegistergrunnlagNyttBarn, SøknadsgrunnlagNyttBarn } from './typer';
import {
    mapBarnNavnTekst,
    mapForelderTilNavnOgFnr,
    mapIkkeOppgitt,
    mapTilRegistergrunnlagNyttBarn,
    mapTilSøknadsgrunnlagNyttBarn,
} from './utils';
import { FlexDiv } from '../../../Oppgavebenk/OppgaveFiltrering';
import { Vilkårsresultat } from '../vilkår';
import { formaterNullableFødsesnummer, formaterNullableIsoDato } from '../../../../utils/formatter';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Tabell } from './Tabell';

const TittelWrapper = styled.div`
    padding-bottom: 1rem;
    display: flex;
    margin-left: 0.5rem;
    align-items: center;

    .typo-undertittel {
        margin-right: 1rem;
    }
    .typo-etikett-liten {
        color: ${navFarger.navGra60};
    }
`;

interface Props {
    barnMedSamvær: IBarnMedSamvær[];
    vilkårsresultat: Vilkårsresultat;
}

const NyttBarnSammePartnerVisning: FC<Props> = ({ barnMedSamvær, vilkårsresultat }) => {
    const registergrunnlagNyttBarn = mapTilRegistergrunnlagNyttBarn(barnMedSamvær);
    const søknadsgrunnlagNyttBarn = mapTilSøknadsgrunnlagNyttBarn(barnMedSamvær);
    return (
        <>
            <FlexDiv>
                <VilkårsresultatIkon
                    className={'vilkårStatusIkon'}
                    vilkårsresultat={vilkårsresultat}
                />
                <TittelWrapper>
                    <Undertittel>Nytt barn samme partner</Undertittel>
                    <EtikettLiten>§15-4</EtikettLiten>
                </TittelWrapper>
            </FlexDiv>
            <div style={{ marginBottom: '3rem' }}>
                <FlexDiv className="blokk-xs">
                    <Registergrunnlag />
                    <Element className="tittel" tag="h3" style={{ marginLeft: '0.5rem' }}>
                        Brukers barn registrert i folkeregisteret
                    </Element>
                </FlexDiv>
                <Tabell
                    onEmpty="Ingen barn registrert i folkeregisteret"
                    kolonner={[
                        {
                            overskrift: 'Navn',
                            tekstVerdi: (registergrunnlag: RegistergrunnlagNyttBarn) =>
                                registergrunnlag.navn,
                        },
                        {
                            overskrift: 'Fødsels/D-nummer',
                            tekstVerdi: (registergrunnlag: RegistergrunnlagNyttBarn) =>
                                formaterNullableFødsesnummer(registergrunnlag.fødselsnummer),
                        },
                        {
                            overskrift: 'Annen forelder register',
                            tekstVerdi: (registergrunnlag: RegistergrunnlagNyttBarn) =>
                                mapForelderTilNavnOgFnr(registergrunnlag.annenForelderRegister),
                        },
                        {
                            overskrift: 'Annen forelder søknad',
                            tekstVerdi: (registergrunnlag: RegistergrunnlagNyttBarn) =>
                                mapForelderTilNavnOgFnr(registergrunnlag.annenForelderSoknad) ??
                                mapIkkeOppgitt(
                                    registergrunnlag.ikkeOppgittAnnenForelderBegrunnelse
                                ),
                        },
                    ]}
                    data={registergrunnlagNyttBarn}
                />
            </div>
            <div style={{ marginBottom: '3rem' }}>
                <FlexDiv className="blokk-xs">
                    <Søknadsgrunnlag />
                    <Element className="tittel" tag="h3" style={{ marginLeft: '0.5rem' }}>
                        Brukers nåværende eller fremtidige barn lagt til i søknad
                    </Element>
                </FlexDiv>
                <Tabell
                    kolonner={[
                        {
                            overskrift: 'Navn',
                            tekstVerdi: (søknadsgrunnlag: SøknadsgrunnlagNyttBarn) =>
                                mapBarnNavnTekst(søknadsgrunnlag),
                        },
                        {
                            overskrift: 'Fødsels/D-nummer',
                            tekstVerdi: (søknadsgrunnlag: SøknadsgrunnlagNyttBarn) =>
                                formaterNullableFødsesnummer(søknadsgrunnlag.fødselsnummer),
                        },
                        {
                            overskrift: 'Fødselsdato',
                            tekstVerdi: (søknadsgrunnlag: SøknadsgrunnlagNyttBarn) =>
                                !søknadsgrunnlag.fødselsnummer &&
                                søknadsgrunnlag.erBarnetFødt &&
                                formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato),
                        },
                        {
                            overskrift: 'Termindato',
                            tekstVerdi: (søknadsgrunnlag: SøknadsgrunnlagNyttBarn) =>
                                !søknadsgrunnlag.erBarnetFødt &&
                                formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato),
                        },
                        {
                            overskrift: 'Annen forelder',
                            tekstVerdi: (søknadsgrunnlag: SøknadsgrunnlagNyttBarn) =>
                                mapForelderTilNavnOgFnr(søknadsgrunnlag.annenForelderSoknad) ??
                                mapIkkeOppgitt(søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse),
                        },
                    ]}
                    data={søknadsgrunnlagNyttBarn}
                    onEmpty="Ingen barn lagt til i søknad"
                />
            </div>
        </>
    );
};
export default NyttBarnSammePartnerVisning;
