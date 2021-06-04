import React, { FC } from 'react';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { IBarnMedSamvær, skalBarnetBoHosSøkerTilTekst } from './typer';
import Bosted from './Bosted';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
import Samvær from './Samvær';
import AnnenForelderOpplysninger from './AnnenForelderOpplysninger';
import { StyledLesmerpanel } from '../../../Felleskomponenter/Visning/StyledNavKomponenter';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import { KopierbartNullableFødselsnummer } from '../../../Felleskomponenter/KopierbartNullableFødselsnummer';
import { harVerdi } from '../../../../utils/utils';

const AleneomsorgInfo: FC<{ gjeldendeBarn: IBarnMedSamvær }> = ({ gjeldendeBarn }) => {
    const { registergrunnlag, søknadsgrunnlag } = gjeldendeBarn;
    const ikkeOppgittAnnenForelderBegrunnelse = søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse;

    return (
        <>
            <GridTabell kolonner={3}>
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
                        <Element>
                            {søknadsgrunnlag.navn && søknadsgrunnlag.navn !== ''
                                ? 'Ikke utfylt'
                                : 'Ikke født'}
                        </Element>
                    </>
                )}
                {registergrunnlag.fødselsnummer ? (
                    <>
                        <Registergrunnlag />
                        <Normaltekst>Fødsels eller D-nummer</Normaltekst>
                        <KopierbartNullableFødselsnummer
                            fødselsnummer={registergrunnlag.fødselsnummer}
                        />
                    </>
                ) : (
                    søknadsgrunnlag.fødselTermindato && (
                        <>
                            <Søknadsgrunnlag />
                            <Normaltekst>Termindato</Normaltekst>
                            <Normaltekst>
                                {formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato)}
                            </Normaltekst>
                        </>
                    )
                )}

                <Bosted
                    harSammeAdresseRegister={registergrunnlag.harSammeAdresse}
                    harSammeAdresseSøknad={søknadsgrunnlag.harSammeAdresse}
                    erBarnetFødt={!!registergrunnlag.fødselsnummer}
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

                {harVerdi(ikkeOppgittAnnenForelderBegrunnelse) &&
                    ikkeOppgittAnnenForelderBegrunnelse === 'donorbarn' && (
                        <>
                            <Søknadsgrunnlag />
                            <Normaltekst>Annen forelder ikke oppgitt</Normaltekst>
                            <Normaltekst>{ikkeOppgittAnnenForelderBegrunnelse}</Normaltekst>
                        </>
                    )}
            </GridTabell>

            {!harVerdi(ikkeOppgittAnnenForelderBegrunnelse) && (
                <StyledLesmerpanel>
                    <Lesmerpanel apneTekst={'Vis info om barnet'} lukkTekst={'Lukk info om barnet'}>
                        {(registergrunnlag.forelder || søknadsgrunnlag.forelder) && (
                            <>
                                <AnnenForelderOpplysninger
                                    søknadsgrunnlag={søknadsgrunnlag}
                                    forelderRegister={registergrunnlag.forelder}
                                />
                                {!registergrunnlag.forelder?.dødsfall && (
                                    <Samvær søknadsgrunnlag={søknadsgrunnlag} />
                                )}
                            </>
                        )}
                    </Lesmerpanel>
                </StyledLesmerpanel>
            )}
        </>
    );
};

export default AleneomsorgInfo;
