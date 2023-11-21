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
import { AGray400, AGreen50 } from '@navikt/ds-tokens/dist/tokens';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: ${AGreen50};
    padding: 1rem;
    border: 1px solid ${AGray400};
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
                        <KortInnholdOvergangsstønad
                            periodeHistorikkData={
                                periodeHistorikkData as IGrunnlagsdataPeriodeHistorikkOvergangsstønad[]
                            }
                        />
                    )}
                    {erBarnetilsynMedHistorikk && (
                        <KortInnholdBarnetilsyn
                            periodeHistorikkData={
                                periodeHistorikkData as IGrunnlagsdataPeriodeHistorikkBarnetilsyn[]
                            }
                        />
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
