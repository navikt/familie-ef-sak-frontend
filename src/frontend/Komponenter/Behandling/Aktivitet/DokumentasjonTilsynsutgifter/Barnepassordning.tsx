import React, { FC } from 'react';
import {
    BarnepassordningDto,
    typeBarnepassordningTilTekst,
} from '../../Inngangsvilkår/Aleneomsorg/typer';
import { formaterFraIsoDatoTilStreng } from '../../../../App/utils/formatter';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { Label, VStack } from '@navikt/ds-react';

const Barnepassordning: FC<{
    barnepassordning: BarnepassordningDto;
}> = ({ barnepassordning }) => {
    return (
        <VStack gap="2">
            <Informasjonsrad
                ikon={VilkårInfoIkon.SØKNAD}
                label="Barnepassordning"
                verdi={
                    <Label size="small">
                        {typeBarnepassordningTilTekst[barnepassordning.type]}
                    </Label>
                }
                verdiSomString={false}
            />
            <Informasjonsrad
                label="Navn passordning"
                verdi={barnepassordning.navn}
                boldLabel={false}
            />
            <Informasjonsrad
                label="Periode passordning"
                verdi={formaterFraIsoDatoTilStreng(barnepassordning.fra, barnepassordning.til)}
                boldLabel={false}
            />
            <Informasjonsrad
                label="Utgifter"
                verdi={barnepassordning.beløp + ',-'}
                boldLabel={false}
            />
        </VStack>
    );
};

export default Barnepassordning;
