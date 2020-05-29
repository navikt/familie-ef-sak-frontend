import NavFrontendSpinner from 'nav-frontend-spinner';
import { Systemtittel } from 'nav-frontend-typografi';
import * as React from 'react';
import styled from 'styled-components';

const StyledSystemetLaster = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 1000;
`;

const StyledWrapper = styled.div`
    left: calc(50% - 7.5rem);
    position: absolute;
    top: 20%;
    width: 15rem;
    text-align: center;
`;

const StyledSpinner = styled.div`
    margin-top: 3rem;
    height: 10rem;
    width: 10rem;
`;

const SystemetLaster = () => {
    return (
        <StyledSystemetLaster>
            <StyledWrapper>
                <Systemtittel children={'Systemet laster'} />
                <StyledSpinner>
                    <NavFrontendSpinner
                        className={'systemet-laster__content--spinner'}
                        transparent={true}
                    />
                </StyledSpinner>
            </StyledWrapper>
        </StyledSystemetLaster>
    );
};

export default SystemetLaster;
