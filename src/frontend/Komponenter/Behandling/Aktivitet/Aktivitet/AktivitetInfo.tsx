import React, { FC } from 'react';
import { IAktivitet } from '../../../../App/typer/aktivitetstyper';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon } from './typer';
import SelvstendigNæringsdrivendeEllerFrilanser from './SelvstendigNæringsdrivendeEllerFrilanser';
import Arbeidssøker from './Arbeidssøker';
import { UnderUtdanning } from './Utdanning';
import Annet from './Annet';
import Aksjeselskap from './Aksjeselskap';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { ArbeidstakerLønnsmottakerSomFrilanser } from './ArbeidstakerLønnsmottakerSomFrilanser';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import DokumentasjonSendtInn from '../../Inngangsvilkår/DokumentasjonSendtInn';
import { IDokumentasjonGrunnlag } from '../../Inngangsvilkår/vilkår';
import { InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { InfoSeksjonWrapper, VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    aktivitet: IAktivitet;
    stønadstype: Stønadstype;
    dokumentasjon?: IDokumentasjonGrunnlag;
}

const AktivitetInfo: FC<Props> = ({ aktivitet, stønadstype, dokumentasjon }) => {
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
        <InformasjonContainer>
            {arbeidssituasjon.includes(EArbeidssituasjon.erHjemmeMedBarnUnderEttÅr) && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label={ArbeidssituasjonTilTekst[EArbeidssituasjon.erHjemmeMedBarnUnderEttÅr]}
                />
            )}

            {arbeidsforhold &&
                arbeidsforhold.map((arbeidsgiver, index) => (
                    <ArbeidstakerLønnsmottakerSomFrilanser
                        key={arbeidsgiver.arbeidsgivernavn + index}
                        arbeidsforhold={arbeidsgiver}
                        stønadstype={stønadstype}
                    />
                ))}

            {selvstendig &&
                selvstendig.map((firma, index) => (
                    <SelvstendigNæringsdrivendeEllerFrilanser
                        key={firma.organisasjonsnummer + index}
                        firma={firma}
                        stønadstype={stønadstype}
                    />
                ))}

            {aksjeselskap &&
                aksjeselskap.map((selskap, index) => (
                    <Aksjeselskap
                        key={selskap.navn + index}
                        aksjeselskap={selskap}
                        stønadstype={stønadstype}
                    />
                ))}

            {datoOppstartJobb && (
                <InfoSeksjonWrapper
                    undertittel={ArbeidssituasjonTilTekst[EArbeidssituasjon.harFåttJobbTilbud]}
                    ikon={<Søknadsgrunnlag />}
                >
                    <Informasjonsrad
                        label="Startdato ny jobb"
                        verdi={formaterNullableIsoDato(datoOppstartJobb)}
                    />
                </InfoSeksjonWrapper>
            )}

            {virksomhet && (
                <InfoSeksjonWrapper
                    undertittel={
                        ArbeidssituasjonTilTekst[EArbeidssituasjon.etablererEgenVirksomhet]
                    }
                    ikon={<Søknadsgrunnlag />}
                >
                    <Informasjonsrad
                        label="Beskrivelse av virksomheten"
                        verdi={virksomhet?.virksomhetsbeskrivelse}
                    />
                </InfoSeksjonWrapper>
            )}

            {arbeidssøker && <Arbeidssøker arbeidssøker={arbeidssøker} />}

            {underUtdanning && (
                <UnderUtdanning
                    underUtdanning={underUtdanning}
                    tidligereUtdanninger={tidligereUtdanninger}
                />
            )}

            {arbeidssituasjon.includes(
                EArbeidssituasjon.erHverkenIArbeidUtdanningEllerArbeidssøker
            ) && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label={
                        ArbeidssituasjonTilTekst[
                            EArbeidssituasjon.erHverkenIArbeidUtdanningEllerArbeidssøker
                        ]
                    }
                />
            )}
            {særligeTilsynsbehov && (
                <Annet dinSituasjon={gjelderDeg} særligTilsynsbehov={særligeTilsynsbehov} />
            )}

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
                tittel={'Dokumentasjon som beskriver grunnen til at du ikke kan ta ethvert arbeid'}
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
            <DokumentasjonSendtInn
                dokumentasjon={dokumentasjon?.utdanningstilbud}
                tittel={'Dokumentasjon på utdanning'}
            />
        </InformasjonContainer>
    );
};

export default AktivitetInfo;
