import React, { FC } from 'react';
import { IAktivitet } from '../../../../typer/overgangsstønad';
import { VilkårStatus, VilkårStatusIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
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

interface Props {
    aktivitet: IAktivitet;
    vilkårStatus: VilkårStatus;
}
const AktivitetVisning: FC<Props> = ({ aktivitet, vilkårStatus }) => {
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
                    <VilkårStatusIkon className={'vilkårStatusIkon'} vilkårStatus={vilkårStatus} />
                    <Undertittel className="tittel fjernSpacing">Aktivitet</Undertittel>
                </GridTabell>
                <GridTabell kolonner={3}>
                    {arbeidssituasjon.includes(EArbeidssituasjon.erHjemmeMedBarnUnderEttÅr) && (
                        <>
                            <Søknadsgrunnlag />
                            <Element className={'undertittel'}>
                                {
                                    ArbeidssituasjonTilTekst[
                                        EArbeidssituasjon.erHjemmeMedBarnUnderEttÅr
                                    ]
                                }
                            </Element>
                        </>
                    )}
                </GridTabell>

                <GridTabell kolonner={3}>
                    {arbeidsforhold &&
                        arbeidsforhold.map((arbeidsgiver, index) => (
                            <ArbeidstakerLønnsmottakerSomFrilanser
                                key={arbeidsgiver.arbeidsgivernavn + index}
                                arbeidsforhold={arbeidsgiver}
                            />
                        ))}
                </GridTabell>

                <GridTabell kolonner={3}>
                    {selvstendig &&
                        selvstendig.map((firma, index) => (
                            <SelvstendigNæringsdrivendeEllerFrilanser
                                key={firma.organisasjonsnummer + index}
                                firma={firma}
                            />
                        ))}
                </GridTabell>

                <GridTabell kolonner={3}>
                    {aksjeselskap &&
                        aksjeselskap.map((selskap, index) => (
                            <Aksjeselskap key={selskap.navn + index} aksjeselskap={selskap} />
                        ))}
                </GridTabell>

                <GridTabell kolonner={3}>
                    {datoOppstartJobb && (
                        <>
                            <Søknadsgrunnlag />
                            <Element className={'undertittel'}>
                                {ArbeidssituasjonTilTekst[EArbeidssituasjon.harFåttJobbTilbud]}
                            </Element>
                            <Normaltekst className={'førsteDataKolonne'}>
                                Startdato ny jobb
                            </Normaltekst>
                            <Normaltekst> {formaterNullableIsoDato(datoOppstartJobb)}</Normaltekst>
                        </>
                    )}
                </GridTabell>

                <GridTabell kolonner={3}>
                    {virksomhet && (
                        <>
                            <Søknadsgrunnlag />
                            <Element className={'undertittel'}>
                                {
                                    ArbeidssituasjonTilTekst[
                                        EArbeidssituasjon.etablererEgenVirksomhet
                                    ]
                                }
                            </Element>
                            <Normaltekst className={'førsteDataKolonne'}>
                                Om virksomheten
                            </Normaltekst>
                            <Normaltekst> {virksomhet?.virksomhetsbeskrivelse}</Normaltekst>
                        </>
                    )}
                </GridTabell>

                <GridTabell kolonner={3}>
                    {arbeidssøker && <Arbeidssøker arbeidssøker={arbeidssøker} />}
                </GridTabell>

                <GridTabell kolonner={3}>
                    {underUtdanning && <UnderUtdanning underUtdanning={underUtdanning} />}

                    {tidligereUtdanninger && (
                        <TidligereUtdanninger tidligereUtdanninger={tidligereUtdanninger} />
                    )}
                </GridTabell>

                <GridTabell kolonner={3}>
                    {arbeidssituasjon.includes(
                        EArbeidssituasjon.erHverkenIArbeidUtdanningEllerArbeidssøker
                    ) && (
                        <>
                            <Søknadsgrunnlag />
                            <Element className={'undertittel'}>
                                {
                                    ArbeidssituasjonTilTekst[
                                        EArbeidssituasjon.erHverkenIArbeidUtdanningEllerArbeidssøker
                                    ]
                                }
                            </Element>
                        </>
                    )}
                </GridTabell>
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
