import React from 'react';
import { SimuleringÅrsvelger } from './SimuleringTyper';
import { Button, HStack, Label } from '@navikt/ds-react';
import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';

const ÅrVelger: React.FC<{ årsvelger: SimuleringÅrsvelger }> = ({ årsvelger }) => {
    const { settÅr, muligeÅr, valgtÅr } = årsvelger;
    const kanVelgeForrigeÅr = muligeÅr.some((muligÅr) => muligÅr < valgtÅr);
    const kanVelgeNesteÅr = muligeÅr.some((muligÅr) => muligÅr > valgtÅr);
    return (
        <HStack align="center" gap="4">
            <Button
                icon={<ArrowLeftIcon />}
                disabled={!kanVelgeForrigeÅr}
                onClick={() => settÅr(valgtÅr - 1)}
                size={'small'}
            />
            <Label>{valgtÅr}</Label>
            <Button
                icon={<ArrowRightIcon />}
                disabled={!kanVelgeNesteÅr}
                onClick={() => settÅr(valgtÅr + 1)}
                size={'small'}
            />
        </HStack>
    );
};

export default ÅrVelger;
