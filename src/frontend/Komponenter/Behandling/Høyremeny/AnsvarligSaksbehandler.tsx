import * as React from 'react';
import styled from 'styled-components';
import { PersonHeadsetIcon } from '@navikt/aksel-icons';
import { ATextSubtle } from '@navikt/ds-tokens/dist/tokens';
import { BodyShort, Tooltip } from '@navikt/ds-react';
import { behandlingStatusTilTekst } from '../../../App/typer/behandlingstatus';
import { Behandling, behandlingResultatTilTekst } from '../../../App/typer/fagsak';
import { formaterIsoDato, formaterIsoDatoTid } from '../../../App/utils/formatter';

const Container = styled.div`
    padding: 1rem;
    width: 100%;
    display: flex;
    gap: 0.5rem;
`;

const FlexBoxRow = styled.div`
    align-items: center;
    display: flex;
    gap: 0.75rem;
`;

const FlexBoxColumn = styled.div`
    display: flex;
    flex-direction: column;
`;

const FlexBoxColumnFullWidth = styled(FlexBoxColumn)`
    width: 100%;
    gap: 0.75rem;
`;

const GråBodyShort = styled(BodyShort)`
    color: ${ATextSubtle};
`;

const PersonIkon = styled(PersonHeadsetIcon)`
    width: 3rem;
    height: 3rem;
`;

const StatusBar = styled.span<{ color: string }>`
    width: 100%;
    border-top: 4px solid black;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, max-content);
    row-gap: 1rem;
    column-gap: 1.5rem;
`;

interface Props {
    behandling: Behandling;
}

const Valgvisning: React.FC<Props> = ({ behandling }) => {
    return (
        <Container>
            <FlexBoxColumnFullWidth>
                <FlexBoxRow>
                    <PersonIkon />
                    <FlexBoxColumn>
                        <GråBodyShort size={'small'}>Ansvarlig saksbehandler </GråBodyShort>
                        <BodyShort size={'small'}>Bård Hoksrud</BodyShort>
                    </FlexBoxColumn>
                </FlexBoxRow>
                <StatusBar color={'green'} />
                <Grid>
                    <FlexBoxColumn>
                        <GråBodyShort size={'small'}>Behandlingsstatus</GråBodyShort>
                        <BodyShort size={'small'}>
                            {behandlingStatusTilTekst[behandling.status]}
                        </BodyShort>
                    </FlexBoxColumn>
                    <Tooltip content={formaterIsoDatoTid(behandling.opprettet)}>
                        <FlexBoxColumn>
                            <GråBodyShort size={'small'}>Opprettet</GråBodyShort>
                            <BodyShort size={'small'}>
                                {formaterIsoDato(behandling.opprettet)}
                            </BodyShort>
                        </FlexBoxColumn>
                    </Tooltip>
                    <FlexBoxColumn>
                        <GråBodyShort size={'small'}>Behandlingsresultat</GråBodyShort>
                        <BodyShort size={'small'}>
                            {behandlingResultatTilTekst[behandling.resultat]}
                        </BodyShort>
                    </FlexBoxColumn>
                    <Tooltip
                        content={formaterIsoDatoTid(behandling.sistEndret)}
                        placement={'bottom'}
                    >
                        <FlexBoxColumn>
                            <GråBodyShort size={'small'}>Sist endret</GråBodyShort>
                            <BodyShort size={'small'}>
                                {formaterIsoDato(behandling.sistEndret)}
                            </BodyShort>
                        </FlexBoxColumn>
                    </Tooltip>
                </Grid>
            </FlexBoxColumnFullWidth>
        </Container>
    );
};

export default Valgvisning;
