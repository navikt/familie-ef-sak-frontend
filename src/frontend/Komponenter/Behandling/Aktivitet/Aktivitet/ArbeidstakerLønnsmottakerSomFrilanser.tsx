import React, { FC } from 'react';
import { IArbeidsforhold } from '../../../../App/typer/aktivitetstyper';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon, EStilling, StillingTilTekst } from './typer';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import { InfoSeksjonWrapper } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { FlexColumnContainer } from '../../Vilkårpanel/StyledVilkårInnhold';

export const ArbeidstakerLønnsmottakerSomFrilanser: FC<{
    arbeidsforhold: IArbeidsforhold;
    stønadstype: Stønadstype;
}> = ({ arbeidsforhold, stønadstype }) => {
    return (
        <InfoSeksjonWrapper
            undertittel={
                ArbeidssituasjonTilTekst[
                    EArbeidssituasjon.erArbeidstakerOgEllerLønnsmottakerFrilanser
                ]
            }
            ikon={<Søknadsgrunnlag />}
        >
            <FlexColumnContainer $gap={0.75}>
                <Informasjonsrad label="Arbeidssted" verdi={arbeidsforhold.arbeidsgivernavn} />

                {stønadstype === Stønadstype.OVERGANGSSTØNAD && (
                    <Informasjonsrad
                        label="Stillingsprosent"
                        verdi={arbeidsforhold.arbeidsmengde + ' %'}
                    />
                )}
                <Informasjonsrad
                    label="Ansettelsesforhold"
                    verdi={
                        arbeidsforhold.fastEllerMidlertidig
                            ? StillingTilTekst[arbeidsforhold.fastEllerMidlertidig]
                            : '-'
                    }
                />
                {arbeidsforhold.fastEllerMidlertidig === EStilling.midlertidig && (
                    <Informasjonsrad
                        label="Sluttdato"
                        verdi={`${
                            arbeidsforhold.harSluttdato
                                ? 'Ja, ' + formaterNullableIsoDato(arbeidsforhold.sluttdato)
                                : 'Nei'
                        }`}
                    />
                )}
            </FlexColumnContainer>
        </InfoSeksjonWrapper>
    );
};
