import React, { FC, useState } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { IBarnMedLøpendeStønad, IBarnMedSamvær, skalBarnetBoHosSøkerTilTekst } from './typer';
import Bosted from './Bosted';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import Samvær from './Samvær';
import AnnenForelderOpplysninger from './AnnenForelderOpplysninger';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { harVerdi } from '../../../../App/utils/utils';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';
import { Ressurs } from '../../../../App/typer/ressurs';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import UtvidPanel from '../../../../Felles/UtvidPanel/UtvidPanel';
import { Tag } from '@navikt/ds-react';
import { BodyShortSmall, SmallTextLabel } from '../../../../Felles/Visningskomponenter/Tekster';
import { utledNavnLabel } from '../utils';

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
            <Tag variant={'success'}>{`ja - per ${formaterNullableIsoDato(
                barnMedLøpendeStønad.dato
            )}`}</Tag>
        ) : (
            <Tag variant={'error'}>{`nei - per ${formaterNullableIsoDato(
                barnMedLøpendeStønad.dato
            )}`}</Tag>
        );
    };

    return (
        <>
            <GridTabell kolonner={3}>
                {registergrunnlag.navn ? (
                    <>
                        <Registergrunnlag />
                        <SmallTextLabel>Barnets navn</SmallTextLabel>
                        <SmallTextLabel>
                            {utledNavnLabel(registergrunnlag.navn, registergrunnlag.fødselsdato)}
                            {registergrunnlag.dødsdato && (
                                <EtikettDød dødsdato={registergrunnlag.dødsdato} />
                            )}
                        </SmallTextLabel>
                    </>
                ) : (
                    <>
                        <Søknadsgrunnlag />
                        <SmallTextLabel>Barnets navn</SmallTextLabel>
                        <SmallTextLabel>
                            {søknadsgrunnlag.navn && søknadsgrunnlag.navn !== ''
                                ? 'Ikke utfylt'
                                : 'Ikke født'}
                        </SmallTextLabel>
                    </>
                )}
                {registergrunnlag.fødselsnummer ? (
                    <>
                        <Registergrunnlag />
                        <BodyShortSmall>Fødsels eller D-nummer</BodyShortSmall>
                        <KopierbartNullableFødselsnummer
                            fødselsnummer={registergrunnlag.fødselsnummer}
                        />
                    </>
                ) : (
                    <>
                        <Søknadsgrunnlag />
                        <BodyShortSmall>Termindato</BodyShortSmall>
                        <BodyShortSmall>
                            {formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato)}
                        </BodyShortSmall>
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
                        <BodyShortSmall>Barnet skal ha adresse hos søker</BodyShortSmall>
                        <BodyShortSmall>
                            {skalBarnetBoHosSøkerTilTekst[søknadsgrunnlag.skalBoBorHosSøker]}
                        </BodyShortSmall>
                    </>
                )}

                {skalViseSøknadsdata && harVerdi(ikkeOppgittAnnenForelderBegrunnelse) && (
                    <>
                        <Søknadsgrunnlag />
                        <BodyShortSmall>Annen forelder </BodyShortSmall>
                        <BodyShortSmall>
                            {ikkeOppgittAnnenForelderBegrunnelse === 'donorbarn'
                                ? ikkeOppgittAnnenForelderBegrunnelse
                                : `Ikke oppgitt: ${ikkeOppgittAnnenForelderBegrunnelse}`}
                        </BodyShortSmall>
                    </>
                )}
                {skalViseSøknadsdata && stønadstype === Stønadstype.BARNETILSYN && (
                    <>
                        <Søknadsgrunnlag />
                        <BodyShortSmall>
                            Søkes det om stønad til barnetilsyn for barnet
                        </BodyShortSmall>
                        <BodyShortSmall>
                            {barnepass?.skalHaBarnepass ? (
                                <Tag variant={'success'}>ja</Tag>
                            ) : (
                                <Tag variant={'error'}>nei</Tag>
                            )}
                        </BodyShortSmall>
                    </>
                )}
                {
                    <DataViewer response={{ barnMedLøpendeStønad }}>
                        {({ barnMedLøpendeStønad }) => {
                            return (
                                <>
                                    <Registergrunnlag />
                                    <BodyShortSmall>
                                        Har brukeren løpende stønad for barnet? (i EF Sak)
                                    </BodyShortSmall>
                                    <BodyShortSmall>
                                        {utledEtikettForLøpendeStønad(barnMedLøpendeStønad, barnId)}
                                    </BodyShortSmall>
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
