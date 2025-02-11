import React, { useState } from 'react';
import { BodyShort, Button, HStack, Label } from '@navikt/ds-react';
import { CalculatorIcon, ChevronDownIcon } from '@navikt/aksel-icons';
import styled from 'styled-components';
import {
    Samværskalkulator,
    kalkulerSamværsandeler,
} from '../../../../Felles/Kalkulator/Samværskalkulator';
import { AGray300, AGray50, ASurfaceDefault } from '@navikt/ds-tokens/dist/tokens';
import {
    Samværsandel,
    Samværsavtale,
    Samværsdag,
    Samværsuke,
} from '../../../../App/typer/samværsavtale';
import { useBehandling } from '../../../../App/context/BehandlingContext';

const Kalkulator = styled(Samværskalkulator)`
    padding: 1rem;
    background-color: ${ASurfaceDefault};
    border: 1rem solid ${AGray50};
`;

const StyledHStack = styled(HStack)<{ $borderBottom: boolean }>`
    border-bottom: ${(props) => (props.$borderBottom ? `1px solid ${AGray300}` : 'none')};
`;

const Divider = styled.div`
    margin: 1rem;
    border-bottom: 1px solid ${AGray300};
`;

const OppsummeringContainer = styled(HStack)`
    padding-left: 1rem;
    background: ${ASurfaceDefault};
    border: 1rem solid ${AGray50};
`;

enum Visningsmodus {
    REDIGERINGSMODUS_INGEN_LAGRET_AVTALE,
    REDIGERINGSMODUS_HAR_PÅBEGYNT_AVTALE,
    REDIGERINGSMODUS_HAR_LAGRET_AVTALE,
    VISNINGSMODUS_INGEN_LAGRET_AVTALE,
    VISNINGSMODUS_HAR_LAGRET_AVTALE,
}

const samværsdag: Samværsdag = {
    andeler: [],
};

const samværsuke: Samværsuke = {
    mandag: samværsdag,
    tirsdag: samværsdag,
    onsdag: samværsdag,
    torsdag: samværsdag,
    fredag: samværsdag,
    lørdag: samværsdag,
    søndag: samværsdag,
};

const initerSamværsuker = (antallUker: number): Samværsuke[] =>
    new Array(antallUker).fill(samværsuke);

const initierSamværsavtale = (behandlingId: string, behandlingBarnId: string): Samværsavtale => {
    return {
        behandlingId: behandlingId,
        behandlingBarnId: behandlingBarnId,
        uker: initerSamværsuker(2),
    };
};

const utledInitiellSamværsavtale = (
    lagretAvtale: Samværsavtale | undefined,
    behandlingId: string,
    behandlingBarnId: string
) => {
    if (lagretAvtale === undefined) {
        return initierSamværsavtale(behandlingId, behandlingBarnId);
    }

    return lagretAvtale;
};

const utledInitiellVisningsmodus = (
    behandlingErRedigerbar: boolean,
    samværsavtale: Samværsavtale | undefined
) => {
    if (behandlingErRedigerbar) {
        return samværsavtale === undefined
            ? Visningsmodus.REDIGERINGSMODUS_INGEN_LAGRET_AVTALE
            : Visningsmodus.REDIGERINGSMODUS_HAR_LAGRET_AVTALE;
    }
    return samværsavtale === undefined
        ? Visningsmodus.VISNINGSMODUS_INGEN_LAGRET_AVTALE
        : Visningsmodus.VISNINGSMODUS_HAR_LAGRET_AVTALE;
};

interface Props {
    lagretSamværsavtale: Samværsavtale | undefined;
    skalViseBorderBottom: boolean;
    behandlingBarnId: string;
    behandlingId: string;
    lagreSamværsavtale: (avtale: Samværsavtale) => void;
    slettSamværsavtale: (behandlingId: string, behandlingBarnId: string) => void;
}

