import React, { FC } from 'react';
import { IAktivitet } from '../../../../typer/overgangsstønad';
import { VilkårsresultatIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon } from './typer';
import SelvstendigNæringsdrivendeEllerFrilanser from './SelvstendigNæringsdrivendeEllerFrilanser';
import Arbeidssøker from './Arbeidssøker';
import { TidligereUtdanninger, UnderUtdanning } from './Utdanning';
import { SeksjonWrapper } from '../../../Felleskomponenter/SeksjonWrapper';
import Annet from './Annet';
import Aksjeselskap from './Aksjeselskap';
import { formaterNullableIsoDato } from '../../../../utils/formatter';
import { ArbeidstakerLønnsmottakerSomFrilanser } from './ArbeidstakerLønnsmottakerSomFrilanser';
import { Vilkårsresultat } from '../../Inngangsvilkår/vilkår';

interface Props {
    aktivitet: IAktivitet;
    vilkårsresultat: Vilkårsresultat;
}
const AktivitetVisning: FC<Props> = ({ aktivitet, vilkårsresultat }) => {
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
                <GridTabell kolonner={3}>
                    <VilkårsresultatIkon
                        className={'vilkårStatusIkon'}
                        vilkårsresultat={vilkårsresultat}
                    />
                    <Undertittel className="tittel fjernSpacing">Aktivitet</Undertittel>
                </GridTabell>

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
                        <GridTabell kolonner={3}>
                            <ArbeidstakerLønnsmottakerSomFrilanser
                                key={arbeidsgiver.arbeidsgivernavn + index}
                                arbeidsforhold={arbeidsgiver}
                            />
                        </GridTabell>
                    ))}

                {selvstendig &&
                    selvstendig.map((firma, index) => (
                        <GridTabell kolonner={3}>
                            <SelvstendigNæringsdrivendeEllerFrilanser
                                key={firma.organisasjonsnummer + index}
                                firma={firma}
                            />
                        </GridTabell>
                    ))}

                {aksjeselskap && (
                    <GridTabell kolonner={3}>
                        {aksjeselskap.map((selskap, index) => (
                            <Aksjeselskap key={selskap.navn + index} aksjeselskap={selskap} />
                        ))}
                    </GridTabell>
                )}

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
                        <Normaltekst className={'førsteDataKolonne'}>Om virksomheten</Normaltekst>
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
                        {tidligereUtdanninger && (
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

export default AktivitetVisning;
