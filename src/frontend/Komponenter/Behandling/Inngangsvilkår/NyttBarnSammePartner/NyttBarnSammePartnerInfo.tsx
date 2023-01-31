import React, { FC } from 'react';
import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import { mapTilRegistergrunnlagNyttBarn, mapTilSøknadsgrunnlagNyttBarn, Overskrift } from './utils';
import { FlexDiv } from '../../../Oppgavebenk/OppgaveFiltrering';
import RegistergrunnlagNyttBarn from './RegistergrunnlagNyttBarn';
import SøknadgrunnlagNyttBarn from './SøknadsgrunnlagNyttBarn';
import TidligereVedtaksperioderSøkerOgAndreForeldre from './TidligereVedtaksperioderSøkerOgAndreForeldre';
import { ITidligereVedtaksperioder } from '../../TidligereVedtaksperioder/typer';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { Label } from '@navikt/ds-react';

interface Props {
    barnMedSamvær: IBarnMedSamvær[];
    tidligereVedtaksperioder: ITidligereVedtaksperioder;
}

const NyttBarnSammePartnerInfo: FC<Props> = ({ barnMedSamvær, tidligereVedtaksperioder }) => {
    const registergrunnlagNyttBarn = mapTilRegistergrunnlagNyttBarn(barnMedSamvær);
    const søknadsgrunnlagNyttBarn = mapTilSøknadsgrunnlagNyttBarn(barnMedSamvær);
    return (
        <>
            <div>
                <TidligereVedtaksperioderSøkerOgAndreForeldre
                    tidligereVedtaksperioder={tidligereVedtaksperioder}
                    registergrunnlagNyttBarn={registergrunnlagNyttBarn}
                />
            </div>
            <div>
                <FlexDiv>
                    <Overskrift>
                        <Label className="tittel" as="h3" size={'small'}>
                            Brukers barn registrert i folkeregisteret
                        </Label>
                    </Overskrift>
                </FlexDiv>
                {registergrunnlagNyttBarn.map((barn) => (
                    <RegistergrunnlagNyttBarn key={barn.barnId} barn={barn} />
                )) || (
                    <BodyShortSmall>
                        <i>Bruker har ingen barn lagt til i folkeregister</i>
                    </BodyShortSmall>
                )}
            </div>
            <div>
                <FlexDiv>
                    <Overskrift>
                        <Label className="tittel" as="h3" size={'small'}>
                            Brukers fremtidige barn lagt til i søknad
                        </Label>
                    </Overskrift>
                </FlexDiv>
                {søknadsgrunnlagNyttBarn.length ? (
                    søknadsgrunnlagNyttBarn.map((barn) => (
                        <SøknadgrunnlagNyttBarn key={barn.barnId} barn={barn} />
                    ))
                ) : (
                    <BodyShortSmall>
                        <i>Bruker har ingen barn lagt til i søknad</i>
                    </BodyShortSmall>
                )}
            </div>
        </>
    );
};
export default NyttBarnSammePartnerInfo;
