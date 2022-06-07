import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { IVilkårGrunnlag } from '../../Inngangsvilkår/vilkår';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';

const BlåStrek = styled.span`
    border-left: 2px solid ${navFarger.navBlaLighten40};
    margin-left: 0.33rem;
`;

const Flex = styled.div`
    display: flex;
    margin-top: 0.25rem;
    margin-bottom: 1rem;
`;

const BegrunnelseTekst = styled(Normaltekst)`
    margin-left: 1.32rem;
    max-width: 30rem;
`;

const StyledGridTabell = styled(GridTabell)`
    margin-bottom: 0rem;
`;

interface Props {
    grunnlag: IVilkårGrunnlag;
    skalViseSøknadsdata: boolean;
}

const UtdanningHensiktsmessigInfo: FC<Props> = () => {
    return (
        <>
            <StyledGridTabell>
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Skole/utdanningssted</Normaltekst>
                    <Normaltekst>VID vitenskapelig høgskole</Normaltekst>
                </>
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Linje/kurs/grad</Normaltekst>
                    <Normaltekst>Bachelor i sosialt arbeid</Normaltekst>
                </>
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Utadnningstype</Normaltekst>
                    <Normaltekst>Privat</Normaltekst>
                </>
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Studieperiode</Normaltekst>
                    <Normaltekst>01.08.2022 - 31.03.2022</Normaltekst>
                </>
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Studiebelastning</Normaltekst>
                    <Normaltekst>Deltid - 60%</Normaltekst>
                </>
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Målet med utdanningen</Normaltekst>
                </>
            </StyledGridTabell>
            <Flex>
                <BlåStrek />
                <BegrunnelseTekst>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{' '}
                    <br />
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum
                </BegrunnelseTekst>
            </Flex>
            <GridTabell>
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Har tatt utdanning etter grunnskolen?</Normaltekst>
                    <Normaltekst>Ja</Normaltekst>
                </>
            </GridTabell>
        </>
    );
};

export default UtdanningHensiktsmessigInfo;
