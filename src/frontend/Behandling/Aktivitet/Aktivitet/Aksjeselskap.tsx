import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon } from './typer';
import { IAksjeselskap } from '../../../App/typer/overgangsstønad';

const Aksjeselskap: FC<{ aksjeselskap: IAksjeselskap }> = ({ aksjeselskap }) => {
    return (
        <>
            <Søknadsgrunnlag />
            <Element className={'undertittel'}>
                {ArbeidssituasjonTilTekst[EArbeidssituasjon.erAnsattIEgetAS]}
            </Element>
            <Normaltekst className={'førsteDataKolonne'}>Aksjeselskap</Normaltekst>
            <Normaltekst> {aksjeselskap.navn}</Normaltekst>
            <Normaltekst className={'førsteDataKolonne'}>Stillingsprosent</Normaltekst>
            <Normaltekst> {aksjeselskap.arbeidsmengde + ' %'}</Normaltekst>
        </>
    );
};

export default Aksjeselskap;
