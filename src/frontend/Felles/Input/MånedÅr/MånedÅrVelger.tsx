import React, { useState } from 'react';
import styled from 'styled-components';
import MånedVelger from './MånedVelger';
import Årvelger from './ÅrVelger';
import { useEffectNotInitialRender } from '../../../App/hooks/felles/useEffectNotInitialRender';
import { EnsligErrorMessage } from '../../ErrorMessage/EnsligErrorMessage';

interface Props {
    className?: string;
    label?: string;
    årMånedInitiell?: string;
    onEndret: (årMåned?: string) => void;
    antallÅrTilbake: number;
    antallÅrFrem: number;
    feilmelding?: string | null;
    lesevisning?: boolean;
    disabled?: boolean;
    size?: 'medium' | 'small';
}

const DatolabelStyle = styled.label`
    margin-bottom: 0.5em;
`;

const FlexDiv = styled.div`
    display: flex;
    gap: 0.25rem;
`;

const MånedÅrVelger: React.FC<Props> = ({
    className,
    label,
    årMånedInitiell,
    onEndret,
    antallÅrTilbake = 10,
    antallÅrFrem = 4,
    feilmelding,
    lesevisning = false,
    disabled = false,
    size,
}) => {
    const [år, settÅr] = useState(
        årMånedInitiell ? parseInt(årMånedInitiell.split('-')[0], 10) : undefined
    );
    const [måned, settMåned] = useState(
        årMånedInitiell ? årMånedInitiell.split('-')[1] : undefined
    );

    useEffectNotInitialRender(() => {
        if (år && måned) {
            onEndret(`${år}-${måned}`);
        } else {
            onEndret(undefined);
        }
    }, [år, måned]);

    return (
        <div className={className} style={lesevisning ? { minWidth: '140px' } : {}}>
            {label && (
                <DatolabelStyle className="skjemaelement__label" htmlFor="regdatoTil">
                    {label}
                </DatolabelStyle>
            )}
            <FlexDiv>
                <MånedVelger
                    måned={måned}
                    settMåned={settMåned}
                    lesevisning={lesevisning}
                    disabled={disabled}
                    size={size}
                />
                <Årvelger
                    år={år}
                    settÅr={settÅr}
                    antallÅrTilbake={antallÅrTilbake}
                    antallÅrFrem={antallÅrFrem}
                    lesevisning={lesevisning}
                    disabled={disabled}
                    size={size}
                />
            </FlexDiv>
            <EnsligErrorMessage>{feilmelding}</EnsligErrorMessage>
        </div>
    );
};

export default MånedÅrVelger;
