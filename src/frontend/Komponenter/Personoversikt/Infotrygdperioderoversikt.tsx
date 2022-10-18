import React, { useMemo, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import 'nav-frontend-tabell-style';
import styled from 'styled-components';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { Checkbox } from 'nav-frontend-skjema';
import { InfotrygdPerioderResponse, Perioder } from '../../App/typer/infotrygd';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import MigrerFagsak from '../Migrering/MigrerFagsak';
import InfotrygdSaker from '../Migrering/InfotrygdSaker';
import { IFagsakPerson } from '../../App/typer/fagsak';
import { Stønadstype } from '../../App/typer/behandlingstema';
import SummertePerioder from '../Migrering/SummertePerioder';
import InfotrygdPerioder from '../Migrering/InfotrygdPerioder';
import { Migreringsstatus } from '../../App/typer/migrering';
import MigrerBarnetilsyn from '../Migrering/MigrerBarnetilsyn';

const StyledAlertStripe = styled(AlertStripeInfo)`
    margin: 1rem 0;
    max-width: 51rem;
    .alertstripe__tekst {
        max-width: 51rem;
    }
`;

const InfotrygdperioderoversiktContainer = styled.div`
    padding: 0.25rem;
`;

const CheckboxContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
`;

const InfotrygdEllerSummertePerioder: React.FC<{ perioder: InfotrygdPerioderResponse }> = ({
    perioder,
}) => {
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
            <StyledAlertStripe>
                Denne siden viser vedtakshistorikk fra EV VP. (Saker før desember 2008 - PE PP må
                sjekkes manuelt i Infotrygd)
            </StyledAlertStripe>
            <CheckboxContainer>
                {skalViseCheckbox && (
                    <Checkbox
                        label={'Vis summerte perioder'}
                        onChange={() => {
                            settVisSummert((prevState) => !prevState);
                        }}
                        checked={visSummert}
                    />
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
    onMigrert?: (status: Migreringsstatus) => void;
    fraOppgavebenken?: boolean;
}> = ({ fagsakPerson, personIdent, onMigrert, fraOppgavebenken }) => {
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
                <InfotrygdperioderoversiktContainer>
                    <InfotrygdEllerSummertePerioder perioder={infotrygdPerioder} />
                    <InfotrygdSaker personIdent={personIdent} />
                    <MigrerFagsak
                        fagsakPerson={fagsakPerson}
                        onMigrert={onMigrert}
                        fraOppgavebenken={fraOppgavebenken}
                    />
                    {!fraOppgavebenken && <MigrerBarnetilsyn fagsakPerson={fagsakPerson} />}
                </InfotrygdperioderoversiktContainer>
            )}
        </DataViewer>
    );
};
