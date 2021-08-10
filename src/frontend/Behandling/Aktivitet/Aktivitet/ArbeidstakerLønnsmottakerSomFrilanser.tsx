import React, { FC } from 'react';
import { IArbeidsforhold } from '../../../App/typer/overgangsstønad';
import { Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { formaterNullableIsoDato } from '../../../App/utils/formatter';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon, EStilling, StillingTilTekst } from './typer';

export const ArbeidstakerLønnsmottakerSomFrilanser: FC<{ arbeidsforhold: IArbeidsforhold }> = ({
    arbeidsforhold,
}) => {
    return (
        <>
            <Søknadsgrunnlag />
            <Element className={'undertittel'}>
                {
                    ArbeidssituasjonTilTekst[
                        EArbeidssituasjon.erArbeidstakerOgEllerLønnsmottakerFrilanser
                    ]
                }
            </Element>

            <Normaltekst className={'førsteDataKolonne'}> Arbeidssted</Normaltekst>
            <Normaltekst> {arbeidsforhold.arbeidsgivernavn}</Normaltekst>
            <Normaltekst className={'førsteDataKolonne'}>Stillingsprosent</Normaltekst>
            <Normaltekst>{arbeidsforhold.arbeidsmengde + ' %'}</Normaltekst>
            <Normaltekst className={'førsteDataKolonne'}>Ansettelsesforhold</Normaltekst>
            <Normaltekst>
                {arbeidsforhold.fastEllerMidlertidig
                    ? StillingTilTekst[arbeidsforhold.fastEllerMidlertidig]
                    : '-'}
            </Normaltekst>
            {arbeidsforhold.fastEllerMidlertidig === EStilling.midlertidig && (
                <>
                    <Normaltekst className={'førsteDataKolonne'}>Sluttdato</Normaltekst>
                    <Normaltekst>{`${
                        arbeidsforhold.harSluttdato
                            ? 'Ja, ' + formaterNullableIsoDato(arbeidsforhold.sluttdato)
                            : 'Nei'
                    }`}</Normaltekst>
                </>
            )}
        </>
    );
};
