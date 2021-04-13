import React, { FC } from 'react';
import { Element } from 'nav-frontend-typografi';
import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import { RegistergrunnlagNyttBarn, SøknadsgrunnlagNyttBarn } from './typer';
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
import { Tabell } from './Tabell';
import { KopierbartNullableFødselsnummer } from '../../../Felleskomponenter/KopierbartNullableFødselsnummer';
import { AnnenForelderNavnOgFnr } from './AnnenForelderNavnOgFnr';

interface Props {
    barnMedSamvær: IBarnMedSamvær[];
}

const NyttBarnSammePartnerInfo: FC<Props> = ({ barnMedSamvær }) => {
    const registergrunnlagNyttBarn = mapTilRegistergrunnlagNyttBarn(barnMedSamvær);
    const søknadsgrunnlagNyttBarn = mapTilSøknadsgrunnlagNyttBarn(barnMedSamvær);
    return (
        <>
            <div>
                <FlexDiv>
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
                            tekstVerdi: (registergrunnlag: RegistergrunnlagNyttBarn) => (
                                <KopierbartNullableFødselsnummer
                                    fødselsnummer={registergrunnlag.fødselsnummer}
                                />
                            ),
                        },
                        {
                            overskrift: 'Annen forelder register',
                            tekstVerdi: (registergrunnlag: RegistergrunnlagNyttBarn) => (
                                <AnnenForelderNavnOgFnr
                                    forelder={registergrunnlag.annenForelderRegister}
                                />
                            ),
                        },
                        {
                            overskrift: 'Annen forelder søknad',
                            tekstVerdi: (registergrunnlag: RegistergrunnlagNyttBarn) => (
                                <AnnenForelderNavnOgFnr
                                    forelder={registergrunnlag.annenForelderSoknad}
                                    ikkeOppgittAnnenForelderBegrunnelse={
                                        registergrunnlag.ikkeOppgittAnnenForelderBegrunnelse
                                    }
                                />
                            ),
                        },
                    ]}
                    data={registergrunnlagNyttBarn}
                />
            </div>
            <div>
                <FlexDiv>
                    <Søknadsgrunnlag />
                    <Element className="tittel" tag="h3" style={{ marginLeft: '0.5rem' }}>
                        Brukers fremtidige barn lagt til i søknad
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
                            overskrift: 'Termindato',
                            tekstVerdi: (søknadsgrunnlag: SøknadsgrunnlagNyttBarn) =>
                                !søknadsgrunnlag.erBarnetFødt &&
                                formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato),
                        },
                        {
                            overskrift: 'Annen forelder',
                            tekstVerdi: (søknadsgrunnlag: SøknadsgrunnlagNyttBarn) => (
                                <AnnenForelderNavnOgFnr
                                    forelder={søknadsgrunnlag.annenForelderSoknad}
                                    ikkeOppgittAnnenForelderBegrunnelse={
                                        søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse
                                    }
                                />
                            ),
                        },
                    ]}
                    data={søknadsgrunnlagNyttBarn}
                    onEmpty="Ingen barn lagt til i søknad"
                />
            </div>
        </>
    );
};
export default NyttBarnSammePartnerInfo;
