import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import styled from 'styled-components';
import Dokumentasjonsvisning from './Dokumentasjonsvisning';
import { TidligereUtdanninger } from '../Aktivitet/Utdanning';
import { IAktivitet } from '../../../../App/typer/aktivitetstyper';
import { BodyLongSmall, BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { NavdsGlobalColorBlue300 } from '@navikt/ds-tokens/dist/tokens';

const BlåStrek = styled.span`
    border-left: 2px solid ${NavdsGlobalColorBlue300};
    margin-left: 0.33rem;
`;

const Flex = styled.div`
    display: flex;
    margin-top: 0.25rem;
    margin-bottom: 1rem;
`;

const BegrunnelseTekst = styled(BodyLongSmall)`
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
                            <BodyShortSmall>Målet med utdanningen</BodyShortSmall>
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
                            <BodyShortSmall>Har tatt utdanning etter grunnskolen?</BodyShortSmall>
                            <BodyShortSmall>
                                {underUtdanning?.utdanningEtterGrunnskolen ? 'Ja' : 'Nei'}
                            </BodyShortSmall>
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
