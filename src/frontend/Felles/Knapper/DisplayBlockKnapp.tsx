import React from 'react';
import styled from 'styled-components';
import FjernKnapp from './FjernKnapp';
import LeggTilKnapp from './LeggTilKnapp';
import HovedKnapp from './HovedKnapp';

const Div = styled.div`
    display: block;
`;

interface Props {
    className?: string;
    disabled?: boolean;
    ikontekst?: string;
    knappetekst?: string;
    onClick?: () => void;
    variant: Variant;
}

export enum Variant {
    FJERN = 'FJERN',
    HOVED = 'HOVED',
    LEGG_TIL = 'LEGG_TIL',
}

const KnappSwitch: React.FC<Props> = (props) => {
    switch (props.variant) {
        case Variant.FJERN:
            return (
                <FjernKnapp
                    className={props.className}
                    ikontekst={props.ikontekst}
                    knappetekst={props.knappetekst}
                    onClick={props.onClick}
                />
            );
        case Variant.HOVED:
            return (
                <HovedKnapp
                    className={props.className}
                    disabled={props.disabled}
                    knappetekst={props.knappetekst}
                    onClick={props.onClick}
                />
            );
        case Variant.LEGG_TIL:
            return (
                <LeggTilKnapp
                    className={props.className}
                    ikontekst={props.ikontekst}
                    knappetekst={props.knappetekst}
                    onClick={props.onClick}
                />
            );
    }
};

const DisplayBlockKnapp: React.FC<Props> = (props) => (
    <Div>
        <KnappSwitch
            className={props.className}
            disabled={props.disabled}
            ikontekst={props.ikontekst}
            knappetekst={props.knappetekst}
            onClick={props.onClick}
            variant={props.variant}
        />
    </Div>
);

export default DisplayBlockKnapp;
