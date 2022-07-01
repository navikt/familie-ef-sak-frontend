import React, { FC } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import { mapTilRegistergrunnlagNyttBarn, mapTilSøknadsgrunnlagNyttBarn, Overskrift } from './utils';
import { FlexDiv } from '../../../Oppgavebenk/OppgaveFiltrering';
import RegistergrunnlagNyttBarn from './RegistergrunnlagNyttBarn';
import SøknadgrunnlagNyttBarn from './SøknadsgrunnlagNyttBarn';
import AnnenForelderTidligereVedtaksperioder from './AnnenForelderTidligereVedtaksperioder';

interface Props {
    barnMedSamvær: IBarnMedSamvær[];
    skalViseSøknadsdata: boolean;
}

const NyttBarnSammePartnerInfo: FC<Props> = ({ barnMedSamvær, skalViseSøknadsdata }) => {
    const registergrunnlagNyttBarn = mapTilRegistergrunnlagNyttBarn(barnMedSamvær);
    const søknadsgrunnlagNyttBarn = mapTilSøknadsgrunnlagNyttBarn(barnMedSamvær);
    return (
        <>
            <div>
                <AnnenForelderTidligereVedtaksperioder
                    registergrunnlagNyttBarn={registergrunnlagNyttBarn}
                />
            </div>
            <div>
                <FlexDiv>
                    <Overskrift className="tittel" tag="h3">
                        Brukers barn registrert i folkeregisteret
                    </Overskrift>
                </FlexDiv>
                {registergrunnlagNyttBarn.map((barn) => (
                    <RegistergrunnlagNyttBarn barn={barn} />
                )) || (
                    <Normaltekst>
                        <i>Bruker har ingen barn lagt til i folkeregister</i>
                    </Normaltekst>
                )}
            </div>
            {skalViseSøknadsdata && (
                <div>
                    <FlexDiv>
                        <Overskrift className="tittel" tag="h3">
                            Brukers fremtidige barn lagt til i søknad
                        </Overskrift>
                    </FlexDiv>
                    {søknadsgrunnlagNyttBarn.length ? (
                        søknadsgrunnlagNyttBarn.map((barn) => (
                            <SøknadgrunnlagNyttBarn barn={barn} />
                        ))
                    ) : (
                        <Normaltekst>
                            <i>Bruker har ingen barn lagt til i søknad</i>
                        </Normaltekst>
                    )}
                </div>
            )}
        </>
    );
};
export default NyttBarnSammePartnerInfo;
