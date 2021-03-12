import React, { FC } from 'react';
import { ISærligeTilsynsbehov } from '../../../../typer/overgangsstønad';
import { StyledTabell, StyledTabellWrapper } from '../../../Felleskomponenter/Visning/StyledTabell';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { PopoverOrientering } from 'nav-frontend-popover';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import styled from 'styled-components';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { DinSituasjonTilTekst, EDinSituasjon } from './typer';
import { v4 as uuidv4 } from 'uuid';

const StyledList = styled.ul`
    list-style-type: square;
    margin: 0;
`;

const StyledSøknadsgrunnlag = styled(Søknadsgrunnlag)`
    align-self: auto;
`;

interface Props {
    dinSituasjon: EDinSituasjon[];
    særligTilsynsbehov: ISærligeTilsynsbehov[];
}

const Annet: FC<Props> = ({ dinSituasjon, særligTilsynsbehov }) => {
    const hjelpetekst =
        'Jeg er syk / Barnet mitt er sykt / Jeg har søkt om barnepass, men ikke fått plass enda / Jeg har barn som trenger særlig tilsyn på grunn av fysiske, psykiske eller store sosiale problemer / Nei ';

    return (
        <>
            <StyledTabell kolonner={3}>
                <Element className={'førsteDataKolonne'}>Annet</Element>
                <Hjelpetekst type={PopoverOrientering.Under}>{hjelpetekst}</Hjelpetekst>

                <StyledSøknadsgrunnlag />
                <Normaltekst className={'førsteDataKolonne'}>Mer om søkers situasjon</Normaltekst>
                <StyledList>
                    {dinSituasjon.map((svarsalternativ) => (
                        <li key={svarsalternativ}>
                            <Normaltekst>{DinSituasjonTilTekst[svarsalternativ]}</Normaltekst>
                        </li>
                    ))}
                </StyledList>
                {særligTilsynsbehov.map((barnetsBehov) => (
                    <StyledTabellWrapper key={uuidv4()}>
                        <Søknadsgrunnlag />
                        <Normaltekst className={'førsteDataKolonne'}>
                            Om tilsynsbehov for barn:
                            {barnetsBehov.navn ||
                                `Barn ${barnetsBehov.erBarnetFødt ? 'født' : 'ufødt'} ${
                                    barnetsBehov.fødselTermindato
                                }`}
                        </Normaltekst>
                        <Normaltekst>{barnetsBehov.særligeTilsynsbehov}</Normaltekst>
                    </StyledTabellWrapper>
                ))}
            </StyledTabell>
        </>
    );
};

export default Annet;
