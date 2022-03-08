import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon } from './typer';
import { IAksjeselskap } from '../../../../App/typer/overgangsstønad';
import { Stønadstype } from '../../../../App/typer/behandlingstema';

const Aksjeselskap: FC<{ aksjeselskap: IAksjeselskap; stønadstype: Stønadstype }> = ({
    aksjeselskap,
    stønadstype,
}) => {
    return (
        <>
            <Søknadsgrunnlag />
            <Element className={'undertittel'}>
                {ArbeidssituasjonTilTekst[EArbeidssituasjon.erAnsattIEgetAS]}
            </Element>
            <Normaltekst className={'førsteDataKolonne'}>Aksjeselskap</Normaltekst>
            <Normaltekst> {aksjeselskap.navn}</Normaltekst>
            {stønadstype === Stønadstype.OVERGANGSSTØNAD && (
                <Normaltekst className={'førsteDataKolonne'}>Stillingsprosent</Normaltekst>
            )}
            {stønadstype === Stønadstype.OVERGANGSSTØNAD && (
                <Normaltekst> {aksjeselskap.arbeidsmengde + ' %'}</Normaltekst>
            )}
        </>
    );
};

export default Aksjeselskap;
