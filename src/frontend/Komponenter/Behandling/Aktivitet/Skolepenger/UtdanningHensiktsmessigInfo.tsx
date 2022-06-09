import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { Normaltekst } from 'nav-frontend-typografi';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import Dokumentasjonsvisning from './Dokumentasjonsvisning';
import { TidligereUtdanninger } from '../Aktivitet/Utdanning';
import { IAktivitet } from '../../../../App/typer/aktivitetstyper';

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

const HovedTabell = styled(GridTabell)`
    margin-bottom: 0rem;
`;

const UtdanningTabell = styled(GridTabell)`
    margin-bottom: 0.5rem;
`;

interface Props {
    aktivitet: IAktivitet;
    skalViseSøknadsdata: boolean;
}

const UtdanningHensiktsmessigInfo: FC<Props> = ({ aktivitet, skalViseSøknadsdata }) => {
    const { underUtdanning, tidligereUtdanninger } = aktivitet;
    return (
        <>
            {skalViseSøknadsdata ? (
                <>
                    <HovedTabell>
                        <Dokumentasjonsvisning
                            aktivitet={aktivitet}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                        />
                        <>
                            <Søknadsgrunnlag />
                            <Normaltekst>Målet med utdanningen</Normaltekst>
                        </>
                    </HovedTabell>
                    <Flex>
                        <BlåStrek />
                        <BegrunnelseTekst>
                            {underUtdanning?.hvaErMåletMedUtdanningen}
                        </BegrunnelseTekst>
                    </Flex>
                    <UtdanningTabell>
                        <>
                            <Søknadsgrunnlag />
                            <Normaltekst>Har tatt utdanning etter grunnskolen?</Normaltekst>
                            <Normaltekst>
                                {underUtdanning?.utdanningEtterGrunnskolen ? 'Ja' : 'Nei'}
                            </Normaltekst>
                        </>
                    </UtdanningTabell>
                    {underUtdanning?.utdanningEtterGrunnskolen && (
                        <GridTabell kolonner={3}>
                            <TidligereUtdanninger tidligereUtdanninger={tidligereUtdanninger} />
                        </GridTabell>
                    )}
                </>
            ) : null}
        </>
    );
};

export default UtdanningHensiktsmessigInfo;
