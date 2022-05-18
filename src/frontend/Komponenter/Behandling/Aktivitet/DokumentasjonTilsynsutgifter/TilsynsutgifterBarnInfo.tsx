import React, { FC } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { IBarnMedSamvær } from '../../Inngangsvilkår/Aleneomsorg/typer';

const TilsynsutgifterBarnInfo: FC<{
    gjeldendeBarn: IBarnMedSamvær;
    skalViseSøknadsdata?: boolean;
}> = ({ gjeldendeBarn }) => {
    return <Normaltekst>{gjeldendeBarn.registergrunnlag.navn}</Normaltekst>;
};

export default TilsynsutgifterBarnInfo;
