import React, { FC } from 'react';
import { ISærligeTilsynsbehov } from '../../../../App/typer/aktivitetstyper';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { DinSituasjonTilTekst, EDinSituasjon } from './typer';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { BodyLong, HelpText, HStack, List } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { InfoSeksjonWrapper } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { FlexColumnContainer } from '../../Vilkårpanel/StyledVilkårInnhold';

const hjelpetekst = (
    <>
        <BodyLong weight="semibold">Mulig alternativer i søknadsdialog:</BodyLong>
        <List size="small">
            <List.Item>Jeg er syk</List.Item>
            <List.Item>Barnet mitt er sykt</List.Item>
            <List.Item>Jeg har søkt om barnepass, men ikke fått plass enda</List.Item>
            <List.Item>
                Jeg har barn som trenger særlig tilsyn på grunn av fysiske, psykiske eller store
                sosiale problemer
            </List.Item>
            <List.Item>Nei</List.Item>
        </List>
    </>
);

interface Props {
    dinSituasjon: EDinSituasjon[];
    særligTilsynsbehov: ISærligeTilsynsbehov[];
}

const Annet: FC<Props> = ({ dinSituasjon, særligTilsynsbehov }) => {
    const visOmTilsynbehovFor = særligTilsynsbehov.length !== 0;

    return (
        <>
            <InfoSeksjonWrapper
                ikon={<Søknadsgrunnlag />}
                undertittel={
                    <HStack gap="space-16" className="førsteDataKolonne">
                        Annet
                        <HelpText placement="top-start">{hjelpetekst}</HelpText>
                    </HStack>
                }
            >
                <Informasjonsrad
                    label="Mer om søkers situasjon"
                    verdiSomString={false}
                    verdi={
                        <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                            {dinSituasjon.map((svarsalternativ) => (
                                <li key={svarsalternativ}>
                                    <BodyShortSmall>
                                        {DinSituasjonTilTekst[svarsalternativ]}
                                    </BodyShortSmall>
                                </li>
                            ))}
                        </ul>
                    }
                />

                {visOmTilsynbehovFor && (
                    <FlexColumnContainer $gap={1}>
                        <Informasjonsrad label="Om tilsynsbehov for: " />
                        {særligTilsynsbehov.map((barnetsBehov) => (
                            <Informasjonsrad
                                key={barnetsBehov.id}
                                label={
                                    barnetsBehov.navn
                                        ? `${barnetsBehov.navn} `
                                        : `Barn ${
                                              barnetsBehov.erBarnetFødt ? 'født ' : 'termindato '
                                          } ${formaterNullableIsoDato(barnetsBehov.fødselTermindato)}`
                                }
                                verdi={barnetsBehov.særligeTilsynsbehov}
                            />
                        ))}
                    </FlexColumnContainer>
                )}
            </InfoSeksjonWrapper>
        </>
    );
};

export default Annet;
