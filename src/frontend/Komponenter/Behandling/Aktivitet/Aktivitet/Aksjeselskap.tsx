import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon } from './typer';
import { IAksjeselskap } from '../../../../App/typer/aktivitetstyper';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import { InfoSeksjonWrapper } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import { FlexColumnContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';

const Aksjeselskap: FC<{ aksjeselskap: IAksjeselskap; stønadstype: Stønadstype }> = ({
    aksjeselskap,
    stønadstype,
}) => {
    return (
        <InfoSeksjonWrapper
            undertittel={ArbeidssituasjonTilTekst[EArbeidssituasjon.erAnsattIEgetAS]}
            ikon={<Søknadsgrunnlag />}
        >
            <FlexColumnContainer gap={0.75}>
                <Informasjonsrad label="Aksjeselskap" verdi={aksjeselskap.navn} />
                {stønadstype === Stønadstype.OVERGANGSSTØNAD && (
                    <Informasjonsrad
                        label="Stillingsprosent"
                        verdi={aksjeselskap.arbeidsmengde + ' %'}
                    />
                )}
            </FlexColumnContainer>
        </InfoSeksjonWrapper>
    );
};

export default Aksjeselskap;
