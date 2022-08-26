import React, { FC } from 'react';
import { IAktivitet } from '../../../../App/typer/aktivitetstyper';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { SeksjonWrapper } from '../../../../Felles/Visningskomponenter/SeksjonWrapper';
import { ArbeidstakerLønnsmottakerSomFrilanser } from '../Aktivitet/ArbeidstakerLønnsmottakerSomFrilanser';
import SelvstendigNæringsdrivendeEllerFrilanser from '../Aktivitet/SelvstendigNæringsdrivendeEllerFrilanser';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import Aksjeselskap from '../Aktivitet/Aksjeselskap';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon, EErIArbeid } from '../Aktivitet/typer';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { IDokumentasjonGrunnlag } from '../../Inngangsvilkår/vilkår';
import DokumentasjonSendtInn from '../../Inngangsvilkår/DokumentasjonSendtInn';

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
        <>
            <SeksjonWrapper>
                {skalViseSøknadsdata && erIArbeid === EErIArbeid.NeiFordiJegErSyk && (
                    <GridTabell kolonner={3}>
                        <Søknadsgrunnlag />
                        <Element className={'undertittel'}>
                            Er ikke i arbeid fordi søker er syk
                        </Element>
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

                {skalViseSøknadsdata && virksomhet && (
                    <GridTabell kolonner={3}>
                        <Søknadsgrunnlag />
                        <Element className={'undertittel'}>
                            {ArbeidssituasjonTilTekst[EArbeidssituasjon.etablererEgenVirksomhet]}
                        </Element>
                        <Normaltekst className={'førsteDataKolonne'}>
                            Beskrivelse av virksomheten
                        </Normaltekst>
                        <Normaltekst>{virksomhet?.virksomhetsbeskrivelse}</Normaltekst>
                    </GridTabell>
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
            </SeksjonWrapper>
        </>
    );
};

export default AktivitetArbeidInfo;
