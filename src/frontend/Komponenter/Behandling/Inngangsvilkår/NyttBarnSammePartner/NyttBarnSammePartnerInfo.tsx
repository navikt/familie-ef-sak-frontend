import React, { FC } from 'react';
import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import { mapTilRegistergrunnlagNyttBarn, mapTilSøknadsgrunnlagNyttBarn } from './utils';
import RegistergrunnlagNyttBarn from './RegistergrunnlagNyttBarn';
import SøknadgrunnlagTerminbarn from './SøknadsgrunnlagTerminbarn';
import TidligereVedtaksperioderSøkerOgAndreForeldre from './TidligereVedtaksperioderSøkerOgAndreForeldre';
import { ITidligereVedtaksperioder } from '../../TidligereVedtaksperioder/typer';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import { UnderseksjonWrapper } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import { IPersonalia } from '../vilkår';

interface Props {
    personalia: IPersonalia;
    barnMedSamvær: IBarnMedSamvær[];
    tidligereVedtaksperioder: ITidligereVedtaksperioder;
}

const NyttBarnSammePartnerInfo: FC<Props> = ({
    personalia,
    barnMedSamvær,
    tidligereVedtaksperioder,
}) => {
    const registergrunnlagNyttBarn = mapTilRegistergrunnlagNyttBarn(barnMedSamvær);
    const søknadsgrunnlagNyttBarn = mapTilSøknadsgrunnlagNyttBarn(barnMedSamvær);
    return (
        <InformasjonContainer>
            <TidligereVedtaksperioderSøkerOgAndreForeldre
                personalia={personalia}
                tidligereVedtaksperioder={tidligereVedtaksperioder}
                registergrunnlagNyttBarn={registergrunnlagNyttBarn}
            />
            <UnderseksjonWrapper underoverskrift="Brukers barn registrert i folkeregisteret">
                {registergrunnlagNyttBarn.map((barn) => (
                    <RegistergrunnlagNyttBarn key={barn.barnId} barn={barn} />
                )) || (
                    <BodyShortSmall>
                        <i>Bruker har ingen barn lagt til i folkeregister</i>
                    </BodyShortSmall>
                )}
            </UnderseksjonWrapper>
            <UnderseksjonWrapper underoverskrift="Brukers fremtidige barn lagt til i søknad">
                {søknadsgrunnlagNyttBarn.length ? (
                    søknadsgrunnlagNyttBarn.map((barn) => (
                        <SøknadgrunnlagTerminbarn key={barn.barnId} barn={barn} />
                    ))
                ) : (
                    <BodyShortSmall>
                        <i>Bruker har ingen barn lagt til i søknad</i>
                    </BodyShortSmall>
                )}
            </UnderseksjonWrapper>
        </InformasjonContainer>
    );
};
export default NyttBarnSammePartnerInfo;
