import React, { FC } from 'react';
import { IAktivitet } from '../../../App/typer/overgangsstønad';
import { GridTabell } from '../../../Felles/Visningskomponenter/GridTabell';
import { Søknadsgrunnlag } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon } from './typer';
import SelvstendigNæringsdrivendeEllerFrilanser from './SelvstendigNæringsdrivendeEllerFrilanser';
import Arbeidssøker from './Arbeidssøker';
import { TidligereUtdanninger, UnderUtdanning } from './Utdanning';
import { SeksjonWrapper } from '../../../Felles/Visningskomponenter/SeksjonWrapper';
import Annet from './Annet';
import Aksjeselskap from './Aksjeselskap';
import { formaterNullableIsoDato } from '../../../App/utils/formatter';
import { ArbeidstakerLønnsmottakerSomFrilanser } from './ArbeidstakerLønnsmottakerSomFrilanser';

interface Props {
    aktivitet: IAktivitet;
}
const AktivitetInfo: FC<Props> = ({ aktivitet }) => {
    const {
        arbeidssituasjon,
        arbeidsforhold,
        selvstendig,
        aksjeselskap,
        virksomhet,
        arbeidssøker,
        datoOppstartJobb,
        underUtdanning,
        tidligereUtdanninger,
        særligeTilsynsbehov,
        gjelderDeg,
    } = aktivitet;

    return (
        <>
            <SeksjonWrapper>
                {arbeidssituasjon.includes(EArbeidssituasjon.erHjemmeMedBarnUnderEttÅr) && (
                    <GridTabell kolonner={3}>
                        <Søknadsgrunnlag />
                        <Element className={'undertittel'}>
                            {ArbeidssituasjonTilTekst[EArbeidssituasjon.erHjemmeMedBarnUnderEttÅr]}
                        </Element>
                    </GridTabell>
                )}

                {arbeidsforhold &&
                    arbeidsforhold.map((arbeidsgiver, index) => (
                        <GridTabell kolonner={3} key={arbeidsgiver.arbeidsgivernavn + index}>
                            <ArbeidstakerLønnsmottakerSomFrilanser
                                key={arbeidsgiver.arbeidsgivernavn + index}
                                arbeidsforhold={arbeidsgiver}
                            />
                        </GridTabell>
                    ))}

                {selvstendig &&
                    selvstendig.map((firma, index) => (
                        <GridTabell kolonner={3} key={firma.organisasjonsnummer + index}>
                            <SelvstendigNæringsdrivendeEllerFrilanser
                                key={firma.organisasjonsnummer + index}
                                firma={firma}
                            />
                        </GridTabell>
                    ))}

                {aksjeselskap &&
                    aksjeselskap.map((selskap, index) => (
                        <GridTabell kolonner={3} key={selskap.navn + index}>
                            <Aksjeselskap key={selskap.navn + index} aksjeselskap={selskap} />
                        </GridTabell>
                    ))}

                {datoOppstartJobb && (
                    <GridTabell kolonner={3}>
                        <Søknadsgrunnlag />
                        <Element className={'undertittel'}>
                            {ArbeidssituasjonTilTekst[EArbeidssituasjon.harFåttJobbTilbud]}
                        </Element>
                        <Normaltekst className={'førsteDataKolonne'}>Startdato ny jobb</Normaltekst>
                        <Normaltekst> {formaterNullableIsoDato(datoOppstartJobb)}</Normaltekst>
                    </GridTabell>
                )}

                {virksomhet && (
                    <GridTabell kolonner={3}>
                        <Søknadsgrunnlag />
                        <Element className={'undertittel'}>
                            {ArbeidssituasjonTilTekst[EArbeidssituasjon.etablererEgenVirksomhet]}
                        </Element>
                        <Normaltekst className={'førsteDataKolonne'}>
                            Beskrivelse av virksomheten
                        </Normaltekst>
                        <Normaltekst> {virksomhet?.virksomhetsbeskrivelse}</Normaltekst>
                    </GridTabell>
                )}

                {arbeidssøker && (
                    <GridTabell kolonner={3}>
                        <Arbeidssøker arbeidssøker={arbeidssøker} />{' '}
                    </GridTabell>
                )}

                {underUtdanning && (
                    <GridTabell kolonner={3}>
                        <UnderUtdanning underUtdanning={underUtdanning} />
                        {underUtdanning.utdanningEtterGrunnskolen && (
                            <TidligereUtdanninger tidligereUtdanninger={tidligereUtdanninger} />
                        )}
                    </GridTabell>
                )}

                {arbeidssituasjon.includes(
                    EArbeidssituasjon.erHverkenIArbeidUtdanningEllerArbeidssøker
                ) && (
                    <GridTabell kolonner={3}>
                        <Søknadsgrunnlag />
                        <Element className={'undertittel'}>
                            {
                                ArbeidssituasjonTilTekst[
                                    EArbeidssituasjon.erHverkenIArbeidUtdanningEllerArbeidssøker
                                ]
                            }
                        </Element>
                    </GridTabell>
                )}
            </SeksjonWrapper>

            {særligeTilsynsbehov && (
                <SeksjonWrapper>
                    <Annet dinSituasjon={gjelderDeg} særligTilsynsbehov={særligeTilsynsbehov} />
                </SeksjonWrapper>
            )}
        </>
    );
};

export default AktivitetInfo;
