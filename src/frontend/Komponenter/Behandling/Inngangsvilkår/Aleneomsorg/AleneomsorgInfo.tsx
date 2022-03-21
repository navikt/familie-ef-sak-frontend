import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { IBarnMedSamvær, skalBarnetBoHosSøkerTilTekst } from './typer';
import Bosted from './Bosted';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import Samvær from './Samvær';
import AnnenForelderOpplysninger from './AnnenForelderOpplysninger';
import { StyledLesmerpanel } from '../../../../Felles/Visningskomponenter/StyledLesmerpanel';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { harVerdi } from '../../../../App/utils/utils';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';

const AleneomsorgInfo: FC<{ gjeldendeBarn: IBarnMedSamvær; skalViseSøknadsdata?: boolean }> = ({
    gjeldendeBarn,
    skalViseSøknadsdata,
}) => {
    const { registergrunnlag, søknadsgrunnlag, barnepass } = gjeldendeBarn;
    const ikkeOppgittAnnenForelderBegrunnelse = søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse;

    return (
        <>
            <GridTabell kolonner={3}>
                {registergrunnlag.navn ? (
                    <>
                        <Registergrunnlag />
                        <Element>Barnets navn</Element>
                        <Element>
                            {registergrunnlag.navn}
                            {registergrunnlag.dødsdato && (
                                <EtikettDød dødsdato={registergrunnlag.dødsdato} />
                            )}
                        </Element>
                    </>
                ) : skalViseSøknadsdata ? (
                    <>
                        <Søknadsgrunnlag />
                        <Element>Barnets navn</Element>
                        <Element>
                            {søknadsgrunnlag.navn && søknadsgrunnlag.navn !== ''
                                ? 'Ikke utfylt'
                                : 'Ikke født'}
                        </Element>
                    </>
                ) : null}
                {registergrunnlag.fødselsnummer ? (
                    <>
                        <Registergrunnlag />
                        <Normaltekst>Fødsels eller D-nummer</Normaltekst>
                        <KopierbartNullableFødselsnummer
                            fødselsnummer={registergrunnlag.fødselsnummer}
                        />
                    </>
                ) : skalViseSøknadsdata ? (
                    søknadsgrunnlag.fødselTermindato && (
                        <>
                            <Søknadsgrunnlag />
                            <Normaltekst>Termindato</Normaltekst>
                            <Normaltekst>
                                {formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato)}
                            </Normaltekst>
                        </>
                    )
                ) : null}

                <Bosted
                    harSammeAdresseRegister={registergrunnlag.harSammeAdresse}
                    harSammeAdresseSøknad={søknadsgrunnlag.harSammeAdresse}
                    erBarnetFødt={!!registergrunnlag.fødselsnummer}
                />

                {skalViseSøknadsdata && søknadsgrunnlag.skalBoBorHosSøker && (
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Barnet skal ha adresse hos søker</Normaltekst>
                        <Normaltekst>
                            {skalBarnetBoHosSøkerTilTekst[søknadsgrunnlag.skalBoBorHosSøker]}
                        </Normaltekst>
                    </>
                )}

                {skalViseSøknadsdata && harVerdi(ikkeOppgittAnnenForelderBegrunnelse) && (
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Annen forelder </Normaltekst>
                        <Normaltekst>
                            {ikkeOppgittAnnenForelderBegrunnelse === 'donorbarn'
                                ? ikkeOppgittAnnenForelderBegrunnelse
                                : `Ikke oppgitt: ${ikkeOppgittAnnenForelderBegrunnelse}`}
                        </Normaltekst>
                    </>
                )}
                {barnepass && barnepass.skalHaBarnepass && (
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Søkes det om barnetilsyn for barnet</Normaltekst>
                        <Normaltekst>Ja</Normaltekst>
                    </>
                )}
            </GridTabell>

            {!harVerdi(ikkeOppgittAnnenForelderBegrunnelse) && (
                <StyledLesmerpanel>
                    <Lesmerpanel apneTekst={'Vis info om barnet'} lukkTekst={'Lukk info om barnet'}>
                        {(registergrunnlag.forelder || søknadsgrunnlag.forelder) && (
                            <>
                                {skalViseSøknadsdata && (
                                    <AnnenForelderOpplysninger
                                        søknadsgrunnlag={søknadsgrunnlag}
                                        forelderRegister={registergrunnlag.forelder}
                                    />
                                )}
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
