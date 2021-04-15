import React from 'react';
import { FlexDiv } from '../../Oppgavebenk/OppgaveFiltrering';
import styled from 'styled-components';
import MånedVelger from './MånedVelger';
import Årvelger from './ÅrVelger';
import { SkjemaelementFeilmelding } from 'nav-frontend-skjema';

interface Props {
    label?: string;
    måned?: number;
    år?: number;
    settMåned: (måned: number) => void;
    settÅr: (år: number) => void;
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
    måned,
    år,
    label,
    settMåned,
    settÅr,
    antallÅrTilbake = 10,
    antallÅrFrem = 4,
    feilmelding,
}) => {
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
