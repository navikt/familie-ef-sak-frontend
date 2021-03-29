import React from 'react';
import { Vilkårsresultat } from '../Behandling/Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { VilkårsresultatIkon } from './Visning/VilkårOppfylt';
import { EtikettLiten, Undertittel } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';

type VilkårtittelProps = {
    tittel: string;
    paragrafTittel: string;
    vilkårsresultat: Vilkårsresultat;
};

interface Props {
    vilkårtittel?: VilkårtittelProps;
    children: {
        left: JSX.Element;
        right: JSX.Element;
    };
}

const Container = styled.div`
    display: flex;
    margin: 2rem;
    border-bottom: 3px solid #e9e7e7;

    .leftContainer {
        padding: 1.5rem 0;
        width: 50%;
    }
    .rightContainer {
        padding: 1.5rem 0;
        width: 50%;
    }

    .tittel {
        padding-bottom: 1rem;
        display: flex;
        align-items: center;

        .typo-undertittel {
            margin: 0 1rem 0 0.5rem;
        }
        .typo-etikett-liten {
            color: ${navFarger.navGra60};
        }
    }
`;

const Vilkår: React.FC<Props> = ({ vilkårtittel, children: { left, right } }) => {
    const Vilkårtittel = () => {
        return vilkårtittel ? (
            <div className="tittel">
                <VilkårsresultatIkon vilkårsresultat={vilkårtittel.vilkårsresultat} />
                <Undertittel>{vilkårtittel.tittel}</Undertittel>
                <EtikettLiten>{vilkårtittel.paragrafTittel}</EtikettLiten>
            </div>
        ) : null;
    };

    return (
        <Container>
            <div className="leftContainer">
                <Vilkårtittel />
                {left}
            </div>
            <div className="rightContainer">{right}</div>
        </Container>
    );
};

export default Vilkår;
