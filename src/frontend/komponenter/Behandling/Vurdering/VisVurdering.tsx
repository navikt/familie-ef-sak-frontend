import * as React from 'react';
import { FC } from 'react';
import { BrukerMedBlyantIkon } from '../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import RedigerBlyant from '../../../ikoner/RedigerBlyant';
import { IVurdering, unntakTypeTilTekst } from '../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { navLillaLighten20 } from '../../../utils/farger';
import { IVilkårConfig } from './VurderingConfig';

const StyledVurdering = styled.div`
    display: grid;
    grid-template-columns: repeat(4, max-content);
    grid-template-rows: repeat(2, max-content);
    grid-gap: 1rem;
`;

const StyledKnapp = styled.button``;

const StyledTekst = styled.div`
    grid-column: 2/4;

    p {
        margin-top: 5px;
    }
`;

const StyledStrek = styled.span`
    border-left: 3px solid ${navLillaLighten20};
    margin-left: 0.55rem;
    grid-column: 1/2;
`;

interface Props {
    settRedigeringsmodus: (erRedigeringsmodus: boolean) => void;
    config: IVilkårConfig;
    vurdering: IVurdering;
}

const VisVurdering: FC<Props> = ({ settRedigeringsmodus, config, vurdering }) => {
    return (
        <StyledVurdering>
            <BrukerMedBlyantIkon />
            <Undertittel>Manuelt behandlet</Undertittel>
            <StyledKnapp className={'lenke'} onClick={() => settRedigeringsmodus(true)}>
                <RedigerBlyant width={19} heigth={19} withDefaultStroke={false} />
                <span>Rediger</span>
            </StyledKnapp>

            <StyledStrek />
            <StyledTekst>
                <Normaltekst>{config.vilkår}</Normaltekst>
                {vurdering.unntak && (
                    <>
                        <Element>Unntak</Element>
                        <Normaltekst>{unntakTypeTilTekst[vurdering.unntak]}</Normaltekst>
                    </>
                )}
                <Element>Begrunnelse</Element>
                <Normaltekst>{vurdering.begrunnelse}</Normaltekst>
            </StyledTekst>
        </StyledVurdering>
    );
};

export default VisVurdering;
