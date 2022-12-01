import React, { FC } from 'react';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon } from './typer';
import { IAksjeselskap } from '../../../../App/typer/aktivitetstyper';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import { BodyShortSmall, LabelSmallAsText } from '../../../../Felles/Visningskomponenter/Tekster';

const Aksjeselskap: FC<{ aksjeselskap: IAksjeselskap; stønadstype: Stønadstype }> = ({
    aksjeselskap,
    stønadstype,
}) => {
    return (
        <>
            <Søknadsgrunnlag />
            <LabelSmallAsText className={'undertittel'}>
                {ArbeidssituasjonTilTekst[EArbeidssituasjon.erAnsattIEgetAS]}
            </LabelSmallAsText>
            <BodyShortSmall className={'førsteDataKolonne'}>Aksjeselskap</BodyShortSmall>
            <BodyShortSmall> {aksjeselskap.navn}</BodyShortSmall>
            {stønadstype === Stønadstype.OVERGANGSSTØNAD && (
                <>
                    <BodyShortSmall className={'førsteDataKolonne'}>
                        Stillingsprosent
                    </BodyShortSmall>
                    <BodyShortSmall> {aksjeselskap.arbeidsmengde + ' %'}</BodyShortSmall>
                </>
            )}
        </>
    );
};

export default Aksjeselskap;
