import React from 'react';
import { Vilkårsresultat } from '../Behandling/Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { VilkårsresultatIkon } from './Visning/VilkårOppfylt';
import { EtikettLiten, Undertittel } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';

interface Props {
    tittel: string;
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
    }
    .rightContainer {
        width: 50%;
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

const Vilkår: React.FC<Props> = ({ tittel, vilkårsresultat, children: { left, right } }) => {
    return (
        <Container>
            <div className="leftContainer">
                <div className="tittel">
                    <VilkårsresultatIkon
                        className="vilkårStatusIkon"
                        vilkårsresultat={vilkårsresultat}
                    />
                    <Undertittel>{tittel}</Undertittel>
                    <EtikettLiten>§15-4</EtikettLiten>
                </div>
                {left}
            </div>
            <div className="rightContainer">{right}</div>
        </Container>
    );
};

export default Vilkår;
