import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import Dokumentasjonsvisning from './Dokumentasjonsvisning';
import { TidligereUtdanninger } from '../Aktivitet/Utdanning';
import { IAktivitet } from '../../../../App/typer/aktivitetstyper';
import { BodyLongSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import { InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import { Box, VStack } from '@navikt/ds-react';

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
                    <VStack gap="3">
                        <Informasjonsrad
                            ikon={VilkårInfoIkon.SØKNAD}
                            label="Målet med utdanningen"
                            verdi={undefined}
                        />
                        <Box
                            borderColor="border-info"
                            borderWidth="0 0 0 2"
                            width="31rem"
                            paddingBlock="0 0"
                            paddingInline="5 0"
                            marginInline="1 0"
                        >
                            <BodyLongSmall style={{ marginLeft: '0.33rem' }}>
                                {underUtdanning?.hvaErMåletMedUtdanningen}
                            </BodyLongSmall>
                        </Box>
                    </VStack>
                    <VStack gap="3">
                        <Informasjonsrad
                            ikon={VilkårInfoIkon.SØKNAD}
                            label="Har tatt utdanning etter grunnskolen?"
                            verdi={underUtdanning?.utdanningEtterGrunnskolen ? 'Ja' : 'Nei'}
                        />
                        {underUtdanning?.utdanningEtterGrunnskolen && (
                            <GridTabell $kolonner={3} $underTabellMargin={0}>
                                <TidligereUtdanninger tidligereUtdanninger={tidligereUtdanninger} />
                            </GridTabell>
                        )}
                    </VStack>
                </InformasjonContainer>
            ) : null}
        </>
    );
};

export default UtdanningHensiktsmessigInfo;
