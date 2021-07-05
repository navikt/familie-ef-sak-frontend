import React, { useEffect, useState } from 'react';
import { FlexDiv } from '../../Oppgavebenk/OppgaveFiltrering';
import styled from 'styled-components';
import MånedVelger from './MånedVelger';
import Årvelger from './ÅrVelger';
import { SkjemaelementFeilmelding } from 'nav-frontend-skjema';

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
}

const DatolabelStyle = styled.label`
    margin-bottom: 0.5em;
`;

const StyledMånedVelger = styled(MånedVelger)`
    padding-right: 1em;
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
}) => {
    const [år, settÅr] = useState(
        årMånedInitiell ? parseInt(årMånedInitiell.split('-')[0], 10) : undefined
    );
    const [måned, settMåned] = useState(
        årMånedInitiell ? årMånedInitiell.split('-')[1] : undefined
    );

    useEffect(() => {
        if (år && måned) {
            onEndret(`${år}-${måned}`);
        } else {
            onEndret(undefined);
        }
    }, [år, måned]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={className} style={lesevisning ? { minWidth: '140px' } : {}}>
            {label && (
                <DatolabelStyle className="skjemaelement__label" htmlFor="regdatoTil">
                    {label}
                </DatolabelStyle>
            )}
            <FlexDiv>
                <StyledMånedVelger
                    måned={måned}
                    settMåned={settMåned}
                    lesevisning={lesevisning}
                    disabled={disabled}
                />
                <Årvelger
                    år={år}
                    settÅr={settÅr}
                    antallÅrTilbake={antallÅrTilbake}
                    antallÅrFrem={antallÅrFrem}
                    lesevisning={lesevisning}
                    disabled={disabled}
                />
            </FlexDiv>
            {feilmelding && <SkjemaelementFeilmelding>{feilmelding}</SkjemaelementFeilmelding>}
        </div>
    );
};

export default MånedÅrVelger;
