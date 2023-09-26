import * as React from 'react';
import styled from 'styled-components';
import { PersonHeadsetIcon } from '@navikt/aksel-icons';
import { BodyShort, Tooltip } from '@navikt/ds-react';
import { behandlingStatusTilTekst } from '../../../App/typer/behandlingstatus';
import { Behandling, behandlingResultatTilTekst } from '../../../App/typer/fagsak';
import { formaterIsoDato, formaterIsoDatoTid } from '../../../App/utils/formatter';
import { useBehandling } from '../../../App/context/BehandlingContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { AnsvarligSaksbehandlerRolle } from '../../../App/typer/saksbehandler';
import {
    ATextSubtle,
    ASurfaceSuccess,
    ASurfaceWarning,
    ASurfaceNeutral,
} from '@navikt/ds-tokens/dist/tokens';

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

const FontStyledBodyShort = styled(BodyShort)<{ fontStyle: string }>`
    font-style: ${(props) => props.fontStyle};
`;

const PersonIkon = styled(PersonHeadsetIcon)`
    width: 3rem;
    height: 3rem;
`;

const StatusBar = styled.span<{ color: string }>`
    width: 100%;
    border-top: 4px solid ${(props) => props.color};
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

const TilegnetSaksbehandler: React.FC<Props> = ({ behandling }) => {
    const { ansvarligSaksbehandler } = useBehandling();

    const utledStatusbarFarge = (
        ansvarligSaksbehandlerRolle: AnsvarligSaksbehandlerRolle
    ): string => {
        switch (ansvarligSaksbehandlerRolle) {
            case AnsvarligSaksbehandlerRolle.IKKE_SATT:
                return ASurfaceNeutral;
            case AnsvarligSaksbehandlerRolle.INNLOGGET_SAKSBEHANDLER:
                return ASurfaceSuccess;
            case AnsvarligSaksbehandlerRolle.ANNEN_SAKSBEHANDLER:
                return ASurfaceWarning;
            default:
                return ASurfaceNeutral;
        }
    };

    return (
        <DataViewer response={{ ansvarligSaksbehandler }}>
            {({ ansvarligSaksbehandler }) => {
                const statusBarFarge = utledStatusbarFarge(ansvarligSaksbehandler?.rolle);

                const behandlingHarAnsvarligSaksbehandler =
                    ansvarligSaksbehandler.rolle ===
                        AnsvarligSaksbehandlerRolle.INNLOGGET_SAKSBEHANDLER ||
                    ansvarligSaksbehandler.rolle ===
                        AnsvarligSaksbehandlerRolle.ANNEN_SAKSBEHANDLER;

                const visingsnavn = behandlingHarAnsvarligSaksbehandler
                    ? `${ansvarligSaksbehandler.fornavn} ${ansvarligSaksbehandler.etternavn}`
                    : 'ingen ansvarlig';

                const fontStyle = behandlingHarAnsvarligSaksbehandler ? 'normal' : 'italic';

                const skalViseAnsvarligSaksbehandler =
                    ansvarligSaksbehandler.rolle !==
                    AnsvarligSaksbehandlerRolle.OPPGAVE_FINNES_IKKE;

                return (
                    <Container>
                        <FlexBoxColumnFullWidth>
                            {skalViseAnsvarligSaksbehandler && (
                                <>
                                    <FlexBoxRow>
                                        <PersonIkon />
                                        <FlexBoxColumn>
                                            <GråBodyShort size={'small'}>
                                                Ansvarlig saksbehandler
                                            </GråBodyShort>
                                            <FontStyledBodyShort
                                                fontStyle={fontStyle}
                                                size={'small'}
                                            >
                                                {visingsnavn}
                                            </FontStyledBodyShort>
                                        </FlexBoxColumn>
                                    </FlexBoxRow>
                                    <StatusBar color={statusBarFarge} />
                                </>
                            )}
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
            }}
        </DataViewer>
    );
};

export default TilegnetSaksbehandler;
