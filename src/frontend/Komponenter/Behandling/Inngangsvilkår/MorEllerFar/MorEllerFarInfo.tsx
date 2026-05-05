import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import React, { FC } from 'react';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { IDokumentasjonGrunnlag } from '../vilkår';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import DokumentasjonSendtInn from '../DokumentasjonSendtInn';
import { utledNavnOgAlderPåGrunnlag } from '../utils';
import { InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import {
    BarneInfoWrapper,
    UnderseksjonWrapper,
    VilkårInfoIkon,
} from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    barnMedSamvær: IBarnMedSamvær[];
    skalViseSøknadsdata: boolean;
    dokumentasjon?: IDokumentasjonGrunnlag;
    stønadstype: Stønadstype;
}

const MorEllerFarInfo: FC<Props> = ({
    barnMedSamvær,
    skalViseSøknadsdata,
    dokumentasjon,
    stønadstype,
}) => {
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
                        ) : stønadstype === Stønadstype.OVERGANGSSTØNAD ? (
                            <Informasjonsrad
                                label="Termindato"
                                verdi={
                                    formaterNullableIsoDato(søknadsgrunnlag.fødselTermindato) || ''
                                }
                                ikon={VilkårInfoIkon.SØKNAD}
                            />
                        ) : (
                            stønadstype === Stønadstype.BARNETILSYN &&
                            søknadsgrunnlag.fødselsnummer && (
                                <UnderseksjonWrapper underoverskrift="Overtatt foreldreansvar etter barneloven § 38">
                                    <Informasjonsrad
                                        label="Fødsels- eller D-nummer"
                                        verdi={
                                            <KopierbartNullableFødselsnummer
                                                fødselsnummer={søknadsgrunnlag.fødselsnummer}
                                            />
                                        }
                                        verdiSomString={false}
                                        ikon={VilkårInfoIkon.SØKNAD}
                                    />
                                </UnderseksjonWrapper>
                            )
                        )}
                    </BarneInfoWrapper>
                );
            })}
            {skalViseSøknadsdata && stønadstype === Stønadstype.OVERGANGSSTØNAD && (
                <DokumentasjonSendtInn
                    dokumentasjon={dokumentasjon?.terminbekreftelse}
                    tittel={'Terminbekreftelse'}
                />
            )}
        </InformasjonContainer>
    );
};

export default MorEllerFarInfo;
