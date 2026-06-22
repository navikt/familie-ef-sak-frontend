import React, { FC } from 'react';
import { IAktivitet } from '../../../../App/typer/aktivitetstyper';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { DinSituasjonTilTekst, InntekterTilTekst, Inntekter } from './typer';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import { InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { InfoSeksjonWrapper } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { FlexColumnContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import SelvstendigNæringsdrivendeEllerFrilanser from './SelvstendigNæringsdrivendeEllerFrilanser';
import { BodyLong, HelpText, HStack, List } from '@navikt/ds-react';

interface Props {
    aktivitet: IAktivitet;
    stønadstype: Stønadstype;
}

const hentInntektVerdier = (inntekter: Inntekter[]): string[] =>
    inntekter.map((nøkkel) => InntekterTilTekst[nøkkel] ?? nøkkel);

const AktivitetInfoRegelendring2026: FC<Props> = ({ aktivitet, stønadstype }) => {
    const { gjelderDeg, særligeTilsynsbehov, selvstendig } = aktivitet;

    const harTilsynsbehov = særligeTilsynsbehov && særligeTilsynsbehov.length > 0;
    const inntektVerdier = aktivitet.inntekter ? hentInntektVerdier(aktivitet.inntekter) : [];

    return (
        <InformasjonContainer>
            <InfoSeksjonWrapper
                ikon={<Søknadsgrunnlag />}
                undertittel={
                    <HStack gap="space-16" className="førsteDataKolonne">
                        Hva er situasjonen din?
                        <HelpText placement="top-start">
                            {HjelpetekstAlternativerHvaErSituasjonen}
                        </HelpText>
                    </HStack>
                }
            >
                <Informasjonsrad
                    label="Valgte svar"
                    verdiSomString={false}
                    verdi={
                        <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                            {gjelderDeg.map((svar) => (
                                <li key={svar}>
                                    <BodyShortSmall>{DinSituasjonTilTekst[svar]}</BodyShortSmall>
                                </li>
                            ))}
                        </ul>
                    }
                />
            </InfoSeksjonWrapper>

            {harTilsynsbehov && (
                <InfoSeksjonWrapper ikon={<Søknadsgrunnlag />} undertittel="Om tilsynsbehovet">
                    <FlexColumnContainer $gap={1}>
                        {særligeTilsynsbehov.map((barnetsBehov) => (
                            <Informasjonsrad
                                key={barnetsBehov.id}
                                label={
                                    barnetsBehov.navn
                                        ? `${barnetsBehov.navn}`
                                        : `Barn ${
                                              barnetsBehov.erBarnetFødt ? 'født ' : 'termindato '
                                          }${formaterNullableIsoDato(barnetsBehov.fødselTermindato)}`
                                }
                                verdi={barnetsBehov.særligeTilsynsbehov}
                            />
                        ))}
                    </FlexColumnContainer>
                </InfoSeksjonWrapper>
            )}

            {inntektVerdier.length > 0 && (
                <InfoSeksjonWrapper ikon={<Søknadsgrunnlag />} undertittel="Har du inntekt?">
                    <Informasjonsrad
                        label="Valgte svar"
                        verdiSomString={false}
                        verdi={
                            <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                                {inntektVerdier.map((tekst) => (
                                    <li key={tekst}>
                                        <BodyShortSmall>{tekst}</BodyShortSmall>
                                    </li>
                                ))}
                            </ul>
                        }
                    />
                </InfoSeksjonWrapper>
            )}

            {selvstendig &&
                selvstendig.map((firma, indeks) => (
                    <SelvstendigNæringsdrivendeEllerFrilanser
                        key={firma.organisasjonsnummer + indeks}
                        firma={firma}
                        stønadstype={stønadstype}
                    />
                ))}
        </InformasjonContainer>
    );
};

export default AktivitetInfoRegelendring2026;

const HjelpetekstAlternativerHvaErSituasjonen = (
    <>
        <BodyLong weight="semibold">Mulig alternativer i søknadsdialog:</BodyLong>
        <List size="small">
            <List.Item>Jeg har barn under 14 måneder</List.Item>
            <List.Item>
                Jeg har barn som trenger særlig tilsyn på grunn av fysiske, psykiske eller store
                sosiale problemer
            </List.Item>
            <List.Item>Barnet mitt har en sykdom som ikke er varig</List.Item>
            <List.Item>Ingen av disse gjelder meg</List.Item>
        </List>
    </>
);
