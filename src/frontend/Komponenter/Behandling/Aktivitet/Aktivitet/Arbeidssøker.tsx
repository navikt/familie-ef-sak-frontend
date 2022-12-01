import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon } from './typer';
import { BooleanTekst } from '../../../../Felles/Visningskomponenter/BooleanTilTekst';
import { IArbeidssøker } from '../../../../App/typer/aktivitetstyper';
import { BodyShortSmall, LabelSmallAsText } from '../../../../Felles/Visningskomponenter/Tekster';

const Arbeidssøker: FC<{ arbeidssøker: IArbeidssøker }> = ({ arbeidssøker }) => {
    return (
        <>
            <Søknadsgrunnlag />
            <LabelSmallAsText className={'undertittel'}>
                {ArbeidssituasjonTilTekst[EArbeidssituasjon.erArbeidssøker]}
            </LabelSmallAsText>
            <BodyShortSmall className={'førsteDataKolonne'}>
                Registrert som arbeidssøker hos Nav
            </BodyShortSmall>
            <BooleanTekst value={arbeidssøker.registrertSomArbeidssøkerNav} />

            <BodyShortSmall className={'førsteDataKolonne'}>
                Vil ta imot tilbud om arbeid eller arbeidsmarkedstiltak
            </BodyShortSmall>
            <BooleanTekst value={arbeidssøker.villigTilÅTaImotTilbudOmArbeid} />
            <BodyShortSmall className={'førsteDataKolonne'}>
                Kan begynne i arbeid senest én uke etter mottatt tilbud
            </BodyShortSmall>
            <BooleanTekst value={arbeidssøker.kanDuBegynneInnenEnUke} />

            <BodyShortSmall className={'førsteDataKolonne'}>Ønsker å søke arbeid</BodyShortSmall>
            <BodyShortSmall>{arbeidssøker.hvorØnskerDuArbeid}</BodyShortSmall>

            <BodyShortSmall className={'førsteDataKolonne'}>
                Ønsker å være arbeidssøker til minst 50% stilling
            </BodyShortSmall>
            <BooleanTekst value={arbeidssøker.ønskerDuMinst50ProsentStilling} />
        </>
    );
};
export default Arbeidssøker;
