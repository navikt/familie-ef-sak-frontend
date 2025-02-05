import React, { useState } from 'react';
import { Button, HStack } from '@navikt/ds-react';
import { CalculatorIcon } from '@navikt/aksel-icons';
import styled from 'styled-components';
import { SamværKalkulator } from '../../../../Felles/Kalkulator/SamværKalkulator';
import { AGray300, AGray50 } from '@navikt/ds-tokens/dist/tokens';
import { Samværsavtale } from '../../../../App/typer/samværsavtale';
import { useBehandling } from '../../../../App/context/BehandlingContext';

const Samværskalkulator = styled(SamværKalkulator)`
    padding: 1rem;
    background-color: white;
    border: 1rem solid ${AGray50};
`;

const StyledHStack = styled(HStack)<{ $borderBottom: boolean }>`
    border-bottom: ${(props) => (props.$borderBottom ? `1px solid ${AGray300}` : 'none')};
`;

const Divider = styled.div`
    margin: 1rem;
    border-bottom: 1px solid ${AGray300};
`;

enum Visningsmodus {
    REDIGERINGSMODUS_INGEN_PÅBEGYNT_AVTALE,
    REDIGERINGSMODUS_HAR_PÅBEGYNT_AVTALE,
    VISNINGSMODUS_INGEN_LAGRET_AVTALE,
    VISNINGSMODUS_HAR_LAGRET_AVTALE,
}

const utledVisningsmodus = (
    behandlingErRedigerbar: boolean,
    samværsavtale: Samværsavtale | undefined
) => {
    if (behandlingErRedigerbar) {
        return samværsavtale === undefined
            ? Visningsmodus.REDIGERINGSMODUS_INGEN_PÅBEGYNT_AVTALE
            : Visningsmodus.REDIGERINGSMODUS_HAR_PÅBEGYNT_AVTALE;
    }
    return samværsavtale === undefined
        ? Visningsmodus.VISNINGSMODUS_INGEN_LAGRET_AVTALE
        : Visningsmodus.VISNINGSMODUS_HAR_LAGRET_AVTALE;
};

interface Props {
    samværsavtale: Samværsavtale | undefined;
    oppdaterSamværsavtale: () => void;
    skalViseBorderBottom: boolean;
}

export const SamværskalkulatorAleneomsorg: React.FC<Props> = ({
    samværsavtale,
    skalViseBorderBottom,
}) => {
    const { behandlingErRedigerbar } = useBehandling();

    const [visningsmodus, settVisningsmodus] = useState<Visningsmodus>(
        utledVisningsmodus(behandlingErRedigerbar, samværsavtale)
    );

    if (visningsmodus === Visningsmodus.REDIGERINGSMODUS_INGEN_PÅBEGYNT_AVTALE) {
        return (
            <StyledHStack $borderBottom={skalViseBorderBottom} justify="end" margin="4" padding="4">
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
    }

    if (visningsmodus === Visningsmodus.REDIGERINGSMODUS_HAR_PÅBEGYNT_AVTALE) {
        return (
            <>
                <Samværskalkulator
                    onClose={() =>
                        settVisningsmodus(Visningsmodus.REDIGERINGSMODUS_HAR_PÅBEGYNT_AVTALE)
                    }
                />
                {skalViseBorderBottom && <Divider />}
            </>
        );
    }
};
