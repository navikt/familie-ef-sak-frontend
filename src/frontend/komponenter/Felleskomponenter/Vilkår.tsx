import React from 'react';
import { Vilkårsresultat } from '../Behandling/Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { VilkårsresultatIkon } from './Visning/VilkårOppfylt';
import { EtikettLiten, Undertittel } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';

interface Props {
    tittel: string;
    paragrafTittel: string;
    vilkårsresultat: Vilkårsresultat;
    children: {
        left: JSX.Element;
        right: JSX.Element;
    };
}

const Container = styled.div`
    display: flex;
    width: 100%;
    margin: 2rem;

    .leftContainer {
        width: 50%;
        background-color: blue;
    }
    .rightContainer {
        width: 50%;
        background-color: pink;
    }

    .tittel {
        padding-bottom: 1rem;
        display: flex;
        align-items: center;

        .typo-undertittel {
            margin-right: 1rem;
        }
        .typo-etikett-liten {
            color: ${navFarger.navGra60};
        }
    }
`;

const Vilkår: React.FC<Props> = ({
    tittel,
    vilkårsresultat,
    paragrafTittel,
    children: { left, right },
}) => {
    return (
        <Container>
            <div className="leftContainer">
                <div className="tittel">
                    <VilkårsresultatIkon
                        className="vilkårStatusIkon"
                        vilkårsresultat={vilkårsresultat}
                    />
                    <Undertittel>{tittel}</Undertittel>
                    <EtikettLiten>{paragrafTittel}</EtikettLiten>
                </div>
                {left}
            </div>
            <div className="rightContainer">{right}</div>
        </Container>
    );
};

export default Vilkår;
