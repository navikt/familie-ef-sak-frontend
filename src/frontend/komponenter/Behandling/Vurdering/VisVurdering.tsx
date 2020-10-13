import * as React from 'react';
import { FC } from 'react';
import { BrukerMedBlyantIkon } from '../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import RedigerBlyant from '../../../ikoner/RedigerBlyant';
import { IVurdering, unntakTypeTilTekst } from '../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { navLillaLighten20 } from '../../../utils/farger';
import { IVilkårConfig } from './VurderingConfig';
import IkkeOppfylt from '../../../ikoner/IkkeOppfylt';
import Oppfylt from '../../../ikoner/Oppfylt';

const StyledVurdering = styled.div`
    display: grid;
    grid-template-columns: repeat(4, max-content);
    grid-template-rows: repeat(3, max-content);
    grid-gap: 1rem;
`;

const StyledKnapp = styled.button``;

const StyledStrek = styled.span`
    border-left: 3px solid ${navLillaLighten20};
    margin-left: 0.55rem;
    grid-column: 1/2;
`;

const StyledVilkår = styled.div`
    grid-column: 2/4;

    .typo-normal {
        margin-top: 0.5rem;
        margin-bottom: 1rem;
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
    settRedigeringsmodus: (erRedigeringsmodus: boolean) => void;
    config: IVilkårConfig;
    vurdering: IVurdering;
}

const VisVurdering: FC<Props> = ({ settRedigeringsmodus, config, vurdering }) => {
    const erOppfylt = true;

    return (
        <StyledVurdering>
            <BrukerMedBlyantIkon />
            <Undertittel>Manuelt behandlet</Undertittel>
            <StyledKnapp className={'lenke'} onClick={() => settRedigeringsmodus(true)}>
                <RedigerBlyant width={19} heigth={19} withDefaultStroke={false} />
                <span>Rediger</span>
            </StyledKnapp>

            <StyledStrek />

            <StyledVilkår>
                <StyledIkonOgTittel>
                    {erOppfylt ? (
                        <Oppfylt heigth={21} width={21} />
                    ) : (
                        <IkkeOppfylt heigth={21} width={21} />
                    )}
                    <Element>Vilkårstittel</Element>
                </StyledIkonOgTittel>

                {vurdering.unntak && (
                    <>
                        <Element>Unntak</Element>
                        <Normaltekst>{unntakTypeTilTekst[vurdering.unntak]}</Normaltekst>
                    </>
                )}
                <Element>Begrunnelse</Element>
                <Normaltekst>{vurdering.begrunnelse}</Normaltekst>
            </StyledVilkår>
        </StyledVurdering>
    );
};

export default VisVurdering;
