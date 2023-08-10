import React, { FC } from 'react';
import { IBarnMedSamvær } from '../../Inngangsvilkår/Aleneomsorg/typer';
import { utledNavnOgAlder } from '../../Inngangsvilkår/utils';
import { BarneInfoWrapper } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import Barnepassordning from './Barnepassordning';

const TilsynsutgifterBarnInfo: FC<{
    gjeldendeBarn: IBarnMedSamvær;
}> = ({ gjeldendeBarn }) => {
    const { registergrunnlag, barnepass } = gjeldendeBarn;
    const harPassordning = barnepass && barnepass.barnepassordninger;

    return (
        <BarneInfoWrapper
            navnOgAlderPåBarn={utledNavnOgAlder(
                registergrunnlag.navn,
                registergrunnlag.fødselsdato,
                registergrunnlag.dødsdato
            )}
            dødsdato={registergrunnlag.dødsdato}
        >
            {!gjeldendeBarn.barnepass?.skalHaBarnepass ? (
                <Informasjonsrad label="Ingen søknadsopplysninger" />
            ) : (
                harPassordning &&
                barnepass.barnepassordninger.map((ordning) => (
                    <Barnepassordning barnepassordning={ordning} />
                ))
            )}
        </BarneInfoWrapper>
    );
};

export default TilsynsutgifterBarnInfo;
