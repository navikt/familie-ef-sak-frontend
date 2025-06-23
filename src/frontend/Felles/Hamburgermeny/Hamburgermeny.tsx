import React, { FC, useEffect, useRef, useState } from 'react';
import { MenuHamburgerIcon, MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import styled from 'styled-components';
import { Button } from '@navikt/ds-react';

interface HamburgerMenyInnholdProps {
    $åpen: boolean;
    $plassering: 'bottom-center' | 'right';
}

const HamburgerMenyIkon = styled(MenuHamburgerIcon)`
    margin: 1rem 1rem 0 1rem;

    &:hover {
        cursor: pointer;
    }
`;

const HamburgerMenyEllipsisVIkon = styled(MenuElipsisVerticalIcon)`
    margin: 0.5rem 0.5rem 0 0.5rem;

    &:hover {
        cursor: pointer;
    }
`;

const HamburgerWrapper = styled.div`
    position: relative;
`;

const HamburgerMenyInnhold = styled.div<HamburgerMenyInnholdProps>`
    display: ${(props) => (props.$åpen ? 'block' : 'none')};

    position: absolute;

    background-color: white;

    ${(props) =>
        props.$plassering === 'bottom-center' ? 'right: 1rem;' : 'left: 3rem; bottom: 0.25rem;'}

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
`;

export interface MenyItem {
    tekst: string;
    onClick: () => void;
}

export interface Props {
    className?: string;
    items: MenyItem[];
    plasseringItems?: 'bottom-center' | 'right';
    type?: 'hamburger' | 'ellipsisV';
}

export const Hamburgermeny: FC<Props> = ({
    className,
    items,
    type = 'hamburger',
    plasseringItems = 'bottom-center',
}) => {
    const ref = useRef(null);
    const [åpenHamburgerMeny, settÅpenHamburgerMeny] = useState<boolean>(false);

    useEffect(() => {
        const håndterKlikkUtenforKomponent = (event: { target: never }) => {
            // @ts-expect-error ref mangler type
            if (åpenHamburgerMeny && ref.current && !ref.current.contains(event.target)) {
                settÅpenHamburgerMeny(false);
            }
        };

        // @ts-expect-error Mangler type
        document.addEventListener('click', håndterKlikkUtenforKomponent, true);

        return () => {
            // @ts-expect-error Mangler type
            document.removeEventListener('click', håndterKlikkUtenforKomponent, true);
        };
    }, [åpenHamburgerMeny]);

    return (
        <HamburgerWrapper className={className} ref={ref}>
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
            <HamburgerMenyInnhold $åpen={åpenHamburgerMeny} $plassering={plasseringItems}>
                <ul>
                    {items.map((p) => (
                        <li key={p.tekst}>
                            <Button
                                variant="tertiary"
                                size="xsmall"
                                onClick={() => {
                                    settÅpenHamburgerMeny(false);
                                    p.onClick();
                                }}
                            >
                                {p.tekst}
                            </Button>
                        </li>
                    ))}
                </ul>
            </HamburgerMenyInnhold>
        </HamburgerWrapper>
    );
};
