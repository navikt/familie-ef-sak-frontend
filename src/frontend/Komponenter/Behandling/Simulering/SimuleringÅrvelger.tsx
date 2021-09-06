import React from 'react';
import { ISimuleringÅrsvelger } from './SimuleringTyper';
import { HoyreChevron, VenstreChevron } from 'nav-frontend-chevron';
import { Knapp } from 'nav-frontend-knapper';
import styled from 'styled-components';

const Årstall = styled.span`
    margin: 0 1rem;
`;

const SimuleringÅrvelger: React.FC<{ årsvelger: ISimuleringÅrsvelger }> = ({ årsvelger }) => {
    const { settÅr, muligeÅr, valgtÅr } = årsvelger;
    const kanVelgeForrigeÅr = muligeÅr.some((muligÅr) => muligÅr < valgtÅr);
    const kanVelgeNesteÅr = muligeÅr.some((muligÅr) => muligÅr > valgtÅr);
    return (
        <div>
            <Knapp disabled={!kanVelgeForrigeÅr} onClick={() => settÅr(valgtÅr - 1)} kompakt mini>
                <VenstreChevron />
            </Knapp>
            <Årstall className="typo-undertittel">{valgtÅr}</Årstall>
            <Knapp disabled={!kanVelgeNesteÅr} onClick={() => settÅr(valgtÅr + 1)} kompakt mini>
                <HoyreChevron />
            </Knapp>
        </div>
    );
};

export default SimuleringÅrvelger;
