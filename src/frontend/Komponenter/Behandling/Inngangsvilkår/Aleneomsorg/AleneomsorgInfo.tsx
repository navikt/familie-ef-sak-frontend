import React, { FC, useState } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { IBarnMedLøpendeStønad, IBarnMedSamvær, skalBarnetBoHosSøkerTilTekst } from './typer';
import Bosted from './Bosted';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import Samvær from './Samvær';
import AnnenForelderOpplysninger from './AnnenForelderOpplysninger';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { harVerdi } from '../../../../App/utils/utils';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';
import { EtikettAdvarsel, EtikettSuksess } from 'nav-frontend-etiketter';
import { Ressurs } from '../../../../App/typer/ressurs';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import UtvidPanel from '../../../../Felles/UtvidPanel/UtvidPanel';

const AleneomsorgInfo: FC<{
    gjeldendeBarn: IBarnMedSamvær;
    skalViseSøknadsdata?: boolean;
    barnMedLøpendeStønad: Ressurs<IBarnMedLøpendeStønad>;
    stønadstype: Stønadstype;
}> = ({ gjeldendeBarn, skalViseSøknadsdata, barnMedLøpendeStønad, stønadstype }) => {
    const [åpentPanel, settÅpentPanel] = useState(false);
    const { barnId, registergrunnlag, søknadsgrunnlag, barnepass } = gjeldendeBarn;
    const ikkeOppgittAnnenForelderBegrunnelse = søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse;

    const utledEtikettForLøpendeStønad = (
        barnMedLøpendeStønad: IBarnMedLøpendeStønad,
        personIdent: string
    ) => {
        const harLøpendeStønad = barnMedLøpendeStønad.barn.includes(personIdent);
        return harLøpendeStønad ? (
            <EtikettSuksess>{`ja - per ${formaterNullableIsoDato(
                barnMedLøpendeStønad.dato
            )}`}</EtikettSuksess>
        ) : (
            <EtikettAdvarsel>{`nei - per ${formaterNullableIsoDato(
                barnMedLøpendeStønad.dato
            )}`}</EtikettAdvarsel>
        );
    };

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
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Termindato</Normaltekst>
                        <Normaltekst>
                            {formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato)}
                        </Normaltekst>
                    </>
                )}

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
                {skalViseSøknadsdata && stønadstype === Stønadstype.BARNETILSYN && (
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Søkes det om stønad til barnetilsyn for barnet</Normaltekst>
                        <Normaltekst>
                            {barnepass?.skalHaBarnepass ? (
                                <EtikettSuksess>ja</EtikettSuksess>
                            ) : (
                                <EtikettAdvarsel>nei</EtikettAdvarsel>
                            )}
                        </Normaltekst>
                    </>
                )}
                {
                    <DataViewer response={{ barnMedLøpendeStønad }}>
                        {({ barnMedLøpendeStønad }) => {
                            return (
                                <>
                                    <Registergrunnlag />
                                    <Normaltekst>
                                        Har brukeren løpende stønad for barnet? (i EF Sak)
                                    </Normaltekst>
                                    <Normaltekst>
                                        {utledEtikettForLøpendeStønad(barnMedLøpendeStønad, barnId)}
                                    </Normaltekst>
                                </>
                            );
                        }}
                    </DataViewer>
                }
            </GridTabell>

            {!harVerdi(ikkeOppgittAnnenForelderBegrunnelse) && (
                <UtvidPanel
                    åpen={åpentPanel}
                    knappTekst={åpentPanel ? 'Lukk info om barnet' : 'Vis info om barnet'}
                    onClick={() => settÅpentPanel(!åpentPanel)}
                    position={'left'}
                >
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
                </UtvidPanel>
            )}
        </>
    );
};

export default AleneomsorgInfo;
