import React, { FC } from 'react';
import {
    BarnepassordningDto,
    typeBarnepassordningTilTekst,
} from '../../Inngangsvilkår/Aleneomsorg/typer';
import { formaterTilIsoDatoFraTilStreng } from '../../../../App/utils/formatter';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import styled from 'styled-components';
import { Label } from '@navikt/ds-react';

const PassordningWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Barnepassordning: FC<{
    barnepassordning: BarnepassordningDto;
}> = ({ barnepassordning }) => {
    return (
        <PassordningWrapper>
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
                verdi={formaterTilIsoDatoFraTilStreng(barnepassordning.fra, barnepassordning.til)}
                boldLabel={false}
            />
            <Informasjonsrad
                label="Utgifter"
                verdi={barnepassordning.beløp + ',-'}
                boldLabel={false}
            />
        </PassordningWrapper>
    );
};

export default Barnepassordning;
