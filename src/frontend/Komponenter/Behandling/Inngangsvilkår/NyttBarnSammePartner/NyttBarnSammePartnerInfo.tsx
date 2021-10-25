import React, { FC } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { IBarnMedSamvær } from '../Aleneomsorg/typer';
import { mapTilRegistergrunnlagNyttBarn, mapTilSøknadsgrunnlagNyttBarn } from './utils';
import { FlexDiv } from '../../../Oppgavebenk/OppgaveFiltrering';
import styled from 'styled-components';
import RegistergrunnlagNyttBarn from './RegistergrunnlagNyttBarn';
import SøknadgrunnlagNyttBarn from './SøknadsgrunnlagNyttBarn';

interface Props {
    barnMedSamvær: IBarnMedSamvær[];
    skalSkjuleSøknadsdata?: boolean;
}

const Overskrift = styled(Element)`
    margin-left: 0.5rem;
    margin-bottom: 1rem;
`;

const NyttBarnSammePartnerInfo: FC<Props> = ({ barnMedSamvær, skalSkjuleSøknadsdata }) => {
    const registergrunnlagNyttBarn = mapTilRegistergrunnlagNyttBarn(barnMedSamvær);
    const søknadsgrunnlagNyttBarn = mapTilSøknadsgrunnlagNyttBarn(barnMedSamvær);

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
            {!skalSkjuleSøknadsdata && (
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
