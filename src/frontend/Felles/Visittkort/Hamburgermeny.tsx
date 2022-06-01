import React, { useEffect, useRef, useState } from 'react';
import { Hamburger } from '@navikt/ds-icons';
import styled from 'styled-components';
import { useBehandling } from '../../App/context/BehandlingContext';
import { Normaltekst } from 'nav-frontend-typografi';

interface HamburgerMenyInnholdProps {
    åpen: boolean;
}

const HamburgerMenyIkon = styled(Hamburger)`
    margin: 1rem 1rem 0 1rem;

    &:hover {
        cursor: pointer;
    }
`;

const HamburgerMenyInnhold = styled.div`
    display: ${(props: HamburgerMenyInnholdProps) => (props.åpen ? 'block' : 'none')};

    position: absolute;

    background-color: white;

    right: 1rem;

    border: 1px solid grey;

    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
    -webkit-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
    -moz-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);

    ul,
    li {
        margin: 0;
        padding: 0;
    }

    li {
        padding: 0.5rem;

        list-style-type: none;
    }

    li:hover {
        background-color: #0166c5;
        color: white;
        cursor: pointer;
    }
`;

const Knapp = styled.button`
    height: 100%;
    width: 100%;

    text-align: left;
`;

export const Hamburgermeny = () => {
    const ref = useRef(null);
    const { settVisBrevmottakereModal, settVisHenleggModal } = useBehandling();
    const [åpenHamburgerMeny, settÅpenHamburgerMeny] = useState<boolean>(false);

    useEffect(() => {
        const håndterKlikkUtenforKomponent = (event: { target: never }) => {
            // @ts-ignore
            if (åpenHamburgerMeny && ref.current && !ref.current.contains(event.target)) {
                settÅpenHamburgerMeny(false);
            }
        };

        // @ts-ignore
        document.addEventListener('click', håndterKlikkUtenforKomponent, true);

        return () => {
            // @ts-ignore
            document.removeEventListener('click', håndterKlikkUtenforKomponent, true);
        };
    }, [åpenHamburgerMeny]);

    return (
        <div ref={ref}>
            <HamburgerMenyIkon
                onClick={() => {
                    settÅpenHamburgerMeny(!åpenHamburgerMeny);
                }}
            />
            <HamburgerMenyInnhold åpen={åpenHamburgerMeny}>
                <ul>
                    <li>
                        <Knapp
                            onClick={() => {
                                settVisBrevmottakereModal(true);
                            }}
                        >
                            <Normaltekst>Sett Verge/Fullmakt mottakere</Normaltekst>
                        </Knapp>
                    </li>
                    <li>
                        <Knapp
                            onClick={() => {
                                settVisHenleggModal(true);
                            }}
                        >
                            <Normaltekst>Henlegg</Normaltekst>
                        </Knapp>
                    </li>
                </ul>
            </HamburgerMenyInnhold>
        </div>
    );
};
