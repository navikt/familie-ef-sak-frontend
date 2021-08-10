import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon } from './typer';
import { BooleanTekst } from '../../../Felles/Visningskomponenter/BooleanTilTekst';
import { IArbeidssøker } from '../../../App/typer/overgangsstønad';

const Arbeidssøker: FC<{ arbeidssøker: IArbeidssøker }> = ({ arbeidssøker }) => {
    return (
        <>
            <Søknadsgrunnlag />
            <Element className={'undertittel'}>
                {ArbeidssituasjonTilTekst[EArbeidssituasjon.erArbeidssøker]}
            </Element>
            <Normaltekst className={'førsteDataKolonne'}>
                Registrert som arbeidssøker hos Nav
            </Normaltekst>
            <BooleanTekst value={arbeidssøker.registrertSomArbeidssøkerNav} />

            <Normaltekst className={'førsteDataKolonne'}>
                Vil ta imot tilbud om arbeid eller arbeidsmarkedstiltak
            </Normaltekst>
            <BooleanTekst value={arbeidssøker.villigTilÅTaImotTilbudOmArbeid} />
            <Normaltekst className={'førsteDataKolonne'}>
                Kan begynne i arbeid senest én uke etter mottatt tilbud
            </Normaltekst>
            <BooleanTekst value={arbeidssøker.kanDuBegynneInnenEnUke} />

            <Normaltekst className={'førsteDataKolonne'}>Ønsker å søke arbeid</Normaltekst>
            <Normaltekst>{arbeidssøker.hvorØnskerDuArbeid}</Normaltekst>

            <Normaltekst className={'førsteDataKolonne'}>
                Ønsker å være arbeidssøker til minst 50% stilling
            </Normaltekst>
            <BooleanTekst value={arbeidssøker.ønskerDuMinst50ProsentStilling} />
        </>
    );
};
export default Arbeidssøker;
