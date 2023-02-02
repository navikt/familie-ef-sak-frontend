import React, { FC } from 'react';
import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import { mapTilRegistergrunnlagNyttBarn, mapTilSøknadsgrunnlagNyttBarn } from './utils';
import RegistergrunnlagNyttBarn from './RegistergrunnlagNyttBarn';
import SøknadgrunnlagNyttBarn from './SøknadsgrunnlagNyttBarn';
import TidligereVedtaksperioderSøkerOgAndreForeldre from './TidligereVedtaksperioderSøkerOgAndreForeldre';
import { ITidligereVedtaksperioder } from '../../TidligereVedtaksperioder/typer';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import { UnderseksjonWrapper } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    barnMedSamvær: IBarnMedSamvær[];
    tidligereVedtaksperioder: ITidligereVedtaksperioder;
}

const NyttBarnSammePartnerInfo: FC<Props> = ({ barnMedSamvær, tidligereVedtaksperioder }) => {
    const registergrunnlagNyttBarn = mapTilRegistergrunnlagNyttBarn(barnMedSamvær);
    const søknadsgrunnlagNyttBarn = mapTilSøknadsgrunnlagNyttBarn(barnMedSamvær);
    return (
        <InformasjonContainer>
            <TidligereVedtaksperioderSøkerOgAndreForeldre
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
                        <SøknadgrunnlagNyttBarn key={barn.barnId} barn={barn} />
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
