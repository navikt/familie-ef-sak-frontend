import React, { FC } from 'react';
import { IArbeidsforhold } from '../../../../App/typer/aktivitetstyper';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon, EStilling, StillingTilTekst } from './typer';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import { BodyShortSmall, LabelSmallAsText } from '../../../../Felles/Visningskomponenter/Tekster';

export const ArbeidstakerLønnsmottakerSomFrilanser: FC<{
    arbeidsforhold: IArbeidsforhold;
    stønadstype: Stønadstype;
}> = ({ arbeidsforhold, stønadstype }) => {
    return (
        <>
            <Søknadsgrunnlag />
            <LabelSmallAsText className={'undertittel'}>
                {
                    ArbeidssituasjonTilTekst[
                        EArbeidssituasjon.erArbeidstakerOgEllerLønnsmottakerFrilanser
                    ]
                }
            </LabelSmallAsText>

            <BodyShortSmall className={'førsteDataKolonne'}> Arbeidssted</BodyShortSmall>
            <BodyShortSmall> {arbeidsforhold.arbeidsgivernavn}</BodyShortSmall>
            {stønadstype === Stønadstype.OVERGANGSSTØNAD && (
                <>
                    <BodyShortSmall className={'førsteDataKolonne'}>
                        Stillingsprosent
                    </BodyShortSmall>
                    <BodyShortSmall>{arbeidsforhold.arbeidsmengde + ' %'}</BodyShortSmall>
                </>
            )}
            <BodyShortSmall className={'førsteDataKolonne'}>Ansettelsesforhold</BodyShortSmall>
            <BodyShortSmall>
                {arbeidsforhold.fastEllerMidlertidig
                    ? StillingTilTekst[arbeidsforhold.fastEllerMidlertidig]
                    : '-'}
            </BodyShortSmall>
            {arbeidsforhold.fastEllerMidlertidig === EStilling.midlertidig && (
                <>
                    <BodyShortSmall className={'førsteDataKolonne'}>Sluttdato</BodyShortSmall>
                    <BodyShortSmall>{`${
                        arbeidsforhold.harSluttdato
                            ? 'Ja, ' + formaterNullableIsoDato(arbeidsforhold.sluttdato)
                            : 'Nei'
                    }`}</BodyShortSmall>
                </>
            )}
        </>
    );
};
