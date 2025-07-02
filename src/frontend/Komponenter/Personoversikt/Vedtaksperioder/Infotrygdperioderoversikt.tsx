import React, { useMemo, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import styled from 'styled-components';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { InfotrygdPerioderResponse, Perioder } from '../../../App/typer/infotrygd';
import MigrerFagsak from '../../Migrering/MigrerFagsak';
import InfotrygdSaker from '../../Migrering/InfotrygdSaker';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import SummertePerioder from '../../Migrering/SummertePerioder';
import InfotrygdPerioder from '../../Migrering/InfotrygdPerioder';
import MigrerBarnetilsyn from '../../Migrering/MigrerBarnetilsyn';
import { AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';
import { BodyShort, Checkbox, Heading, HStack, VStack } from '@navikt/ds-react';
import Historiskpensjon from '../Historiskpensjon/Historiskpensjon';
import { VedtaksperiodeContainer } from './Felles/VedtaksperiodeContainer';

const CheckboxContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
`;

const InfotrygdEllerSummertePerioder: React.FC<{
    perioder: InfotrygdPerioderResponse;
    fagsakPersonId: string;
}> = ({ perioder, fagsakPersonId }) => {
    const [visSummert, settVisSummert] = useState<boolean>(false);

    const skalViseCheckbox =
        perioder.overgangsstønad.perioder.length > 0 ||
        perioder.barnetilsyn.perioder.length > 0 ||
        perioder.skolepenger.perioder.length > 0;

    return (
        <>
            <HStack gap="space-16">
                <AlertInfo>
                    <BodyShort>
                        Denne siden viser vedtaksperioder fra og med desember 2008
                    </BodyShort>
                </AlertInfo>
                <Historiskpensjon fagsakPersonId={fagsakPersonId} />
            </HStack>
            <CheckboxContainer>
                {skalViseCheckbox && (
                    <Checkbox
                        onChange={() => {
                            settVisSummert((prevState) => !prevState);
                        }}
                        checked={visSummert}
                    >
                        Vis summerte perioder
                    </Checkbox>
                )}
            </CheckboxContainer>

            <TittelOgPerioder
                tittel="Overgangsstønad"
                stønadstype={Stønadstype.OVERGANGSSTØNAD}
                visSummert={visSummert}
                perioder={perioder.overgangsstønad}
            />

            <TittelOgPerioder
                tittel="Barnetilsyn"
                stønadstype={Stønadstype.BARNETILSYN}
                visSummert={visSummert}
                perioder={perioder.barnetilsyn}
            />

            <TittelOgPerioder
                tittel="Skolepenger"
                stønadstype={Stønadstype.SKOLEPENGER}
                visSummert={visSummert}
                perioder={perioder.skolepenger}
            />
        </>
    );
};

export const Infotrygdperioderoversikt: React.FC<{
    fagsakPersonId: string;
    personIdent: string;
}> = ({ fagsakPersonId, personIdent }) => {
    const infotrygdPerioderConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'POST',
            url: `/familie-ef-sak/api/infotrygd/perioder`,
            data: {
                personIdent,
            },
        }),
        [personIdent]
    );
    const infotrygdPerioder = useDataHenter<InfotrygdPerioderResponse, null>(
        infotrygdPerioderConfig
    );

    return (
        <DataViewer response={{ infotrygdPerioder }}>
            {({ infotrygdPerioder }) => (
                <VedtaksperiodeContainer>
                    <VStack gap="space-16">
                        <InfotrygdEllerSummertePerioder
                            perioder={infotrygdPerioder}
                            fagsakPersonId={fagsakPersonId}
                        />
                        <InfotrygdSaker personIdent={personIdent} />
                        <MigrerFagsak fagsakPersonId={fagsakPersonId} />
                        <MigrerBarnetilsyn fagsakPersonId={fagsakPersonId} />
                    </VStack>
                </VedtaksperiodeContainer>
            )}
        </DataViewer>
    );
};

const TittelOgPerioder: React.FC<{
    tittel: string;
    stønadstype: Stønadstype;
    visSummert: boolean;
    perioder: Perioder;
}> = ({ tittel, stønadstype, visSummert, perioder }) => {
    const visPerioder = (stønadstype: Stønadstype, visSummert: boolean, perioder: Perioder) => {
        return visSummert ? (
            <SummertePerioder stønadstype={stønadstype} perioder={perioder.summert} />
        ) : (
            <InfotrygdPerioder stønadstype={stønadstype} perioder={perioder.perioder} />
        );
    };

    return (
        <div>
            <Heading size={'medium'}>{tittel}</Heading>
            {visPerioder(stønadstype, visSummert, perioder)}
        </div>
    );
};
