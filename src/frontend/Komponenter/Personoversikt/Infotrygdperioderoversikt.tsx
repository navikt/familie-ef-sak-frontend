import React, { useMemo, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import 'nav-frontend-tabell-style';
import styled from 'styled-components';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { InfotrygdPerioderResponse, Perioder } from '../../App/typer/infotrygd';
import MigrerFagsak from '../Migrering/MigrerFagsak';
import InfotrygdSaker from '../Migrering/InfotrygdSaker';
import { IFagsakPerson } from '../../App/typer/fagsak';
import { Stønadstype } from '../../App/typer/behandlingstema';
import SummertePerioder from '../Migrering/SummertePerioder';
import InfotrygdPerioder from '../Migrering/InfotrygdPerioder';
import MigrerBarnetilsyn from '../Migrering/MigrerBarnetilsyn';
import { AlertInfo, AlertWarning } from '../../Felles/Visningskomponenter/Alerts';
import { Checkbox } from '@navikt/ds-react';
import { IHistoriskPensjon } from '../../App/typer/historiskpensjon';

const FlexBox = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
`;
const StyledAlertStripe = styled(AlertInfo)`
    width: 40rem;
`;

const StyledWarningStripe = styled(AlertWarning)`
    width: 40rem;
    vertical-align: text-top;
`;

const InfotrygdperioderoversiktContainer = styled.div`
    padding: 0.25rem;
`;

const CheckboxContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
`;

const InfotrygdEllerSummertePerioder: React.FC<{
    perioder: InfotrygdPerioderResponse;
    historiskPensjon: IHistoriskPensjon;
}> = ({ perioder, historiskPensjon }) => {
    const [visSummert, settVisSummert] = useState<boolean>(false);

    const visPerioder = (stønadstype: Stønadstype, visSummert: boolean, perioder: Perioder) => {
        return visSummert ? (
            <SummertePerioder stønadstype={stønadstype} perioder={perioder.summert} />
        ) : (
            <InfotrygdPerioder stønadstype={stønadstype} perioder={perioder.perioder} />
        );
    };

    const skalViseCheckbox =
        perioder.overgangsstønad.perioder.length > 0 ||
        perioder.barnetilsyn.perioder.length > 0 ||
        perioder.skolepenger.perioder.length > 0;

    return (
        <>
            <FlexBox>
                <StyledAlertStripe>
                    Denne siden viser vedtakshistorikk fra EV VP. (Saker før desember 2008 - PE PP
                    må sjekkes manuelt i Infotrygd)
                </StyledAlertStripe>
                {historiskPensjon.harPensjonsdata && (
                    <StyledWarningStripe>
                        Bruker har saker før desember 2008 som kan sees i{' '}
                        <a href={historiskPensjon.webAppUrl}>PE PP - Historisk pensjon</a>
                    </StyledWarningStripe>
                )}
            </FlexBox>
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
            <h2>Overgangsstønad</h2>
            {visPerioder(Stønadstype.OVERGANGSSTØNAD, visSummert, perioder.overgangsstønad)}

            <h2>Barnetilsyn</h2>
            {visPerioder(Stønadstype.BARNETILSYN, visSummert, perioder.barnetilsyn)}

            <h2>Skolepenger</h2>
            {visPerioder(Stønadstype.SKOLEPENGER, visSummert, perioder.skolepenger)}
        </>
    );
};

export const Infotrygdperioderoversikt: React.FC<{
    fagsakPerson: IFagsakPerson;
    personIdent: string;
}> = ({ fagsakPerson, personIdent }) => {
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
    const historiskPensjonConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/historiskpensjon/${personIdent}`,
        }),
        [personIdent]
    );

    const historiskPensjon = useDataHenter<IHistoriskPensjon, null>(historiskPensjonConfig);

    return (
        <DataViewer response={{ infotrygdPerioder, historiskPensjon }}>
            {({ infotrygdPerioder, historiskPensjon }) => (
                <InfotrygdperioderoversiktContainer>
                    <InfotrygdEllerSummertePerioder
                        perioder={infotrygdPerioder}
                        historiskPensjon={historiskPensjon}
                    />
                    <InfotrygdSaker personIdent={personIdent} />
                    <MigrerFagsak fagsakPerson={fagsakPerson} />
                    <MigrerBarnetilsyn fagsakPerson={fagsakPerson} />
                </InfotrygdperioderoversiktContainer>
            )}
        </DataViewer>
    );
};
