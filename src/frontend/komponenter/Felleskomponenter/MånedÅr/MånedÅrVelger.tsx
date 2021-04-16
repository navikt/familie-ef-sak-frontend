import React, { useEffect, useState } from 'react';
import { FlexDiv } from '../../Oppgavebenk/OppgaveFiltrering';
import styled from 'styled-components';
import MånedVelger from './MånedVelger';
import Årvelger from './ÅrVelger';
import { SkjemaelementFeilmelding } from 'nav-frontend-skjema';

interface Props {
    label?: string;
    årMånedInitiell?: string;
    onEndret: (årMåned: string) => void;
    antallÅrTilbake: number;
    antallÅrFrem: number;
    feilmelding?: string;
}

const DatolabelStyle = styled.label`
    margin-bottom: 0.5em;
`;

const StyledMånedvelger = styled.div`
    padding-right: 0.5em;
`;

const StyledÅrvelger = styled.div`
    padding-right: 1.5em;
`;

const MånedÅrVelger: React.FC<Props> = ({
    label,
    årMånedInitiell,
    onEndret,
    antallÅrTilbake = 10,
    antallÅrFrem = 4,
    feilmelding,
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
        }
    }, [år, måned]);

    return (
        <div>
            <div>
                {label && (
                    <DatolabelStyle className="skjemaelement__label" htmlFor="regdatoTil">
                        {label}
                    </DatolabelStyle>
                )}
            </div>
            <FlexDiv>
                <StyledMånedvelger>
                    <MånedVelger måned={måned} settMåned={settMåned} />
                </StyledMånedvelger>
                <StyledÅrvelger>
                    <Årvelger
                        år={år}
                        settÅr={settÅr}
                        antallÅrTilbake={antallÅrTilbake}
                        antallÅrFrem={antallÅrFrem}
                    />
                </StyledÅrvelger>
            </FlexDiv>
            {feilmelding && <SkjemaelementFeilmelding>{feilmelding}</SkjemaelementFeilmelding>}
        </div>
    );
};

export default MånedÅrVelger;
