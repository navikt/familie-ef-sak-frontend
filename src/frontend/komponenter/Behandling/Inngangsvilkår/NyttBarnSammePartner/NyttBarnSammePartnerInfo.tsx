import React, { FC } from 'react';
import { Element } from 'nav-frontend-typografi';
import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import { mapTilRegistergrunnlagNyttBarn, mapTilSøknadsgrunnlagNyttBarn } from './utils';
import { FlexDiv } from '../../../Oppgavebenk/OppgaveFiltrering';
import styled from 'styled-components';
import EtikettBase from 'nav-frontend-etiketter';
import RegistergrunnlagNyttBarn from './RegistergrunnlagNyttBarn';
import SøknadgrunnlagNyttBarn from './SøknadsgrunnlagNyttBarn';
import { Normaltekst } from 'nav-frontend-typografi';

interface Props {
    barnMedSamvær: IBarnMedSamvær[];
}

const Overskrift = styled(Element)`
    margin-left: 0.5rem;
    margin-bottom: 1rem;
`;

export const EtikettDød = styled(EtikettBase)`
    background-color: black;
    color: #eee;
    margin-left: 0.5rem;
    border: none;
`;

const NyttBarnSammePartnerInfo: FC<Props> = ({ barnMedSamvær }) => {
    const registergrunnlagNyttBarn = mapTilRegistergrunnlagNyttBarn(barnMedSamvær);
    const søknadsgrunnlagNyttBarn = mapTilSøknadsgrunnlagNyttBarn(barnMedSamvær);

    console.log('barnmedsamvær', barnMedSamvær);

    return (
        <>
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
            <div>
                <FlexDiv>
                    <Overskrift className="tittel" tag="h3">
                        Brukers fremtidige barn lagt til i søknad
                    </Overskrift>
                </FlexDiv>
                {søknadsgrunnlagNyttBarn.map((barn) => <SøknadgrunnlagNyttBarn barn={barn} />) || (
                    <Normaltekst>
                        <i>Bruker har ingen barn lagt til i søknad</i>
                    </Normaltekst>
                )}
            </div>
        </>
    );
};
export default NyttBarnSammePartnerInfo;
