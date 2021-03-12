import React, { FC } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IAktivitet } from '../../../../typer/overgangsstønad';
import { VilkårStatus, VilkårStatusIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
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
                <StyledTabell kolonner={3}>
                    <VilkårStatusIkon className={'vilkårStatusIkon'} vilkårStatus={vilkårStatus} />
                    <Undertittel className="tittel fjernSpacing">Aktivitet</Undertittel>
                </StyledTabell>
                <StyledTabell kolonner={3}>
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
                </StyledTabell>

                <StyledTabell kolonner={3}>
                    {arbeidsforhold &&
                        arbeidsforhold.map((arbeidsgiver) => (
                            <ArbeidstakerLønnsmottakerSomFrilanser
                                key={uuidv4()}
                                arbeidsforhold={arbeidsgiver}
                            />
                        ))}
                </StyledTabell>

                <StyledTabell kolonner={3}>
                    {selvstendig &&
                        selvstendig.map((firma) => (
                            <SelvstendigNæringsdrivendeEllerFrilanser
                                key={uuidv4()}
                                firma={firma}
                            />
                        ))}
                </StyledTabell>

                <StyledTabell kolonner={3}>
                    {aksjeselskap &&
                        aksjeselskap.map((selskap) => (
                            <Aksjeselskap key={uuidv4()} aksjeselskap={selskap} />
                        ))}
                </StyledTabell>

                <StyledTabell kolonner={3}>
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
                </StyledTabell>

                <StyledTabell kolonner={3}>
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
                </StyledTabell>

                <StyledTabell kolonner={3}>
                    {arbeidssøker && <Arbeidssøker arbeidssøker={arbeidssøker} />}
                </StyledTabell>

                <StyledTabell kolonner={3}>
                    {underUtdanning && <UnderUtdanning underUtdanning={underUtdanning} />}

                    {tidligereUtdanninger && (
                        <TidligereUtdanninger tidligereUtdanninger={tidligereUtdanninger} />
                    )}
                </StyledTabell>

                <StyledTabell kolonner={3}>
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
                </StyledTabell>
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
