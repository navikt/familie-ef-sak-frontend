import React from 'react';
import styled from 'styled-components';
import { BodyShort, Heading } from '@navikt/ds-react';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import {
    IGrunnlagsdataPeriodeHistorikkOvergangsstønad,
    IGrunnlagsdataPeriodeHistorikkBarnetilsyn,
} from './typer';
import KortInnholdBarnetilsyn from './barnetilsyn/KortInnholdBarnetilsyn';
import KortInnholdOvergangsstønad from './overgangsstønad/KortInnholdOvergangsstønad';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: #f3fcf5;
    padding: 1rem;
    border: 1px solid rgba(0, 0, 0, 0.19);
    border-radius: 6px;
    text-align: left;
`;

const Tittel = styled(Heading)`
    text-decoration: underline;
`;
const HistorikkIEfKort: React.FC<{
    periodeHistorikkData:
        | IGrunnlagsdataPeriodeHistorikkOvergangsstønad[]
        | IGrunnlagsdataPeriodeHistorikkBarnetilsyn[]
        | undefined;
    stønadstype: string;
}> = ({ periodeHistorikkData, stønadstype }) => {
    const harPeriodehistorikk = periodeHistorikkData && periodeHistorikkData?.length > 0;

    const erOvergansstønadMedHistorikk =
        stønadstype === Stønadstype.OVERGANGSSTØNAD && harPeriodehistorikk;

    const erBarnetilsynMedHistorikk =
        stønadstype === Stønadstype.BARNETILSYN && harPeriodehistorikk;

    return (
        <>
            <Container>
                <Tittel level="3" size="small">
                    Historikk i EF Sak
                </Tittel>
                <div>
                    {erOvergansstønadMedHistorikk && (
                        <KortInnholdOvergangsstønad periodeHistorikkData={periodeHistorikkData} />
                    )}
                    {erBarnetilsynMedHistorikk && (
                        <KortInnholdBarnetilsyn periodeHistorikkData={periodeHistorikkData} />
                    )}
                    {!erOvergansstønadMedHistorikk && !erBarnetilsynMedHistorikk && (
                        <BodyShort size="small">Kan ikke vise tidligere historikk.</BodyShort>
                    )}
                </div>
            </Container>
        </>
    );
};

export default HistorikkIEfKort;
