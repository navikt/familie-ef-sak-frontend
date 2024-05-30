import React, { FC } from 'react';
import { ITidligereUtdanning, IUnderUtdanning } from '../../../../App/typer/aktivitetstyper';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import {
    ArbeidssituasjonTilTekst,
    EArbeidssituasjon,
    StudieandelTilTekst,
    UtdanningsformTilTekst,
} from './typer';
import {
    formaterIsoMånedÅr,
    formaterTilIsoDatoFraTilStreng,
    mapTrueFalse,
} from '../../../../App/utils/formatter';
import { InfoSeksjonWrapper } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import { FlexColumnContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import TabellVisning from '../../Tabell/TabellVisning';

export const UnderUtdanning: FC<{
    underUtdanning: IUnderUtdanning;
    tidligereUtdanninger: ITidligereUtdanning[];
}> = ({ underUtdanning, tidligereUtdanninger }) => {
    return (
        <InfoSeksjonWrapper
            undertittel={ArbeidssituasjonTilTekst[EArbeidssituasjon.tarUtdanning]}
            ikon={<Søknadsgrunnlag />}
        >
            <FlexColumnContainer $gap={0.75}>
                <Informasjonsrad
                    label="Skole/Utdanningssted"
                    verdi={underUtdanning.skoleUtdanningssted}
                />
                <Informasjonsrad label="Linje/Kurs/Grad" verdi={underUtdanning.linjeKursGrad} />
                <Informasjonsrad
                    label="Offentlig eller privat"
                    verdi={UtdanningsformTilTekst[underUtdanning.offentligEllerPrivat]}
                />
                <Informasjonsrad
                    label="Studiets tidsperiode"
                    verdi={formaterTilIsoDatoFraTilStreng(underUtdanning.fra, underUtdanning.til)}
                />
                <Informasjonsrad
                    label="Heltid eller deltid"
                    verdi={StudieandelTilTekst[underUtdanning.heltidEllerDeltid]}
                />
                {underUtdanning.hvorMyeSkalDuStudere && (
                    <Informasjonsrad
                        label="Hvor mye skal søker studere"
                        verdi={underUtdanning.hvorMyeSkalDuStudere + ' %'}
                    />
                )}
                <Informasjonsrad
                    label="Målet for utdanningen"
                    verdi={underUtdanning.hvaErMåletMedUtdanningen}
                />
                <Informasjonsrad
                    label="Har søker utdanning etter grunnskolen"
                    verdi={mapTrueFalse(underUtdanning.utdanningEtterGrunnskolen)}
                />
                {underUtdanning.utdanningEtterGrunnskolen && (
                    <TidligereUtdanninger tidligereUtdanninger={tidligereUtdanninger} />
                )}
            </FlexColumnContainer>
        </InfoSeksjonWrapper>
    );
};

export const TidligereUtdanninger: FC<{ tidligereUtdanninger: ITidligereUtdanning[] }> = ({
    tidligereUtdanninger,
}) => {
    return (
        <TabellVisning
            ikonVisning={true}
            verdier={tidligereUtdanninger}
            kolonner={[
                {
                    overskrift: 'Linje/kurs/grad',
                    tekstVerdi: (d) => d.linjeKursGrad,
                },
                {
                    overskrift: 'Tidsperiode',
                    tekstVerdi: (d) =>
                        `${formaterIsoMånedÅr(d.fra)} - ${formaterIsoMånedÅr(d.til)}`,
                },
            ]}
        />
    );
};
