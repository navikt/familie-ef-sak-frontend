import * as React from 'react';
import { FC } from 'react';
import { BrukerMedBlyantIkon } from '../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import RedigerBlyant from '../../../ikoner/RedigerBlyant';
import {
    delvilkårTypeTilTekst,
    IVurdering,
    Redigeringsmodus,
    unntakTypeTilTekst,
    Vilkårsresultat,
    vilkårsresultatTypeTilTekst,
    vilkårTypeTilTekst,
} from '../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import IkkeOppfylt from '../../../ikoner/IkkeOppfylt';
import Oppfylt from '../../../ikoner/Oppfylt';
import navFarger from 'nav-frontend-core';
import SlettSøppelkasse from '../../../ikoner/SlettSøppelkasse';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import { nullstillVurdering } from './VurderingUtil';

const StyledVurdering = styled.div`
    display: grid;
    grid-template-columns: repeat(3, max-content);
    grid-template-rows: repeat(2, max-content);
    grid-gap: 1rem;
`;
const StyledRedigerOgSlettKnapp = styled.div`
    min-width: auto;
`;
const StyledKnapp = styled.button`
    min-width: 85px;
`;

const StyledStrek = styled.span`
    border-left: 3px solid ${navFarger.navLillaLighten20};
    margin-left: 0.55rem;
    grid-column: 1/2;
`;

const StyledVilkår = styled.div`
    grid-column: 2/4;

    .typo-normal {
        margin-top: 0.25rem;
        margin-bottom: 1.5rem;
    }
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
    resetVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
    settRedigeringsmodus: (redigeringsmodus: Redigeringsmodus) => void;
}

const VisVurdering: FC<Props> = ({ settRedigeringsmodus, vurdering, resetVurdering }) => {
    return (
        <StyledVurdering key={vurdering.id}>
            <BrukerMedBlyantIkon />
            <Undertittel>Manuelt behandlet</Undertittel>
            <StyledRedigerOgSlettKnapp>
                <StyledKnapp
                    className={'lenke'}
                    onClick={() => settRedigeringsmodus(Redigeringsmodus.REDIGERING)}
                >
                    <RedigerBlyant width={19} heigth={19} withDefaultStroke={false} />
                    <span>Rediger</span>
                </StyledKnapp>
                <StyledKnapp
                    className={'lenke'}
                    onClick={() =>
                        resetVurdering(nullstillVurdering(vurdering)).then((response) => {
                            if (response.status === RessursStatus.SUKSESS) {
                                settRedigeringsmodus(Redigeringsmodus.IKKE_PÅSTARTET);
                            }
                        })
                    }
                >
                    <SlettSøppelkasse width={19} heigth={19} withDefaultStroke={false} />
                    <span>Slett</span>
                </StyledKnapp>
            </StyledRedigerOgSlettKnapp>

            <StyledStrek />

            <StyledVilkår>
                <StyledIkonOgTittel>
                    {vurdering.resultat === Vilkårsresultat.JA ? (
                        <Oppfylt heigth={21} width={21} />
                    ) : (
                        <IkkeOppfylt heigth={21} width={21} />
                    )}
                    <Element>{vilkårTypeTilTekst[vurdering.vilkårType]}</Element>
                </StyledIkonOgTittel>

                {vurdering.delvilkårsvurderinger
                    .filter(
                        (delvilkårsvurdering) =>
                            delvilkårsvurdering.resultat !== Vilkårsresultat.IKKE_VURDERT &&
                            delvilkårsvurdering.resultat !== Vilkårsresultat.IKKE_AKTUELL
                    )
                    .map((delvilkårsvurdering) => (
                        <div key={delvilkårsvurdering.type}>
                            <Element>{delvilkårTypeTilTekst[delvilkårsvurdering.type]}</Element>
                            <Normaltekst>
                                {vilkårsresultatTypeTilTekst[delvilkårsvurdering.resultat]}
                            </Normaltekst>
                        </div>
                    ))}

                {vurdering.unntak && (
                    <>
                        <Element>Unntak</Element>
                        <Normaltekst>{unntakTypeTilTekst[vurdering.unntak]}</Normaltekst>
                    </>
                )}
                <Element>Begrunnelse</Element>
                {vurdering.begrunnelse && <Normaltekst>{vurdering.begrunnelse}</Normaltekst>}
            </StyledVilkår>
        </StyledVurdering>
    );
};

export default VisVurdering;
