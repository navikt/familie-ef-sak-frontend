import React, { FC } from 'react';
import { IBarnMedLøpendeStønad, IBarnMedSamvær, skalBarnetBoHosSøkerTilTekst } from './typer';
import Bosted from './Bosted';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import Samvær from './Samvær';
import AnnenForelderOpplysninger from './AnnenForelderOpplysninger';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { harVerdi } from '../../../../App/utils/utils';
import { Ressurs } from '../../../../App/typer/ressurs';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import { Tag } from '@navikt/ds-react';
import { utledNavnOgAlder } from '../utils';
import { BarneInfoWrapper, VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';

const AleneomsorgInfo: FC<{
    gjeldendeBarn: IBarnMedSamvær;
    skalViseSøknadsdata?: boolean;
    barnMedLøpendeStønad: Ressurs<IBarnMedLøpendeStønad>;
    stønadstype: Stønadstype;
}> = ({ gjeldendeBarn, skalViseSøknadsdata, barnMedLøpendeStønad, stønadstype }) => {
    const { barnId, registergrunnlag, søknadsgrunnlag, barnepass } = gjeldendeBarn;
    const ikkeOppgittAnnenForelderBegrunnelse = søknadsgrunnlag.ikkeOppgittAnnenForelderBegrunnelse;

    const utledEtikettForLøpendeStønad = (
        barnMedLøpendeStønad: IBarnMedLøpendeStønad,
        personIdent: string
    ) => {
        const harLøpendeStønad = barnMedLøpendeStønad.barn.includes(personIdent);
        return harLøpendeStønad ? (
            <Tag variant={'success'} size={'small'}>{`ja - per ${formaterNullableIsoDato(
                barnMedLøpendeStønad.dato
            )}`}</Tag>
        ) : (
            <Tag variant={'error'} size={'small'}>{`nei - per ${formaterNullableIsoDato(
                barnMedLøpendeStønad.dato
            )}`}</Tag>
        );
    };

    const navnOgAlderPåBarn = registergrunnlag.navn
        ? utledNavnOgAlder(
              registergrunnlag.navn,
              registergrunnlag.fødselsdato,
              registergrunnlag.dødsdato
          )
        : søknadsgrunnlag.navn
        ? 'Ikke utfylt'
        : 'Ikke født';

    return (
        <BarneInfoWrapper
            navnOgAlderPåBarn={navnOgAlderPåBarn}
            dødsdato={registergrunnlag.dødsdato}
        >
            {registergrunnlag.fødselsnummer ? (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.REGISTER}
                    label="Fødsels eller D-nummer"
                    verdiSomString={false}
                    verdi={
                        <KopierbartNullableFødselsnummer
                            fødselsnummer={registergrunnlag.fødselsnummer}
                        />
                    }
                />
            ) : (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Termindato"
                    verdi={formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato)}
                />
            )}
            <Bosted
                harSammeAdresseRegister={registergrunnlag.harSammeAdresse}
                harSammeAdresseSøknad={søknadsgrunnlag.harSammeAdresse}
                erBarnetFødt={!!registergrunnlag.fødselsnummer}
            />
            {skalViseSøknadsdata && søknadsgrunnlag.skalBoBorHosSøker && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Barnet skal ha adresse hos søker"
                    verdi={skalBarnetBoHosSøkerTilTekst[søknadsgrunnlag.skalBoBorHosSøker]}
                />
            )}

            {skalViseSøknadsdata && harVerdi(ikkeOppgittAnnenForelderBegrunnelse) && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Annen forelder"
                    verdi={
                        ikkeOppgittAnnenForelderBegrunnelse === 'donorbarn'
                            ? ikkeOppgittAnnenForelderBegrunnelse
                            : `Ikke oppgitt: ${ikkeOppgittAnnenForelderBegrunnelse}`
                    }
                />
            )}
            {skalViseSøknadsdata && stønadstype === Stønadstype.BARNETILSYN && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label="Søkes det om stønad til barnetilsyn for barnet"
                    verdi={
                        barnepass?.skalHaBarnepass ? (
                            <Tag variant={'success'} size={'small'}>
                                ja
                            </Tag>
                        ) : (
                            <Tag variant={'error'} size={'small'}>
                                nei
                            </Tag>
                        )
                    }
                />
            )}
            <DataViewer response={{ barnMedLøpendeStønad }}>
                {({ barnMedLøpendeStønad }) => {
                    return (
                        <Informasjonsrad
                            ikon={VilkårInfoIkon.REGISTER}
                            label="Har brukeren løpende stønad for barnet? (i EF Sak)"
                            verdi={utledEtikettForLøpendeStønad(barnMedLøpendeStønad, barnId)}
                        />
                    );
                }}
            </DataViewer>
            {!harVerdi(ikkeOppgittAnnenForelderBegrunnelse) &&
                (registergrunnlag.forelder || søknadsgrunnlag.forelder) && (
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
        </BarneInfoWrapper>
    );
};

export default AleneomsorgInfo;
