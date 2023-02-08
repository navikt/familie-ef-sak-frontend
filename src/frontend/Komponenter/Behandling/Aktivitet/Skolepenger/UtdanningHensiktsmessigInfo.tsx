import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import styled from 'styled-components';
import Dokumentasjonsvisning from './Dokumentasjonsvisning';
import { TidligereUtdanninger } from '../Aktivitet/Utdanning';
import { IAktivitet } from '../../../../App/typer/aktivitetstyper';
import { BodyLongSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { ABlue300 } from '@navikt/ds-tokens/dist/tokens';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import { FlexColumnContainer, InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';

const BlåStrek = styled.span`
    border-left: 2px solid ${ABlue300};
    margin-left: 0.33rem;
`;

const Flex = styled.div`
    display: flex;
`;

const BegrunnelseTekst = styled(BodyLongSmall)`
    margin-left: 1.32rem;
    max-width: 30rem;
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
                <InformasjonContainer>
                    <Dokumentasjonsvisning aktivitet={aktivitet} />
                    <FlexColumnContainer gap={0.75}>
                        <Informasjonsrad
                            ikon={VilkårInfoIkon.SØKNAD}
                            label="Målet med utdanningen"
                            verdi={undefined}
                        />
                        <Flex>
                            <BlåStrek />
                            <BegrunnelseTekst>
                                {underUtdanning?.hvaErMåletMedUtdanningen}
                            </BegrunnelseTekst>
                        </Flex>
                    </FlexColumnContainer>
                    <FlexColumnContainer gap={1}>
                        <Informasjonsrad
                            ikon={VilkårInfoIkon.SØKNAD}
                            label="Har tatt utdanning etter grunnskolen?"
                            verdi={underUtdanning?.utdanningEtterGrunnskolen ? 'Ja' : 'Nei'}
                        />
                        {underUtdanning?.utdanningEtterGrunnskolen && (
                            <GridTabell kolonner={3} underTabellMargin={0}>
                                <TidligereUtdanninger tidligereUtdanninger={tidligereUtdanninger} />
                            </GridTabell>
                        )}
                    </FlexColumnContainer>
                </InformasjonContainer>
            ) : null}
        </>
    );
};

export default UtdanningHensiktsmessigInfo;
