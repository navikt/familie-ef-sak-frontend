import React, { FC } from 'react';
import { ITidligereUtdanning, IUnderUtdanning } from '../../../../App/typer/aktivitetstyper';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import {
    ArbeidssituasjonTilTekst,
    EArbeidssituasjon,
    StudieandelTilTekst,
    UtdanningsformTilTekst,
} from './typer';
import { GridTabellWrapper } from '../../../../Felles/Visningskomponenter/GridTabell';
import {
    formaterIsoMånedÅr,
    formaterNullableIsoDato,
    mapTrueFalse,
} from '../../../../App/utils/formatter';
import { BodyShortSmall, SmallTextLabel } from '../../../../Felles/Visningskomponenter/Tekster';
import { InfoSeksjonWrapper } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import { FlexColumnContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';

export const UnderUtdanning: FC<{
    underUtdanning: IUnderUtdanning;
}> = ({ underUtdanning }) => {
    return (
        <InfoSeksjonWrapper
            undertittel={ArbeidssituasjonTilTekst[EArbeidssituasjon.tarUtdanning]}
            ikon={<Søknadsgrunnlag />}
        >
            <FlexColumnContainer gap={0.75}>
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
                    verdi={`${formaterNullableIsoDato(
                        underUtdanning.fra
                    )} - ${formaterNullableIsoDato(underUtdanning.til)}`}
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
            </FlexColumnContainer>
        </InfoSeksjonWrapper>
    );
};

export const TidligereUtdanninger: FC<{ tidligereUtdanninger?: ITidligereUtdanning[] }> = ({
    tidligereUtdanninger,
}) => {
    return (
        <>
            <SmallTextLabel className={'førsteDataKolonne'}>Linje/Kurs/grad</SmallTextLabel>
            <SmallTextLabel>Tidsperiode</SmallTextLabel>

            {tidligereUtdanninger?.map((utdanning, index) => (
                <GridTabellWrapper key={utdanning.linjeKursGrad + index}>
                    <BodyShortSmall className={'førsteDataKolonne'}>
                        {utdanning.linjeKursGrad}
                    </BodyShortSmall>
                    <BodyShortSmall>
                        {`${formaterIsoMånedÅr(utdanning.fra)} - ${formaterIsoMånedÅr(
                            utdanning.til
                        )}`}
                    </BodyShortSmall>
                </GridTabellWrapper>
            ))}
        </>
    );
};
