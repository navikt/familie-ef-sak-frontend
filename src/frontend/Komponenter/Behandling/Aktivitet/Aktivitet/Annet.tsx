import React, { FC } from 'react';
import { ISærligeTilsynsbehov } from '../../../../App/typer/aktivitetstyper';
import styled from 'styled-components';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { DinSituasjonTilTekst, EDinSituasjon } from './typer';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import { BodyLong, HelpText } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { InfoSeksjonWrapper } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { FlexColumnContainer } from '../../Vilkårpanel/StyledVilkårInnhold';

const StyledList = styled.ul`
    list-style-type: square;
    margin: 0;
    padding-left: 1rem;
`;

const hjelpetekst = (
    <ul>
        <BodyLong>
            Mulig alternativer i søknadsdialog:
            <li>Jeg er syk</li>
            <li>Barnet mitt er sykt </li>
            <li>Jeg har søkt om barnepass, men ikke fått plass enda</li>
            <li>
                Jeg har barn som trenger særlig tilsyn på grunn av fysiske, psykiske eller store
                sosiale problemer
            </li>
            <li>Nei</li>
        </BodyLong>
    </ul>
);

const TittelHjelpetekstWrapper = styled.div`
    display: flex;
    gap: 1rem;
`;

interface Props {
    dinSituasjon: EDinSituasjon[];
    særligTilsynsbehov: ISærligeTilsynsbehov[];
}

const Annet: FC<Props> = ({ dinSituasjon, særligTilsynsbehov }) => {
    return (
        <>
            <InfoSeksjonWrapper
                ikon={<Søknadsgrunnlag />}
                undertittel={
                    <TittelHjelpetekstWrapper className={'førsteDataKolonne'}>
                        Annet
                        <HelpText placement={'top-start'}>{hjelpetekst}</HelpText>
                    </TittelHjelpetekstWrapper>
                }
            >
                <Informasjonsrad
                    label="Mer om søkers situasjon"
                    verdiSomString={false}
                    verdi={
                        <StyledList>
                            {dinSituasjon.map((svarsalternativ) => (
                                <li key={svarsalternativ}>
                                    <BodyShortSmall>
                                        {DinSituasjonTilTekst[svarsalternativ]}
                                    </BodyShortSmall>
                                </li>
                            ))}
                        </StyledList>
                    }
                />
                <FlexColumnContainer $gap={1}>
                    <Informasjonsrad label="Om tilsynsbehov for: " />
                    {særligTilsynsbehov.map((barnetsBehov) => (
                        <Informasjonsrad
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
            </InfoSeksjonWrapper>
        </>
    );
};

export default Annet;
