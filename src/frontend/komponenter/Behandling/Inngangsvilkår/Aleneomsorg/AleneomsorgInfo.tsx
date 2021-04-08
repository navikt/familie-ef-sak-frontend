import React, { FC } from 'react';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import {
    IBarnMedSamvær,
    IBarnMedSamværSøknadsgrunnlag,
    skalBarnetBoHosSøkerTilTekst,
} from './typer';
import Bosted from './Bosted';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
import Samvær from './Samvær';
import AnnenForelderOpplysninger from './AnnenForelderOpplysninger';
import { StyledLesmerpanel } from '../../../Felleskomponenter/Visning/StyledNavKomponenter';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import { KopierbartNullableFødselsnummer } from '../../../Felleskomponenter/KopierbartNullableFødselsnummer';

interface Props {
    barnMedSamvær: IBarnMedSamvær[];
    barnId?: string;
}

const utledVisningAvNavnFraSøknad = (søknadsgrunnlag: IBarnMedSamværSøknadsgrunnlag) => {
    if (søknadsgrunnlag.navn && søknadsgrunnlag.navn !== '') {
        return søknadsgrunnlag.navn;
    }
    return søknadsgrunnlag.erBarnetFødt ? 'Ikke utfylt' : 'Ikke født';
};

const AleneomsorgInfo: FC<Props> = ({ barnMedSamvær, barnId }) => {
    const gjeldendeBarn = barnMedSamvær.find((it) => it.barnId === barnId);
    if (gjeldendeBarn === undefined) return null;
    const { registergrunnlag, søknadsgrunnlag } = gjeldendeBarn;
    return (
        <>
            <GridTabell>
                {registergrunnlag.navn ? (
                    <>
                        <Registergrunnlag />
                        <Element>Barnets navn</Element>
                        <Element>{registergrunnlag.navn}</Element>
                    </>
                ) : (
                    <>
                        <Søknadsgrunnlag />
                        <Element>Barnets navn</Element>
                        <Element>{utledVisningAvNavnFraSøknad(søknadsgrunnlag)}</Element>
                    </>
                )}
                {registergrunnlag.fødselsnummer ? (
                    <>
                        <Registergrunnlag />
                        <Normaltekst>Fødsels eller D-nummer</Normaltekst>
                        <Normaltekst>
                            <KopierbartNullableFødselsnummer
                                fødselsnummer={registergrunnlag.fødselsnummer}
                            />
                        </Normaltekst>
                    </>
                ) : søknadsgrunnlag.fødselsnummer && søknadsgrunnlag.fødselsnummer !== '' ? (
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Fødsels eller D-nummer</Normaltekst>
                        <Normaltekst>
                            <KopierbartNullableFødselsnummer
                                fødselsnummer={søknadsgrunnlag.fødselsnummer}
                            />
                        </Normaltekst>
                    </>
                ) : (
                    søknadsgrunnlag.fødselTermindato && (
                        <>
                            <Søknadsgrunnlag />
                            <Normaltekst>
                                {søknadsgrunnlag.erBarnetFødt ? 'Fødselsdato' : 'Termindato'}
                            </Normaltekst>
                            <Normaltekst>
                                {formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato)}
                            </Normaltekst>
                        </>
                    )
                )}

                <Bosted
                    harSammeAdresseRegister={registergrunnlag.harSammeAdresse}
                    harSammeAdresseSøknad={søknadsgrunnlag.harSammeAdresse}
                    erBarnetFødt={
                        registergrunnlag.fødselsnummer ? true : søknadsgrunnlag.erBarnetFødt
                    }
                />
                {søknadsgrunnlag.skalBoBorHosSøker && (
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Barnet skal ha adresse hos søker</Normaltekst>
                        <Normaltekst>
                            {skalBarnetBoHosSøkerTilTekst[søknadsgrunnlag.skalBoBorHosSøker]}
                        </Normaltekst>
                    </>
                )}
            </GridTabell>

            <StyledLesmerpanel>
                <Lesmerpanel apneTekst={'Vis info om barnet'} lukkTekst={'Lukk info om barnet'}>
                    {(registergrunnlag.forelder || søknadsgrunnlag.forelder) && (
                        <>
                            <AnnenForelderOpplysninger
                                søknadsgrunnlag={søknadsgrunnlag}
                                forelderRegister={registergrunnlag.forelder}
                            />
                            <Samvær søknadsgrunnlag={søknadsgrunnlag} />
                        </>
                    )}
                </Lesmerpanel>
            </StyledLesmerpanel>
        </>
    );
};

export default AleneomsorgInfo;
