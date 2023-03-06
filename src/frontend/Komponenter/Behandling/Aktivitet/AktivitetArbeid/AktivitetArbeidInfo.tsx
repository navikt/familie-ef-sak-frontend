import React, { FC } from 'react';
import { IAktivitet } from '../../../../App/typer/aktivitetstyper';
import { ArbeidstakerLønnsmottakerSomFrilanser } from '../Aktivitet/ArbeidstakerLønnsmottakerSomFrilanser';
import SelvstendigNæringsdrivendeEllerFrilanser from '../Aktivitet/SelvstendigNæringsdrivendeEllerFrilanser';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import Aksjeselskap from '../Aktivitet/Aksjeselskap';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon, EErIArbeid } from '../Aktivitet/typer';
import { IDokumentasjonGrunnlag } from '../../Inngangsvilkår/vilkår';
import DokumentasjonSendtInn from '../../Inngangsvilkår/DokumentasjonSendtInn';
import { InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { InfoSeksjonWrapper, VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

interface Props {
    aktivitet: IAktivitet;
    skalViseSøknadsdata: boolean;
    stønadstype: Stønadstype;
    dokumentasjon?: IDokumentasjonGrunnlag;
}

const AktivitetArbeidInfo: FC<Props> = ({
    aktivitet,
    skalViseSøknadsdata,
    stønadstype,
    dokumentasjon,
}) => {
    const { arbeidsforhold, selvstendig, aksjeselskap, virksomhet, erIArbeid } = aktivitet;

    return (
        <InformasjonContainer>
            {skalViseSøknadsdata && erIArbeid === EErIArbeid.NeiFordiJegErSyk && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.SØKNAD}
                    label={'Er ikke i arbeid fordi søker er syk'}
                />
            )}

            {skalViseSøknadsdata &&
                arbeidsforhold &&
                arbeidsforhold.map((arbeidsgiver, index) => (
                    <ArbeidstakerLønnsmottakerSomFrilanser
                        key={arbeidsgiver.arbeidsgivernavn + index}
                        arbeidsforhold={arbeidsgiver}
                        stønadstype={stønadstype}
                    />
                ))}

            {skalViseSøknadsdata &&
                selvstendig &&
                selvstendig.map((firma, index) => (
                    <SelvstendigNæringsdrivendeEllerFrilanser
                        key={firma.organisasjonsnummer + index}
                        firma={firma}
                        stønadstype={stønadstype}
                    />
                ))}

            {skalViseSøknadsdata &&
                aksjeselskap &&
                aksjeselskap.map((selskap, index) => (
                    <Aksjeselskap
                        key={selskap.navn + index}
                        aksjeselskap={selskap}
                        stønadstype={stønadstype}
                    />
                ))}

            {skalViseSøknadsdata && virksomhet && (
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
            {skalViseSøknadsdata && (
                <>
                    <DokumentasjonSendtInn
                        dokumentasjon={dokumentasjon?.erIArbeid}
                        tittel={'Dokumentasjon som viser at du er for syk til å være i arbeid'}
                    />

                    <DokumentasjonSendtInn
                        dokumentasjon={dokumentasjon?.virksomhet}
                        tittel={'Næringsfaglig vurdering av virksomheten du etablerer'}
                    />
                </>
            )}
        </InformasjonContainer>
    );
};

export default AktivitetArbeidInfo;
