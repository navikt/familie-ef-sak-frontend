import React, { FC } from 'react';
import { IAktivitet } from '../../../../App/typer/overgangsstønad';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { SeksjonWrapper } from '../../../../Felles/Visningskomponenter/SeksjonWrapper';
import { ArbeidstakerLønnsmottakerSomFrilanser } from '../Aktivitet/ArbeidstakerLønnsmottakerSomFrilanser';
import SelvstendigNæringsdrivendeEllerFrilanser from '../Aktivitet/SelvstendigNæringsdrivendeEllerFrilanser';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import Aksjeselskap from '../Aktivitet/Aksjeselskap';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { ArbeidssituasjonTilTekst, EArbeidssituasjon, EErIArbeid } from '../Aktivitet/typer';
import { Element, Normaltekst } from 'nav-frontend-typografi';

interface Props {
    aktivitet: IAktivitet;
    skalViseSøknadsdata: boolean;
    stønadstype: Stønadstype;
}

const AktivitetArbeidInfo: FC<Props> = ({ aktivitet, skalViseSøknadsdata, stønadstype }) => {
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
                        <Normaltekst> {virksomhet?.virksomhetsbeskrivelse}</Normaltekst>
                    </GridTabell>
                )}
            </SeksjonWrapper>
        </>
    );
};

export default AktivitetArbeidInfo;
