import React, { FC } from 'react';
import styled from 'styled-components';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import GrønnHake from '../../../ikoner/GrønnHake';
import Advarsel from '../../../ikoner/Advarsel';
import { IInngangsvilkår } from './vilkår';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import Register from '../../../ikoner/Register';
import Søknad from '../../../ikoner/Søknad';

const StyledTabell = styled.div`
    display: grid;
    grid-template-columns: repeat(3, max-content);
    grid-auto-rows: min-content;
    grid-gap: 1rem;

    svg {
        max-height: 24px;
        grid-column: 1/2;
    }

    .tittel {
        grid-column: 2/4;
        padding-bottom: 1rem;
    }
`;

const StyledLesmerpanel = styled.div`
    .lesMerPanel {
        padding: 0;
    }
`;

interface Props {
    inngangsvilkår: IInngangsvilkår;
}

const BooleanTekst = (props: { value: boolean }) => (
    <Normaltekst>{props.value ? 'Ja' : 'Nei'}</Normaltekst>
);

const RegisterGrunnlag = () => <Register width={16} heigth={14} />;
const SøknadGrunnlag = () => <Søknad width={13} heigth={19} />;

const Vilkårsvisning: FC<Props> = ({ inngangsvilkår }) => {
    const erVurdert = false;

    const medlemskap = inngangsvilkår.medlemskap;
    const registerGrunnlag = medlemskap.registerGrunnlag;
    const søknadGrunnlag = medlemskap.søknadGrunnlag;
    return (
        <>
            <StyledTabell>
                {erVurdert ? <GrønnHake /> : <Advarsel />}
                <Element className="tittel">Medlemskap</Element>

                <RegisterGrunnlag />
                <Normaltekst>Statsborgerskap</Normaltekst>
                <Normaltekst>{registerGrunnlag.nåværendeStatsborgerskap.join(', ')}</Normaltekst>

                <SøknadGrunnlag />
                <Normaltekst>Søker og barn oppholder seg i Norge</Normaltekst>
                <BooleanTekst value={søknadGrunnlag.oppholderDuDegINorge} />

                <SøknadGrunnlag />
                <Normaltekst>Har bodd i Norge siste tre år</Normaltekst>
                <BooleanTekst value={søknadGrunnlag.bosattNorgeSisteÅrene} />
            </StyledTabell>

            <StyledLesmerpanel>
                <Lesmerpanel
                    apneTekst={'Vis info om medlemskap'}
                    lukkTekst={'Lukk info om medlemskap'}
                >
                    <StyledTabell>
                        <Normaltekst>ddd</Normaltekst>
                        <Normaltekst>ddd</Normaltekst>
                        <Normaltekst>ddd</Normaltekst>
                    </StyledTabell>
                </Lesmerpanel>
            </StyledLesmerpanel>
        </>
    );
};

export default Vilkårsvisning;
