import React from 'react';

import KnappBase, { KnappBaseProps } from 'nav-frontend-knapper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Normaltekst } from 'nav-frontend-typografi';
import styled from 'styled-components';

interface IProps {
    erLesevisning: boolean;
    ikon: React.ReactChild;
    knappPosisjon?: 'venstre' | 'høyre';
    label: string;
    mini?: boolean;
    onClick: () => void;
    spinner?: boolean;
}

const StyledKnappBase = styled(KnappBase)`
    &.knapp {
        height: 25px;
        text-decoration: underline;
        letter-spacing: 0;

        &:focus {
            outline: solid 2px @navBla;
        }

        &:hover {
            background-color: @navLysGra !important;
            text-decoration: unset;
        }
    }

    :first-child {
        margin-right: 0.5rem;
    }
`;

const IkonKnapp: React.FC<IProps & KnappBaseProps> = ({
    erLesevisning,
    ikon,
    knappPosisjon = 'høyre',
    label,
    mini,
    onClick,
    spinner,
    ...props
}) => {
    return !erLesevisning ? (
        <StyledKnappBase
            onClick={onClick}
            type={props.type ?? 'flat'}
            mini={mini}
            kompakt={true}
            {...props}
        >
            {knappPosisjon === 'venstre' && <IkonTilKnapp ikon={ikon} spinner={spinner} />}
            <Normaltekst>{label}</Normaltekst>
            {knappPosisjon === 'høyre' ? <IkonTilKnapp ikon={ikon} spinner={spinner} /> : null}
        </StyledKnappBase>
    ) : null;
};

const IkonTilKnapp: React.FC<{ ikon: React.ReactChild; spinner?: boolean }> = ({
    ikon,
    spinner,
}) => {
    return <>{spinner ? <NavFrontendSpinner /> : ikon}</>;
};

export default IkonKnapp;
