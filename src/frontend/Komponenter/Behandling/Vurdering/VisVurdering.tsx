import * as React from 'react';
import { FC } from 'react';
import { Element, Feilmelding, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import RedigerBlyant from '../../../Felles/Ikoner/RedigerBlyant';
import { IVurdering, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import SlettSøppelkasse from '../../../Felles/Ikoner/SlettSøppelkasse';
import { Redigeringsmodus } from './VisEllerEndreVurdering';
import { delvilkårTypeTilTekst, svarTypeTilTekst } from './tekster';
import LenkeKnapp from '../../../Felles/Knapper/LenkeKnapp';
import { BrukerMedBlyantIkon } from '../../../Felles/Ikoner/DataGrunnlagIkoner';
import { resultatTilTekst } from '../Vilkårresultat/ResultatVisning';
import { BreakWordNormaltekst } from '../../../Felles/Visningskomponenter/BreakWordNormaltekst';

const StyledVurdering = styled.div`
    display: grid;
    grid-template-columns: repeat(3, max-content);
    grid-template-rows: repeat(2, max-content);
    grid-gap: 0.25rem 1rem;
`;
const StyledRedigerOgSlettKnapp = styled.div`
    min-width: auto;
`;

const StyledStrek = styled.span`
    border-left: 3px solid ${navFarger.navLillaLighten20};
    margin-left: 0.55rem;
    grid-column: 1/2;
    min-height: 10rem;
`;

const StyledVilkår = styled.div`
    grid-column: 2/4;
    max-width: 40rem;
    .typo-normal {
        margin-top: 0.25rem;
        margin-bottom: 1.5rem;
    }
`;

const StyledFeilmelding = styled.div`
    grid-column: 2/4;
    max-width: 30rem;
`;

const StyledIkonOgTittel = styled.span`
    margin-bottom: 1.5rem;
    display: flex;
    svg {
        margin-right: 1rem;
    }
`;

interface Props {
    vurdering: IVurdering;
    resetVurdering: () => void;
    feilmelding: string | undefined;
    settRedigeringsmodus: (redigeringsmodus: Redigeringsmodus) => void;
    behandlingErRedigerbar: boolean;
}

const VisVurdering: FC<Props> = ({
    settRedigeringsmodus,
    vurdering,
    resetVurdering,
    feilmelding,
    behandlingErRedigerbar,
}) => {
    const vilkårsresultat = vurdering.resultat;
    const vurderingerBesvaradeAvSaksbehandler = vurdering.delvilkårsvurderinger.filter(
        (delvilkårsvurdering) =>
            delvilkårsvurdering.resultat === Vilkårsresultat.OPPFYLT ||
            delvilkårsvurdering.resultat === Vilkårsresultat.IKKE_OPPFYLT
    );
    return (
        <StyledVurdering key={vurdering.id}>
            <BrukerMedBlyantIkon />
            <StyledIkonOgTittel>
                <Undertittel>{`Vilkår ${resultatTilTekst[vurdering.resultat]}`}</Undertittel>
            </StyledIkonOgTittel>
            {behandlingErRedigerbar && (
                <>
                    <StyledRedigerOgSlettKnapp>
                        <LenkeKnapp
                            hidden={vilkårsresultat === Vilkårsresultat.SKAL_IKKE_VURDERES}
                            onClick={() => settRedigeringsmodus(Redigeringsmodus.REDIGERING)}
                        >
                            <RedigerBlyant width={19} heigth={19} withDefaultStroke={false} />
                            <span>Rediger</span>
                        </LenkeKnapp>
                        <LenkeKnapp onClick={resetVurdering}>
                            <SlettSøppelkasse width={19} heigth={19} withDefaultStroke={false} />
                            <span>Slett</span>
                        </LenkeKnapp>
                    </StyledRedigerOgSlettKnapp>
                    {feilmelding && (
                        <StyledFeilmelding>
                            <Feilmelding>Oppdatering av vilkår feilet: {feilmelding}</Feilmelding>{' '}
                        </StyledFeilmelding>
                    )}
                </>
            )}

            <StyledStrek />

            <StyledVilkår>
                {vurderingerBesvaradeAvSaksbehandler.map((delvilkårsvurdering) =>
                    delvilkårsvurdering.vurderinger.map((vurdering) => (
                        <React.Fragment key={vurdering.regelId}>
                            <div>
                                <Element>{delvilkårTypeTilTekst[vurdering.regelId]}</Element>
                                <Normaltekst>
                                    {vurdering.svar && svarTypeTilTekst[vurdering.svar]}
                                </Normaltekst>
                            </div>

                            {vurdering.begrunnelse && (
                                <>
                                    <Element>Begrunnelse</Element>
                                    <BreakWordNormaltekst>
                                        {vurdering.begrunnelse}
                                    </BreakWordNormaltekst>
                                </>
                            )}
                        </React.Fragment>
                    ))
                )}
            </StyledVilkår>
        </StyledVurdering>
    );
};

export default VisVurdering;