export const SamværskalkulatorAleneomsorg: React.FC<Props> = ({
    lagretSamværsavtale,
    skalViseBorderBottom,
    behandlingBarnId,
    behandlingId,
    lagreSamværsavtale,
    slettSamværsavtale,
}) => {
    const { behandlingErRedigerbar, hentBehandling } = useBehandling();

    const [samværsavtale, settSamværsavtale] = useState<Samværsavtale>(
        utledInitiellSamværsavtale(lagretSamværsavtale, behandlingId, behandlingBarnId)
    );
    const [visningsmodus, settVisningsmodus] = useState<Visningsmodus>(
        utledInitiellVisningsmodus(behandlingErRedigerbar, lagretSamværsavtale)
    );

    const oppdaterSamværsuke = (
        ukeIndex: number,
        ukedag: string,
        samværsandeler: Samværsandel[]
    ) => {
        settSamværsavtale((prevState) => ({
            ...prevState,
            uker: [
                ...prevState.uker.slice(0, ukeIndex),
                { ...prevState.uker[ukeIndex], [ukedag]: { andeler: samværsandeler } },
                ...prevState.uker.slice(ukeIndex + 1),
            ],
        }));
    };

    const oppdaterVarighetPåSamværsavtale = (nyVarighet: number) => {
        const nåværendeVarighet = samværsavtale.uker.length;

        if (nyVarighet > nåværendeVarighet) {
            settSamværsavtale((prevState) => ({
                ...prevState,
                uker: [
                    ...prevState.uker.slice(0, nåværendeVarighet),
                    ...initerSamværsuker(nyVarighet - nåværendeVarighet),
                ],
            }));
        } else {
            settSamværsavtale((prevState) => ({
                ...prevState,
                uker: prevState.uker.slice(0, nyVarighet),
            }));
        }
    };

    const håndterLukkKalkulator = () => {
        settVisningsmodus(utledInitiellVisningsmodus(behandlingErRedigerbar, lagretSamværsavtale));
        settSamværsavtale(
            utledInitiellSamværsavtale(lagretSamværsavtale, behandlingId, behandlingBarnId)
        );
    };

    const håndterLagreSamværsavtale = () => {
        lagreSamværsavtale(samværsavtale);
        settVisningsmodus(Visningsmodus.REDIGERINGSMODUS_HAR_LAGRET_AVTALE);
        hentBehandling.rerun();
    };

    const håndterSlettSamværsavtale = () => {
        slettSamværsavtale(behandlingId, behandlingBarnId);
        settVisningsmodus(Visningsmodus.REDIGERINGSMODUS_INGEN_LAGRET_AVTALE);
        settSamværsavtale(
            utledInitiellSamværsavtale(lagretSamværsavtale, behandlingId, behandlingBarnId)
        );
        hentBehandling.rerun();
    };

    const [samværsandelerDagVisning, samværsandelProsentVisning] = kalkulerSamværsandeler(
        samværsavtale.uker
    );

    switch (visningsmodus) {
        case Visningsmodus.REDIGERINGSMODUS_INGEN_LAGRET_AVTALE:
            return (
                <StyledHStack
                    $borderBottom={skalViseBorderBottom}
                    justify="end"
                    margin="4"
                    padding="4"
                >
                    <Button
                        type="button"
                        size="small"
                        onClick={() =>
                            settVisningsmodus(Visningsmodus.REDIGERINGSMODUS_HAR_PÅBEGYNT_AVTALE)
                        }
                    >
                        <CalculatorIcon aria-hidden fontSize="1.5rem" />
                    </Button>
                </StyledHStack>
            );
        case Visningsmodus.REDIGERINGSMODUS_HAR_LAGRET_AVTALE:
            return (
                <>
                    <OppsummeringContainer justify="space-between" align="center">
                        <HStack align="center" gap="4">
                            <HStack gap="2" align="center">
                                <CalculatorIcon aria-hidden />
                                <Label>Samværsandel:</Label>
                            </HStack>
                            <BodyShort size="medium">{samværsandelerDagVisning}</BodyShort>
                            <BodyShort size="medium">{samværsandelProsentVisning}</BodyShort>
                        </HStack>
                        <HStack gap="4">
                            <Button
                                size="medium"
                                variant="tertiary"
                                icon={<ChevronDownIcon />}
                                onClick={() =>
                                    settVisningsmodus(
                                        Visningsmodus.REDIGERINGSMODUS_HAR_PÅBEGYNT_AVTALE
                                    )
                                }
                            />
                        </HStack>
                    </OppsummeringContainer>
                    {skalViseBorderBottom && <Divider />}
                </>
            );
        case Visningsmodus.REDIGERINGSMODUS_HAR_PÅBEGYNT_AVTALE:
        case Visningsmodus.VISNINGSMODUS_HAR_LAGRET_AVTALE:
            return (
                <>
                    <Kalkulator
                        samværsuker={samværsavtale?.uker}
                        onSave={() => håndterLagreSamværsavtale()}
                        onDelete={() => håndterSlettSamværsavtale()}
                        onClose={() => håndterLukkKalkulator()}
                        oppdaterSamværsuke={oppdaterSamværsuke}
                        oppdaterVarighet={oppdaterVarighetPåSamværsavtale}
                    />
                    {skalViseBorderBottom && <Divider />}
                </>
            );
        case Visningsmodus.VISNINGSMODUS_INGEN_LAGRET_AVTALE:
            return <></>;
    }
};
