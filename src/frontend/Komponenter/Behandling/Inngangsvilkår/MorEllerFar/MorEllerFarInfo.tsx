import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import React, { FC } from 'react';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { IDokumentasjonGrunnlag } from '../vilkår';
import DokumentasjonSendtInn from '../DokumentasjonSendtInn';
import { utledNavnOgAlderPåGrunnlag } from '../utils';
import { InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { BarneInfoWrapper, VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    barnMedSamvær: IBarnMedSamvær[];
    skalViseSøknadsdata: boolean;
    dokumentasjon?: IDokumentasjonGrunnlag;
}

const MorEllerFarInfo: FC<Props> = ({ barnMedSamvær, skalViseSøknadsdata, dokumentasjon }) => {
    return (
        <InformasjonContainer>
            {barnMedSamvær.map((barn: IBarnMedSamvær) => {
                const { søknadsgrunnlag, registergrunnlag } = barn;

                return (
                    <BarneInfoWrapper
                        key={barn.barnId}
                        navnOgAlderPåBarn={utledNavnOgAlderPåGrunnlag(
                            registergrunnlag,
                            søknadsgrunnlag
                        )}
                        dødsdato={registergrunnlag.dødsdato}
                    >
                        {registergrunnlag.fødselsnummer ? (
                            <Informasjonsrad
                                label="Fødsels- eller D-nummer"
                                verdi={
                                    <KopierbartNullableFødselsnummer
                                        fødselsnummer={registergrunnlag.fødselsnummer}
                                    />
                                }
                                verdiSomString={false}
                                ikon={VilkårInfoIkon.REGISTER}
                            />
                        ) : (
                            <Informasjonsrad
                                label="Termindato"
                                verdi={
                                    formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato) || ''
                                }
                                ikon={VilkårInfoIkon.SØKNAD}
                            />
                        )}
                    </BarneInfoWrapper>
                );
            })}
            {skalViseSøknadsdata && (
                <DokumentasjonSendtInn
                    dokumentasjon={dokumentasjon?.terminbekreftelse}
                    tittel={'Terminbekreftelse'}
                />
            )}
        </InformasjonContainer>
    );
};

export default MorEllerFarInfo;
