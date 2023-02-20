import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon } from './typer';
import { IArbeidssøker } from '../../../../App/typer/aktivitetstyper';
import { InfoSeksjonWrapper } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { mapTrueFalse } from '../../../../App/utils/formatter';
import { FlexColumnContainer } from '../../Vilkårpanel/StyledVilkårInnhold';

const Arbeidssøker: FC<{ arbeidssøker: IArbeidssøker }> = ({ arbeidssøker }) => {
    return (
        <InfoSeksjonWrapper
            undertittel={ArbeidssituasjonTilTekst[EArbeidssituasjon.erArbeidssøker]}
            ikon={<Søknadsgrunnlag />}
        >
            <FlexColumnContainer gap={0.75}>
                <Informasjonsrad
                    label="Registrert som arbeidssøker hos Nav"
                    verdi={mapTrueFalse(arbeidssøker.registrertSomArbeidssøkerNav)}
                />
                <Informasjonsrad
                    label="Vil ta imot tilbud om arbeid eller arbeidsmarkedstiltak"
                    verdi={mapTrueFalse(arbeidssøker.villigTilÅTaImotTilbudOmArbeid)}
                />
                <Informasjonsrad
                    label="Kan begynne i arbeid senest én uke etter mottatt tilbud"
                    verdi={mapTrueFalse(arbeidssøker.kanDuBegynneInnenEnUke)}
                />
                <Informasjonsrad
                    label="Ønsker å søke arbeid"
                    verdi={arbeidssøker.hvorØnskerDuArbeid}
                />
                <Informasjonsrad
                    label="Ønsker å være arbeidssøker til minst 50% stilling"
                    verdi={mapTrueFalse(arbeidssøker.ønskerDuMinst50ProsentStilling)}
                />
            </FlexColumnContainer>
        </InfoSeksjonWrapper>
    );
};
export default Arbeidssøker;
