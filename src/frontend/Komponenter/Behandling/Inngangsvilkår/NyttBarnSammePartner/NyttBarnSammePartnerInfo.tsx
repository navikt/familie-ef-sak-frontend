import React, { FC } from 'react';
import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import { mapTilRegistergrunnlagNyttBarn, mapTilSøknadsgrunnlagNyttBarn } from './utils';
import RegistergrunnlagNyttBarn from './RegistergrunnlagNyttBarn';
import SøknadgrunnlagNyttBarn from './SøknadsgrunnlagNyttBarn';
import TidligereVedtaksperioderSøkerOgAndreForeldre from './TidligereVedtaksperioderSøkerOgAndreForeldre';
import { ITidligereVedtaksperioder } from '../../TidligereVedtaksperioder/typer';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { Label } from '@navikt/ds-react';
import { FlexColumnContainer, InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';

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
            <FlexColumnContainer gap={1.5}>
                <Label className="tittel" as="h3" size={'small'}>
                    Brukers barn registrert i folkeregisteret
                </Label>
                {registergrunnlagNyttBarn.map((barn) => (
                    <RegistergrunnlagNyttBarn key={barn.barnId} barn={barn} />
                )) || (
                    <BodyShortSmall>
                        <i>Bruker har ingen barn lagt til i folkeregister</i>
                    </BodyShortSmall>
                )}
            </FlexColumnContainer>
            <FlexColumnContainer>
                <Label className="tittel" as="h3" size={'small'}>
                    Brukers fremtidige barn lagt til i søknad
                </Label>
                {søknadsgrunnlagNyttBarn.length ? (
                    søknadsgrunnlagNyttBarn.map((barn) => (
                        <SøknadgrunnlagNyttBarn key={barn.barnId} barn={barn} />
                    ))
                ) : (
                    <BodyShortSmall>
                        <i>Bruker har ingen barn lagt til i søknad</i>
                    </BodyShortSmall>
                )}
            </FlexColumnContainer>
        </InformasjonContainer>
    );
};
export default NyttBarnSammePartnerInfo;
