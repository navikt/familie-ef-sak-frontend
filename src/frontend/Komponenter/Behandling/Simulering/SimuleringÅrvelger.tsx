import React from 'react';
import { ISimuleringÅrsvelger } from './SimuleringTyper';
import styled from 'styled-components';
import { Button } from '@navikt/ds-react';
import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';

const Årstall = styled.span`
    margin: 0 1rem;
`;

const SimuleringÅrvelger: React.FC<{ årsvelger: ISimuleringÅrsvelger }> = ({ årsvelger }) => {
    const { settÅr, muligeÅr, valgtÅr } = årsvelger;
    const kanVelgeForrigeÅr = muligeÅr.some((muligÅr) => muligÅr < valgtÅr);
    const kanVelgeNesteÅr = muligeÅr.some((muligÅr) => muligÅr > valgtÅr);
    return (
        <div>
            <Button
                icon={<ArrowLeftIcon />}
                disabled={!kanVelgeForrigeÅr}
                onClick={() => settÅr(valgtÅr - 1)}
                size={'small'}
            />
            <Årstall>{valgtÅr}</Årstall>
            <Button
                icon={<ArrowRightIcon />}
                disabled={!kanVelgeNesteÅr}
                onClick={() => settÅr(valgtÅr + 1)}
                size={'small'}
            />
        </div>
    );
};

export default SimuleringÅrvelger;
