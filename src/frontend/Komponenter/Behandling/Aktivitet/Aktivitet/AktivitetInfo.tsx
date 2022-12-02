import React, { FC } from 'react';
import { IAktivitet } from '../../../../App/typer/aktivitetstyper';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon } from './typer';
import SelvstendigNæringsdrivendeEllerFrilanser from './SelvstendigNæringsdrivendeEllerFrilanser';
import Arbeidssøker from './Arbeidssøker';
import { TidligereUtdanninger, UnderUtdanning } from './Utdanning';
import { SeksjonWrapper } from '../../../../Felles/Visningskomponenter/SeksjonWrapper';
import Annet from './Annet';
import Aksjeselskap from './Aksjeselskap';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { ArbeidstakerLønnsmottakerSomFrilanser } from './ArbeidstakerLønnsmottakerSomFrilanser';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import DokumentasjonSendtInn from '../../Inngangsvilkår/DokumentasjonSendtInn';
import { IDokumentasjonGrunnlag } from '../../Inngangsvilkår/vilkår';
import { BodyShortSmall, SmallTextLabel } from '../../../../Felles/Visningskomponenter/Tekster';

interface Props {
    aktivitet: IAktivitet;
    skalViseSøknadsdata: boolean;
    stønadstype: Stønadstype;
    dokumentasjon?: IDokumentasjonGrunnlag;
}

