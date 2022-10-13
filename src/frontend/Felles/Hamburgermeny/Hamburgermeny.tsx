import React, { FC, useEffect, useRef, useState } from 'react';
import { Hamburger, EllipsisV } from '@navikt/ds-icons';
import styled from 'styled-components';
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

const HamburgerMenyEllipsisVIkon = styled(EllipsisV)`
    margin: 0.5rem 0.5rem 0 0.5rem;

    &:hover {
        cursor: pointer;
    }
`;

const HamburgerWrapper = styled.div`
    position: relative;
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

    white-space: nowrap;

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

export interface MenyItem {
    tekst: string;
    onClick: () => void;
}

export interface Props {
    type?: 'hamburger' | 'ellipsisV';
    items: MenyItem[];
}

export const Hamburgermeny: FC<Props> = ({ type = 'hamburger', items }) => {
    const ref = useRef(null);
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
        <HamburgerWrapper ref={ref}>
            {type === 'hamburger' ? (
                <HamburgerMenyIkon
                    onClick={() => {
                        settÅpenHamburgerMeny(!åpenHamburgerMeny);
                    }}
                />
            ) : (
                <HamburgerMenyEllipsisVIkon
                    width={'1.75em'}
                    height={'1.75em'}
                    onClick={() => {
                        settÅpenHamburgerMeny(!åpenHamburgerMeny);
                    }}
                />
            )}
            <HamburgerMenyInnhold åpen={åpenHamburgerMeny}>
                <ul>
                    {items.map((p) => (
                        <li key={p.tekst}>
                            <Knapp onClick={p.onClick}>
                                <Normaltekst>{p.tekst}</Normaltekst>
                            </Knapp>
                        </li>
                    ))}
                </ul>
            </HamburgerMenyInnhold>
        </HamburgerWrapper>
    );
};