const AktivitetInfo: FC<Props> = ({
    aktivitet,
    skalViseSøknadsdata,
    stønadstype,
    dokumentasjon,
}) => {
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
                {skalViseSøknadsdata &&
                    arbeidssituasjon.includes(EArbeidssituasjon.erHjemmeMedBarnUnderEttÅr) && (
                        <GridTabell kolonner={3}>
                            <Søknadsgrunnlag />
                            <SmallTextLabel className={'undertittel'}>
                                {
                                    ArbeidssituasjonTilTekst[
                                        EArbeidssituasjon.erHjemmeMedBarnUnderEttÅr
                                    ]
                                }
                            </SmallTextLabel>
                        </GridTabell>
                    )}

                {skalViseSøknadsdata &&
                    arbeidsforhold &&
                    arbeidsforhold.map((arbeidsgiver, index) => (
                        <GridTabell kolonner={3} key={arbeidsgiver.arbeidsgivernavn + index}>
                            <ArbeidstakerLønnsmottakerSomFrilanser
                                key={arbeidsgiver.arbeidsgivernavn + index}
                                arbeidsforhold={arbeidsgiver}
                                stønadstype={stønadstype}
                            />
                        </GridTabell>
                    ))}

                {skalViseSøknadsdata &&
                    selvstendig &&
                    selvstendig.map((firma, index) => (
                        <GridTabell kolonner={3} key={firma.organisasjonsnummer + index}>
                            <SelvstendigNæringsdrivendeEllerFrilanser
                                key={firma.organisasjonsnummer + index}
                                firma={firma}
                                stønadstype={stønadstype}
                            />
                        </GridTabell>
                    ))}

                {skalViseSøknadsdata &&
                    aksjeselskap &&
                    aksjeselskap.map((selskap, index) => (
                        <GridTabell kolonner={3} key={selskap.navn + index}>
                            <Aksjeselskap
                                key={selskap.navn + index}
                                aksjeselskap={selskap}
                                stønadstype={stønadstype}
                            />
                        </GridTabell>
                    ))}

                {skalViseSøknadsdata && datoOppstartJobb && (
                    <GridTabell kolonner={3}>
                        <Søknadsgrunnlag />
                        <SmallTextLabel className={'undertittel'}>
                            {ArbeidssituasjonTilTekst[EArbeidssituasjon.harFåttJobbTilbud]}
                        </SmallTextLabel>
                        <BodyShortSmall className={'førsteDataKolonne'}>
                            Startdato ny jobb
                        </BodyShortSmall>
                        <BodyShortSmall>
                            {' '}
                            {formaterNullableIsoDato(datoOppstartJobb)}
                        </BodyShortSmall>
                    </GridTabell>
                )}

                {skalViseSøknadsdata && virksomhet && (
                    <GridTabell kolonner={3}>
                        <Søknadsgrunnlag />
                        <SmallTextLabel className={'undertittel'}>
                            {ArbeidssituasjonTilTekst[EArbeidssituasjon.etablererEgenVirksomhet]}
                        </SmallTextLabel>
                        <BodyShortSmall className={'førsteDataKolonne'}>
                            Beskrivelse av virksomheten
                        </BodyShortSmall>
                        <BodyShortSmall>{virksomhet?.virksomhetsbeskrivelse}</BodyShortSmall>
                    </GridTabell>
                )}

                {skalViseSøknadsdata && arbeidssøker && (
                    <GridTabell kolonner={3}>
                        <Arbeidssøker arbeidssøker={arbeidssøker} />{' '}
                    </GridTabell>
                )}

                {skalViseSøknadsdata && underUtdanning && (
                    <GridTabell kolonner={3}>
                        <UnderUtdanning underUtdanning={underUtdanning} />
                        {underUtdanning.utdanningEtterGrunnskolen && (
                            <TidligereUtdanninger tidligereUtdanninger={tidligereUtdanninger} />
                        )}
                    </GridTabell>
                )}

                {skalViseSøknadsdata &&
                    arbeidssituasjon.includes(
                        EArbeidssituasjon.erHverkenIArbeidUtdanningEllerArbeidssøker
                    ) && (
                        <GridTabell kolonner={3}>
                            <Søknadsgrunnlag />
                            <SmallTextLabel className={'undertittel'}>
                                {
                                    ArbeidssituasjonTilTekst[
                                        EArbeidssituasjon.erHverkenIArbeidUtdanningEllerArbeidssøker
                                    ]
                                }
                            </SmallTextLabel>
                        </GridTabell>
                    )}
                {skalViseSøknadsdata && særligeTilsynsbehov && (
                    <SeksjonWrapper>
                        <Annet dinSituasjon={gjelderDeg} særligTilsynsbehov={særligeTilsynsbehov} />
                    </SeksjonWrapper>
                )}
                {skalViseSøknadsdata && (
                    <>
                        <DokumentasjonSendtInn
                            dokumentasjon={dokumentasjon?.arbeidskontrakt}
                            tittel={'Arbeidskontrakt som viser at du har fått tilbud om arbeid'}
                        />
                        <DokumentasjonSendtInn
                            dokumentasjon={dokumentasjon?.barnsSykdom}
                            tittel={'Dokumentasjon på barnets sykdom'}
                        />
                        <DokumentasjonSendtInn
                            dokumentasjon={dokumentasjon?.barnMedSærligeBehov}
                            tittel={'Dokumentasjon på barnets tilsynsbehov'}
                        />
                        <DokumentasjonSendtInn
                            dokumentasjon={dokumentasjon?.ikkeVilligTilÅTaImotTilbudOmArbeid}
                            tittel={
                                'Dokumentasjon som beskriver grunnen til at du ikke kan ta ethvert arbeid'
                            }
                        />
                        <DokumentasjonSendtInn
                            dokumentasjon={dokumentasjon?.sykdom}
                            tittel={'Dokumentasjon som viser at du er syk'}
                        />
                        <DokumentasjonSendtInn
                            dokumentasjon={dokumentasjon?.manglendeBarnepass}
                            tittel={'Dokumentasjon som viser at du mangler barnepass'}
                        />
                        <DokumentasjonSendtInn
                            dokumentasjon={dokumentasjon?.lærlingkontrakt}
                            tittel={'Lærlingkontrakt'}
                        />
                        <DokumentasjonSendtInn
                            dokumentasjon={dokumentasjon?.virksomhet}
                            tittel={'Næringsfaglig vurdering av virksomheten du etablerer'}
                        />
                    </>
                )}
            </SeksjonWrapper>
        </>
    );
};

export default AktivitetInfo;
